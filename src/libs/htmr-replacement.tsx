import parse, { HTMLReactParserOptions, Element, domToReact } from 'html-react-parser'
import React from 'react'

interface HtmrOptions {
  transform?: {
    [key: string]: (props: any) => React.ReactElement
  }
}

/**
 * Replacement for htmr using html-react-parser with transform support
 */
export default function htmr(html: string, options?: HtmrOptions): React.ReactElement {
  if (!options?.transform) {
    return <>{parse(html)}</>
  }

  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name) {
        const transformFn = options.transform?.[domNode.name]
        if (transformFn) {
          const props = {
            ...domNode.attribs,
            children: domToReact(domNode.children as any, parserOptions)
          }
          return transformFn(props)
        }
      }
      return domNode
    }
  }

  return <>{parse(html, parserOptions)}</>
}
