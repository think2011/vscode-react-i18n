import './GLOBAL_META'

import * as vscode from 'vscode'

import Log from './core/Log'
import Config from './core/Config'
import * as coreCommandsModules from './core/commands'

import { isReactProject } from './Utils'
import * as editorModules from './editor'

type ModuleType = (
  ctx: vscode.ExtensionContext
) => vscode.Disposable | vscode.Disposable[]

process.on('uncaughtException', function(err) {
  Log.error(err, false)
})

export async function activate(ctx: vscode.ExtensionContext) {
  Log.info(`🌞 Activated, v${Config.version}`)

  if (!(await isReactProject())) {
    Log.info('🌑 Inactive')
    return
  }

  const modules = Object.values({ ...coreCommandsModules, ...editorModules })
  modules.forEach((module: ModuleType) => {
    const disposables = module(ctx)

    if (Array.isArray(disposables)) {
      ctx.subscriptions.push(...disposables)
    } else {
      ctx.subscriptions.push(disposables)
    }
  })
}

export function deactivate() {
  Log.info('🌚 Deactivated')
}
