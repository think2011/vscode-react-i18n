import { Extract } from '../core/editor'
import * as vscode from 'vscode'

class ExtractProvider extends Extract {
  getCommands(params) {
    return [
      {
        command: 'react-i18n.extract',
        title: `提取为$t('key')`,
        arguments: [
          {
            ...params,
            template: `{{ $t('{key}') }}`
          }
        ]
      },
      {
        command: 'react-i18n.extract',
        title: `提取为i18n.t('key')`,
        arguments: [
          {
            ...params,
            template: `i18n.t('{key}')`
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
      { language: 'javascript', scheme: '*' },
      { language: 'typescript', scheme: '*' }
    ],
    new ExtractProvider(),
    {
      providedCodeActionKinds: [vscode.CodeActionKind.Refactor]
    }
  )
}
