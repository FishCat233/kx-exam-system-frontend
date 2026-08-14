interface HastTextNode {
  type: 'text'
  value: string
}

interface HastElementNode {
  type: 'element'
  tagName: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

interface HastOtherNode {
  type: string
  children?: HastNode[]
}

type HastNode = HastTextNode | HastElementNode | HastOtherNode

function createBlankMarker(number: number): HastElementNode {
  return {
    type: 'element',
    tagName: 'span',
    properties: { className: ['blank-marker', 'data-mono'] },
    children: [{ type: 'text', value: `__${number}__` }],
  }
}

/**
 * 把题干中的 `____` 按出现顺序替换为编号标记（__1__、__2__...）。
 *
 * 按 unified 插件工厂约定：传给 react-markdown 时用 `rehypeBlankNumbering`（不调用），
 * unified 在 freeze 时调用工厂拿到 transformer，编号计数器随工厂调用重置。
 * 代码块（pre 后代）内保持纯文本编号，因为 SyntaxHighlighter 只能接收字符串；
 * 其余文本节点原地改造成容器 span，内含高亮的编号标记。
 * 编号顺序与 BlankQuestion 的 countBlanks 一致（都是按 `____` 出现顺序）。
 */
export function rehypeBlankNumbering() {
  let counter = 0

  return (tree: HastNode) => {
    walk(tree, false)
  }

  function walk(node: HastNode, inBlockCode: boolean): void {
    if ('value' in node) {
      const text = node as HastTextNode
      if (text.value.includes('____')) {
        applyNumbering(text, inBlockCode)
      }
      return
    }
    if ('tagName' in node) {
      const element = node as HastElementNode
      const isBlockCode = inBlockCode || element.tagName === 'pre'
      element.children?.forEach((child) => walk(child, isBlockCode))
      return
    }
    const other = node as HastOtherNode
    other.children?.forEach((child) => walk(child, inBlockCode))
  }

  function applyNumbering(node: HastTextNode, inBlockCode: boolean): void {
    const parts = node.value.split('____')

    if (inBlockCode) {
      node.value = parts
        .map((part, index) => (index === parts.length - 1 ? part : `${part}__${++counter}__`))
        .join('')
      return
    }

    const children: HastNode[] = []
    parts.forEach((part, index) => {
      if (part) {
        children.push({ type: 'text', value: part })
      }
      if (index < parts.length - 1) {
        children.push(createBlankMarker(++counter))
      }
    })

    const element = node as unknown as HastElementNode
    element.type = 'element'
    element.tagName = 'span'
    element.properties = { className: ['blank-marker-wrap'] }
    element.children = children
  }
}
