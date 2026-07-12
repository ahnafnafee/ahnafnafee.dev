'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

// Warp-drive starfield with a cursor-following "black hole" gravitational well,
// ported from the Three.js (r128) design prototype. Renders one continuous WebGL
// pass behind the home page hero. The tuning constants below are close to the
// prototype's defaults (medium density, gentle warp + pull).
const STAR_COUNT = 6000
const ABERRATION = 0.8
const WARP_SPEED = 0.2
const PULL = 0.8
const DEPTH = 1600
const SPREAD = 1100

type Palette = {
  clear: number // fallback bg color only — the live --background token is resolved at runtime
  additive: boolean // additive blending for bright stars on dark; normal for dark stars on light
  base: string // GLSL expression for the star's base color
  alphaScale: number // per-theme star-opacity multiplier — light needs a lift to read on near-white
  sizeScale: number // per-theme star-size multiplier
  vignette: string // GLSL statement applied to `col` in the post pass
}

// `clear` is a fallback only — at runtime the canvas reads the live --background
// token so it matches exactly (neutral-50 #fafafa / dark oklch(0.181) = #121212).
const PALETTES: Record<'dark' | 'light', Palette> = {
  dark: {
    clear: 0x121212,
    additive: true,
    base: 'mix(vec3(0.78,0.86,1.0), vec3(1.0), 0.5)',
    alphaScale: 1,
    sizeScale: 1,
    vignette: 'col *= smoothstep(1.15, 0.32, dist);'
  },
  // Dark stars on near-white read far fainter than bright stars on black, so
  // light mode darkens the star color and scales up opacity + size to compensate.
  light: {
    clear: 0xfafafa,
    additive: false,
    base: 'mix(vec3(0.04,0.05,0.12), vec3(0.0,0.0,0.02), 0.5)',
    alphaScale: 1.9,
    sizeScale: 1.3,
    vignette: 'col *= mix(1.0, smoothstep(1.3, 0.35, dist), 0.22);'
  }
}

// Readability scrim: a soft column of the page bg color down the center (where the
// content sits), fading to transparent at the margins — the starfield stays crisp
// in the desktop gutters but calms behind the text. 336px = half the content
// column (max-w-2xl, 42rem); on narrow screens the center stops cross the edges,
// so it degrades to a gentle full-width dim. Uses --background so it auto-adapts
// per theme; bump the 55% for a heavier dim.
const SCRIM_GRADIENT =
  'linear-gradient(to right, transparent,' +
  ' color-mix(in srgb, var(--background) 55%, transparent) calc(50% - 336px),' +
  ' color-mix(in srgb, var(--background) 55%, transparent) calc(50% + 336px),' +
  ' transparent)'

// Resolve a CSS color (the --background token, declared in oklch) to a 0xRRGGBB
// int by painting it on a 1x1 canvas and reading the bytes back — so the WebGL
// clear + warp-fade colors EXACTLY equal what the page paints in each theme,
// instead of a hand-picked hex that can drift from the token. Falls back when the
// browser can't parse the value.
function resolveCssColor(css: string, fallback: number): number {
  if (typeof document === 'undefined' || !css) return fallback
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) return fallback
  ctx.fillStyle = `#${(fallback >>> 0).toString(16).padStart(6, '0')}`
  ctx.fillStyle = css // ignored if unparseable, leaving the fallback in place
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return (r << 16) | (g << 8) | b
}

