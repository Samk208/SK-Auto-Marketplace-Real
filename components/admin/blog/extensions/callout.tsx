import { Node, mergeAttributes } from '@tiptap/core'
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { AlertTriangle, CheckCircle, Info, Lightbulb } from 'lucide-react'

export type CalloutType = 'info' | 'warning' | 'success' | 'tip'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (options?: { type: CalloutType }) => ReturnType
      toggleCallout: (options?: { type: CalloutType }) => ReturnType
    }
  }
}

const styles = {
  info: {
    border: 'border-blue-500',
    bg: 'bg-blue-50',
    icon: <Info className="w-5 h-5 text-blue-500" />,
    class: 'my-6 flex gap-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl',
  },
  warning: {
    border: 'border-orange-500',
    bg: 'bg-orange-50',
    icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
    class: 'my-6 flex gap-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-xl',
  },
  success: {
    border: 'border-green-500',
    bg: 'bg-green-50',
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    class: 'my-6 flex gap-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl',
  },
  tip: {
    border: 'border-purple-500',
    bg: 'bg-purple-50',
    icon: <Lightbulb className="w-5 h-5 text-purple-500" />,
    class: 'my-6 flex gap-4 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-xl',
  },
}

const CalloutComponent = ({ node, updateAttributes }: any) => {
  const type = (node.attrs.type as CalloutType) || 'info'
  const currentStyle = styles[type] || styles.info

  return (
    <NodeViewWrapper className={currentStyle.class}>
      <div className="flex-shrink-0 mt-1 select-none" contentEditable={false}>
        {currentStyle.icon}
      </div>
      <div className="flex-1">
        <NodeViewContent className="prose prose-sm max-w-none" />
      </div>
    </NodeViewWrapper>
  )
}

export const Callout = Node.create({
  name: 'callout',

  group: 'block',

  content: 'block+',

  draggable: true,

  addAttributes() {
    return {
      type: {
        default: 'info',
        renderHTML: (attributes) => {
          return {
            'data-type': attributes.type,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type]',
        getAttrs: (element) => {
          const type = element.getAttribute('data-type')
          if (['info', 'warning', 'success', 'tip'].includes(type as string)) {
            return { type }
          }
          return false
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const type = (HTMLAttributes['data-type'] as CalloutType) || 'info'
    const currentStyle = styles[type] || styles.info
    
    // We render a structure that matches the React component but with static HTML
    // Note: We can't render the Lucide icon easily here without SVG string
    // So we'll render a div with the class and let the content be the second child
    return [
      'div', 
      mergeAttributes(HTMLAttributes, { class: currentStyle.class }), 
      // Icon placeholder - in a real app you might want to inline the SVG or use a CSS pseudo-element
      ['div', { class: 'flex-shrink-0 mt-1 select-none font-bold' }, type.toUpperCase()], 
      ['div', { class: 'flex-1' }, 0]
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutComponent)
  },

  addCommands() {
    return {
      setCallout:
        (attributes) =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes)
        },
      toggleCallout:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', attributes)
        },
    }
  },
})

