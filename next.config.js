/* eslint-disable @typescript-eslint/no-var-requires */
const { withAxiom } = require("next-axiom");

const runtimeCaching = require("next-pwa/cache");
const isDev = process.env.NODE_ENV === "development";

// https://nextjs.org/docs/advanced-features/security-headers
const ContentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' *.youtube.com *.twitter.com *.vercel-scripts.com giscus.app *.giscus.app *.googletagmanager.com cdn.jsdelivr.net;
    child-src *.youtube.com *.google.com *.twitter.com giscus.app *.giscus.app;
    style-src 'self' 'unsafe-inline' *.googleapis.com *.unpkg.com *.giscus.app;
    img-src * blob: data:;
    frame-src *.youtube.com *.google.com *.twitter.com giscus.app *.giscus.app;
    media-src 'none';
    connect-src *;
    font-src 'self';
`;

const securityHeaders = [
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
	{
		key: "Content-Security-Policy",
		value: ContentSecurityPolicy.replace(/\n/g, ""),
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
	{
		key: "Referrer-Policy",
		value: "origin-when-cross-origin",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
	{
		key: "X-Frame-Options",
		value: "DENY",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
	{
		key: "X-DNS-Prefetch-Control",
		value: "on",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
	{
		key: "Strict-Transport-Security",
		value: "max-age=31536000; includeSubDomains; preload",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},
];

const withPWA = require("next-pwa")({
	dest: "public",
	skipWaiting: true, // installs new SW when available without a prompt, we only need to send a reload request to user.
	register: true,
	disable: isDev,
	runtimeCaching,
	buildExcludes: [
		/chunks\/images\/.*$/, // Don't precache files under .next/static/chunks/images this improves next-optimized-images behaviour
		/chunks\/pages\/api\/.*/, // Dont cache the API it needs fresh serverinfo
	],
	// exclude: [
	//   /middleware-manifest\.json$/, // exclude middleware to fix error @see https://github.com/shadowwalker/next-pwa/issues/288#issuecomment-955777098,
	//   /build-manifest\.json$/,
	//   /\.map$/, // dont cache map files
	//   /^.*ts.*$/ // Dont let serviceworker touch the TS streams
	// ],
});

const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.BASE_PATH || "";

/** @type {import('next').NextConfig} */
const config = {
	...(isStaticExport && {
		output: "export",
		trailingSlash: true,
		...(basePath && {
			basePath: basePath,
			assetPrefix: basePath,
		}),
		images: {
			unoptimized: true,
		},
	}),
	images: {
		...(isStaticExport && { unoptimized: true }),
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
			},
			{
				protocol: "https",
				hostname: "ik.imagekit.io",
			},
			{
				protocol: "https",
				hostname: "og-image.vercel.app",
			},
			{
				protocol: "https",
				hostname: "media3.giphy.com",
			},
			{
				protocol: "https",
				hostname: "media0.giphy.com",
			},
			{
				protocol: "https",
				hostname: "github.com",
			},
			{
				protocol: "https",
				hostname: "raw.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "img.shields.io",
			},
			{
				protocol: "https",
				hostname: "mermaid.live",
			},
		],
		qualities: [25, 50, 60, 75, 100],
		formats: ["image/webp", "image/avif"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 31536000, // 1 year
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	compiler: {
		removeConsole: !isDev,
		styledComponents: true,
	},
	compress: true,
	poweredByHeader: false,
	generateEtags: true,

	// Transpile mermaid and its dependencies to fix bundling issues
	transpilePackages: ['mermaid', 'stylis'],

	turbopack: {},
	experimental: {
		optimizePackageImports: [
			"@vercel/analytics",
			"@vercel/speed-insights",
			"framer-motion",
			"react-icons",
			"next-themes",
			'mermaid',
			'stylis',
			'shiki'
		],
		webVitalsAttribution: ["CLS", "LCP"],
		scrollRestoration: true,
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: securityHeaders,
			},
			{
				source: "/(.*).(jpg|jpeg|png|gif|ico|svg|webp|avif)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/(.*).(js|css)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		];
	},
	async redirects() {
		return [
			// Canonical domain redirect
			{
				source: "/:path*",
				has: [
					{
						type: "host",
						value: "ahnafnafee.dev",
					},
				],
				destination: "https://www.ahnafnafee.dev/:path*",
				permanent: true,
			},
			{
				source: "/resume.pdf",
				destination: "/AhnafAnNafeeResume.pdf",
				permanent: true,
			},

			{
				source: "/projects",
				destination: "/portfolio",
				permanent: true,
			},

			{
				source: "/tags",
				destination: "/",
				permanent: true,
			},
			{
				source: "/cv",
				destination: "/AhnafAnNafeeResume.pdf",
				permanent: true,
			},
			{
				source: "/github",
				destination: "https://github.com/ahnafnafee",
				permanent: true,
			},
			{
				source: "/linkedin",
				destination: "https://www.linkedin.com/in/ahnafnafee",
				permanent: true,
			},
		];
	},
};

module.exports = withAxiom(withPWA(config));

// module.exports = config
