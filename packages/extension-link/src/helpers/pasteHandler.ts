import { Editor } from '@tiptap/core'
import { MarkType } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { find } from 'linkifyjs'

type PasteHandlerOptions = {
  editor: Editor
  type: MarkType
}

export function pasteHandler(options: PasteHandlerOptions): Plugin {
  return new Plugin({
    key: new PluginKey('handlePasteLink'),
    props: {
      handlePaste: (view, event, slice) => {
        const { state } = view
        const { selection } = state
        const { empty } = selection

        if (empty) {
          return false
        }

        let textContent = ''

        slice.content.forEach(node => {
          textContent += node.textContent
        })

        const link = find(textContent).find(item => item.isLink && item.value === textContent)

        if (!textContent || !link) {
          return false
        }

        const html = event.clipboardData?.getData('text/html')

        const hrefRegex = /href="([^"]*)"/

        const existingLink = html?.match(hrefRegex)

        const url = existingLink ? existingLink[1] : link.href

        options.editor.commands.setMark(options.type, {
          href: url,
        })

        return true
      },
    },
  })
}