export const StarfieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    // Wait until next-themes has resolved the theme so we init with the right
    // palette once, instead of flashing light then re-initializing to dark.
    if (!canvas || !resolvedTheme) return

    const pal = PALETTES[resolvedTheme === 'dark' ? 'dark' : 'light']
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let disposed = false
    const cleanups: Array<() => void> = []

    import('three').then((THREE) => {
      if (disposed) return

      let w = window.innerWidth
      let h = window.innerHeight
      let dpr = Math.min(window.devicePixelRatio || 1, 2)

      // alpha:true keeps the canvas transparent in the brief window before the first
      // frame renders, so the page bg shows through instead of WebGL's opaque-black
      // default buffer. The full-screen post pass writes opaque pixels every frame, so
      // the look is unchanged once running. (The rt prime below handles the other half:
      // the first painted frames themselves ramping up from dark.)
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setPixelRatio(dpr)
      renderer.setSize(w, h, false)
      // match the live --background token exactly (pal.clear is just the fallback)
      const bgToken = getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
      const clearColor = resolveCssColor(bgToken, pal.clear)
      renderer.setClearColor(clearColor, 1)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(72, w / h, 1, 4000)
      camera.position.set(0, 0, 60)

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: dpr },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uAspect: { value: w / h },
          uForce: { value: 0 }
        },
        transparent: true,
        depthWrite: false,
        blending: pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
        vertexShader: `
          attribute float aSize; attribute float aPhase;
          uniform float uTime; uniform float uPixelRatio; uniform float uForce;
          uniform vec2 uMouse; uniform float uAspect;
          varying float vA; varying float vGlow; varying float vSwallow;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position,1.0);
            float dist = -mv.z;
            vec4 clip = projectionMatrix * mv;

            // ---- black hole: gravitational pull + accretion swirl + event horizon ----
            vec2 ndc = clip.xy / clip.w;
            vec2 d2 = ndc - uMouse;
            d2.x *= uAspect;            // aspect-correct so the well is circular
            float r = length(d2);
            float radius = 0.5;         // gravity reach
            float horizon = 0.03;       // event horizon radius
            float pull = smoothstep(radius, 0.0, r); // 0 far -> 1 at center
            pull = pull * pull;         // sharper near the center (1/r-ish)
            vGlow = pull;

            float swallowed = 1.0 - smoothstep(0.0, horizon, r); // 1 inside horizon
            vSwallow = swallowed;

            if(pull > 0.001){
              vec2 dir = r > 1e-4 ? d2 / r : vec2(0.0);     // points away from hole
              vec2 swirl = vec2(-dir.y, dir.x);             // tangential (orbit)
              // pull inward (-dir) + orbital swirl; swirl dominates near the rim = accretion disk
              vec2 disp = (-dir * 0.9 + swirl * 1.15) * pull * uForce * 0.32;
              disp.x /= uAspect;
              clip.xy += disp * clip.w;
              // collapse the last stretch straight into the singularity
              clip.xy = mix(clip.xy, uMouse * clip.w, swallowed * uForce);
            }

            float tw = 0.65 + 0.35*sin(uTime*1.6 + aPhase);
            // brighten the infalling rim, then crush size to nothing at the horizon
            gl_PointSize = aSize * uPixelRatio * (420.0/max(dist,1.0)) * tw * (1.0 + pull*1.4) * (1.0 - swallowed) * ${pal.sizeScale.toFixed(2)};
            vA = clamp(1.0 - dist/1700.0, 0.0, 1.0);
            gl_Position = clip;
          }`,
        fragmentShader: `
          varying float vA; varying float vGlow; varying float vSwallow;
          void main(){
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            float a = smoothstep(0.5, 0.0, d);
            vec3 base = ${pal.base};
            // accretion disk: cool blue-white spiralling to hot magenta/orange at the rim
            vec3 hot = mix(vec3(1.0,0.55,0.78), vec3(1.0,0.75,0.35), vGlow*vGlow);
            vec3 col = mix(base, hot, clamp(vGlow*1.1, 0.0, 1.0));
            float alpha = a * vA * (1.0 + vGlow*1.2) * (1.0 - vSwallow) * ${pal.alphaScale.toFixed(2)};
            gl_FragColor = vec4(col, alpha);
          }`
      })

      // ---- stars ----
      const pos = new Float32Array(STAR_COUNT * 3)
      const size = new Float32Array(STAR_COUNT)
      const phase = new Float32Array(STAR_COUNT)
      for (let i = 0; i < STAR_COUNT; i++) {
        pos[i * 3] = (Math.random() * 2 - 1) * SPREAD
        pos[i * 3 + 1] = (Math.random() * 2 - 1) * SPREAD
        pos[i * 3 + 2] = -Math.random() * DEPTH
        size[i] = Math.random() < 0.08 ? 3 + Math.random() * 4 : 0.6 + Math.random() * 1.6
        phase[i] = Math.random() * 6.283
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
      geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
      const points = new THREE.Points(geo, mat)
      points.frustumCulled = false
      scene.add(points)

      // ---- chromatic-aberration post pass (renders the star RT to screen) ----
      const rt = new THREE.WebGLRenderTarget(Math.floor(w * dpr), Math.floor(h * dpr))
      // Prime the accumulation buffer to the bg color. The warp-trail fade never
      // clears rt (autoClear off in the loop), so an unprimed rt starts at the GPU
      // default transparent-black and the first ~10 frames ramp up from dark to the
      // bg — invisible in dark mode, a clear dark flash on a light page each mount.
      renderer.setRenderTarget(rt)
      renderer.clear()
      renderer.setRenderTarget(null)
      const postScene = new THREE.Scene()
      const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const post = new THREE.ShaderMaterial({
        uniforms: { tDiffuse: { value: rt.texture }, uAmount: { value: 0 }, uTime: { value: 0 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }`,
        fragmentShader: `
          uniform sampler2D tDiffuse; uniform float uAmount; uniform float uTime;
          varying vec2 vUv;
          float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898,78.233)))*43758.5453); }
          void main(){
            vec2 uv = vUv;
            vec2 dir = uv - 0.5;
            float dist = length(dir);
            vec2 off = dir * uAmount * (0.6 + dist*2.0);
            float r = texture2D(tDiffuse, uv - off).r;
            float g = texture2D(tDiffuse, uv).g;
            float b = texture2D(tDiffuse, uv + off).b;
            vec3 col = vec3(r,g,b);
            ${pal.vignette}
            float gr = rand(uv + fract(uTime)) * 0.05;
            col += gr - 0.025;
            gl_FragColor = vec4(col, 1.0);
          }`
      })
      postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post))

      // warp trails: a translucent fade quad smears the previous frame each tick
      const fadeMat = new THREE.MeshBasicMaterial({
        color: clearColor,
        transparent: true,
        opacity: 0.3,
        depthTest: false,
        depthWrite: false
      })
      const fadeScene = new THREE.Scene()
      fadeScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fadeMat))

      const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
      let hasMoved = false
      let force = 0
      let abv = 0
      const start = performance.now()

      const frame = () => {
        const t = (performance.now() - start) / 1000
        mouse.x += (mouse.tx - mouse.x) * 0.05
        mouse.y += (mouse.ty - mouse.y) * 0.05

        const speed = WARP_SPEED * 2.4
        const arr = geo.attributes.position.array as Float32Array
        for (let i = 2; i < arr.length; i += 3) {
          arr[i] += speed
          if (arr[i] > 70) arr[i] -= DEPTH
        }
        geo.attributes.position.needsUpdate = true
        points.rotation.z = t * 0.015

        camera.position.x += (mouse.x * 10 - camera.position.x) * 0.04
        camera.position.y += (-mouse.y * 10 - camera.position.y) * 0.04
        camera.lookAt(0, 0, -300)

        mat.uniforms.uTime.value = t
        // black-hole well follows the cursor in NDC; force ramps once the pointer moves
        mat.uniforms.uMouse.value.set(mouse.x, -mouse.y)
        const targetForce = (hasMoved ? 1 : 0) * PULL
        force += (targetForce - force) * 0.05
        mat.uniforms.uForce.value = force

        const md = Math.min(1, Math.hypot(mouse.x, mouse.y))
        const target = (0.014 + md * 0.022) * ABERRATION
        abv += (target - abv) * 0.06
        post.uniforms.uAmount.value = abv
        post.uniforms.uTime.value = t

        // render stars into the RT, smearing the previous frame for warp trails
        renderer.autoClear = false
        renderer.setRenderTarget(rt)
        fadeMat.opacity = 0.34 - Math.min(0.16, WARP_SPEED * 0.06) // faster warp = longer streaks
        renderer.render(fadeScene, postCam)
        renderer.render(scene, camera)
        renderer.setRenderTarget(null)
        renderer.autoClear = true
        renderer.render(postScene, postCam)
      }

      const loop = () => {
        if (disposed) return
        // ponytail: skip work when the tab is hidden — no point animating an unseen background
        if (!document.hidden) frame()
        raf = requestAnimationFrame(loop)
      }

      const onResize = () => {
        w = window.innerWidth
        h = window.innerHeight
        dpr = Math.min(window.devicePixelRatio || 1, 2)
        renderer.setPixelRatio(dpr)
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        rt.setSize(Math.floor(w * dpr), Math.floor(h * dpr))
        mat.uniforms.uPixelRatio.value = dpr
        mat.uniforms.uAspect.value = w / h
      }
      window.addEventListener('resize', onResize)
      cleanups.push(() => window.removeEventListener('resize', onResize))

      if (reduced) {
        // reduced-motion: a single static starfield, no warp loop, no cursor pull
        frame()
      } else {
        const onMove = (e: PointerEvent) => {
          mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
          mouse.ty = (e.clientY / window.innerHeight) * 2 - 1
          hasMoved = true
        }
        window.addEventListener('pointermove', onMove, { passive: true })
        cleanups.push(() => window.removeEventListener('pointermove', onMove))
        raf = requestAnimationFrame(loop)
      }

      cleanups.push(() => {
        cancelAnimationFrame(raf)
        geo.dispose()
        mat.dispose()
        post.dispose()
        fadeMat.dispose()
        rt.dispose()
        renderer.dispose()
      })
    })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      cleanups.forEach((c) => c())
    }
  }, [resolvedTheme])

  // key on the theme so a toggle remounts a pristine canvas — the new renderer
  // never reuses the disposed renderer's WebGL context. The scrim sits above the
  // canvas (-z-10) but below the page content for legibility.
  return (
    <>
      <canvas
        key={resolvedTheme}
        ref={canvasRef}
        aria-hidden='true'
        className='pointer-events-none fixed inset-0 -z-10 h-full w-full'
      />
      <div
        aria-hidden='true'
        className='pointer-events-none fixed inset-0 -z-[5]'
        style={{ background: SCRIM_GRADIENT }}
      />
    </>
  )
}
