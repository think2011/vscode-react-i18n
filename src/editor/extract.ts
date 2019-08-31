import { Extract } from '../core/editor'
import * as vscode from 'vscode'
import { KeyDetector } from '../Utils/index'

class ExtractProvider extends Extract {
  get activeText() {
    const { document } = vscode.window.activeTextEditor
    return document.getText()
  }

  keyTransform(key): string {
    return KeyDetector.normalizeKey(key, this.activeText)
  }

  defaultKeyTransform(defaultKey): string {
    const [, ...resetKey] = defaultKey.split('.')

    if (!resetKey.length) {
      return defaultKey
    }

    const nsKey = this.getNSkey()
    return nsKey ? `${nsKey}.${resetKey.join('.')}` : defaultKey
  }

  getNSkey() {
    return KeyDetector.getNsByText(this.activeText)
  }

  keyReplace(template) {
    return key => {
      const nsKey = this.getNSkey()
      const [mainKey, ...restKey] = key.split('.')
      let shownKey = null

      if (!restKey.length) {
        return template.replace(/{key}/g, key)
      }

      if (nsKey === mainKey) {
        shownKey = restKey.join('.')
      }
      shownKey =
        nsKey === mainKey ? shownKey : `${mainKey}:${restKey.join('.')}`

      return template.replace(/{key}/g, shownKey)
    }
  }

  getCommands(params) {
    const promptText = `请输入要保存的路径，例如:common:document.title`

    return [
      {
        command: 'react-i18n.extract',
        title: `提取为{t('key')}`,
        arguments: [
          {
            ...params,
            promptText,
            keyTransform: this.keyTransform.bind(this),
            defaultKeyTransform: this.defaultKeyTransform.bind(this),
            keyReplace: this.keyReplace(`{t('{key}')}`).bind(this)
          }
        ]
      },
      {
        command: 'react-i18n.extract',
        title: `提取为t('key')`,
        arguments: [
          {
            ...params,
            promptText,
            keyTransform: this.keyTransform.bind(this),
            defaultKeyTransform: this.defaultKeyTransform.bind(this),
            keyReplace: this.keyReplace(`t('{key}')`).bind(this)
          }
        ]
      }
    ]
  }
}

export const extractEditor = () => {
  return vscode.languages.registerCodeActionsProvider(
    [
      { language: 'react', scheme: '*' },
      { language: 'javascriptreact', scheme: '*' },
      { language: 'typescriptreact', scheme: '*' },
      { language: 'javascript', scheme: '*' },
      { language: 'typescript', scheme: '*' }
    ],
    new ExtractProvider(),
    {
      providedCodeActionKinds: [vscode.CodeActionKind.Refactor]
    }
  )
}
