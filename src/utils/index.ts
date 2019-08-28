import * as vscode from 'vscode'
import Log from '../core/Log'

export * from './KeyDetector'

export const KEY_REG = /(?:^t|\st|{t|i18n\.t)\(['"]([^]+?)['"]/g

export const isReactProject = (): boolean => {
  const mainProject = vscode.workspace.workspaceFolders[0]

  if (!mainProject) {
    return false
  }

  try {
    const pkgJSON = require(`${mainProject.uri.fsPath}/package.json`)
    const { dependencies, devDependencies } = pkgJSON

    return Object.keys({ ...dependencies, ...devDependencies }).some(
      pkgName => {
        return /i18next/.test(pkgName)
      }
    )
  } catch (err) {
    Log.error(err)
  }
}
