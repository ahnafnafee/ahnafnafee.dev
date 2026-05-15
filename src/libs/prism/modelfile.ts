/**
 * Prism / refractor grammar for Ollama Modelfile.
 *
 * Registered onto the same refractor singleton that rehype-prism-plus uses
 * (see ../mdxConfig.ts) so ```modelfile fenced code blocks render with full
 * token colors via the shared prism-themes.css palette.
 *
 * Spec reference: https://github.com/ollama/ollama/blob/main/docs/modelfile.md
 *
 * Architectural note (mirroring refractor's `docker.js`): the top-level
 * `instruction` rule swallows the whole INSTRUCTION-line and runs nested
 * `inside` rules over the residue. That preserves the lookbehind context
 * (PARAMETER, MESSAGE) for value-level rules, which would otherwise see an
 * already-tokenized residue and miss their anchors.
 */

// Mirror the shape that refractor v5 language modules expect: a default-exported
// function plus `displayName` and `aliases` attached on the same function.
type RefractorLanguage = ((Prism: { languages: Record<string, unknown> }) => void) & {
  displayName: string
  aliases: string[]
}

const INSTRUCTION_NAMES = 'FROM|PARAMETER|TEMPLATE|SYSTEM|ADAPTER|LICENSE|MESSAGE|REQUIRES|RENDERER|PARSER|DRAFT'

const modelfile = function modelfile(Prism: { languages: Record<string, unknown> }): void {
  // Sub-tokens shared by both block- and single-line instructions.
  const valueInside = {
    'parameter-name': {
      pattern: /(^PARAMETER[ \t]+)[A-Za-z_]\w*/,
      lookbehind: true,
      alias: 'property'
    },
    'message-role': {
      pattern: /(^MESSAGE[ \t]+)(?:system|user|assistant)\b/,
      lookbehind: true,
      alias: 'function'
    },
    string: {
      pattern: /"(?:\\.|[^"\\\n])*"/,
      greedy: true
    },
    boolean: {
      pattern: /(^|\s)(?:true|false)(?=\s|$)/,
      lookbehind: true
    },
    number: {
      // Only stand-alone numeric values — preceded by whitespace, followed
      // by whitespace / EOL. Skips digits embedded in paths like Qwen2.5-7B.
      pattern: /(\s)-?\d+(?:\.\d+)?(?=\s|$)/,
      lookbehind: true
    },
    keyword: new RegExp(`^(?:${INSTRUCTION_NAMES})\\b`)
  }

  Prism.languages.modelfile = {
    comment: {
      pattern: /(^|[^"\\])#.*/,
      lookbehind: true,
      greedy: true
    },
    'block-instruction': {
      // SYSTEM / TEMPLATE bodies wrapped in triple quotes — multi-line.
      pattern: new RegExp(`(^[ \\t]*)(?:SYSTEM|TEMPLATE)[ \\t]+"""[\\s\\S]*?"""`, 'm'),
      lookbehind: true,
      greedy: true,
      alias: 'instruction',
      inside: {
        keyword: /^(?:SYSTEM|TEMPLATE)/,
        'triple-string': {
          pattern: /"""[\s\S]*?"""/,
          alias: 'string',
          greedy: true,
          inside: {
            'template-variable': {
              // Go-template directives inside SYSTEM / TEMPLATE bodies.
              pattern: /\{\{[\s\S]*?\}\}/,
              alias: 'variable',
              inside: {
                keyword: /\b(?:if|else|end|range|with|define|template|block)\b/,
                property: /\.[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*/,
                string: /"(?:\\.|[^"\\])*"/,
                punctuation: /[{}|]/
              }
            }
          }
        }
      }
    },
    instruction: {
      // Single-line instructions consume until end of line so `inside` rules
      // can still anchor on the instruction keyword via lookbehind.
      pattern: new RegExp(`(^[ \\t]*)(?:${INSTRUCTION_NAMES})\\b[^\\n]*`, 'm'),
      lookbehind: true,
      greedy: true,
      inside: valueInside
    }
  }
} as RefractorLanguage

modelfile.displayName = 'modelfile'
modelfile.aliases = []

export default modelfile
