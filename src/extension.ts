import {
  DecorationOptions,
  DecorationRangeBehavior,
  ExtensionContext,
  Position,
  Range,
  TextEditor,
  TextEditorDecorationType,
  ThemeColor,
  window,
  workspace,
} from 'vscode'

export function pad(
  s: string,
  before: number = 0,
  after: number = 0,
  padding: string = '\u00a0'
) {
  if (before === 0 && after === 0) {
    return s
  }

  return `${before === 0 ? '' : padding.repeat(before)}${s}${
    after === 0 ? '' : padding.repeat(after)
  }`
}

const maxSmallIntegerV8 = 2 ** 30
const annotationDecoration: TextEditorDecorationType =
  window.createTextEditorDecorationType({
    after: {
      margin: '0 0 0 3em',
      textDecoration: 'none',
    },
    rangeBehavior: DecorationRangeBehavior.ClosedOpen,
  })

export function activate(context: ExtensionContext) {
  workspace.onWillSaveTextDocument(event => {
    const openEditors = window.visibleTextEditors.filter(
      editor => editor.document.uri === event.document.uri
    )

    openEditors.forEach(e => {
      decorate(e)
    })
  })
}

function decorate(editor: TextEditor) {
  let sourceCode = editor.document.getText()
  let regex = '(?<={{).*?(?=}})'

  let decorationsArray: DecorationOptions[] = []
  const sourceCodeArr = sourceCode.split('\n')

  sourceCodeArr.forEach((line, i) => {
    const match = line.match(regex)

    if (match !== null && match.index !== undefined) {
      let decoration: DecorationOptions = {
        renderOptions: {
          after: {
            backgroundColor: 'red',
            color: 'white',
            contentText: pad('testing here', 1, 1),
            fontWeight: 'normal',
            fontStyle: 'normal',
            textDecoration: `none;${''}`,
          },
        },
        range: editor.document.validateRange(
          new Range(i, maxSmallIntegerV8, i, maxSmallIntegerV8)
        ),
      }

      decorationsArray.push(decoration)
    }
  })

  editor.setDecorations(annotationDecoration, decorationsArray)
}

function findTemplateFiles() {
  workspace.findFiles
}

// this method is called when your extension is deactivated
export function deactivate() {}
