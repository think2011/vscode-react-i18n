import * as vscode from 'vscode'
import * as fs from 'fs'
import { KEY_REG } from './'

export class KeyDetector {
  static getKeyByContent(text: string) {
    const keys = (text.match(KEY_REG) || []).map(key =>
      this.normalizeKey(key.replace(KEY_REG, '$1'), text)
    )

    return [...new Set(keys)]
  }

  static getKeyByFilepath(filepath: string) {
    const file: string = fs.readFileSync(filepath, 'utf-8')
    return this.getKeyByContent(file)
  }

  static getKey(document: vscode.TextDocument, position: vscode.Position) {
    const keyRange = document.getWordRangeAtPosition(position, KEY_REG)
    const key = keyRange
      ? document.getText(keyRange).replace(KEY_REG, '$1')
      : undefined

    if (!key) {
      return
    }

    return this.normalizeKey(key, document.getText())
  }

  static getNsByText(text: string): string {
    const NS_REG = /(?:useTranslation|withTranslation)\(\[?['"](.*?)['"]/g
    const nsKey = (text.match(NS_REG) || [])[0] || ''

    return nsKey.replace(NS_REG, '$1')
  }

  static getNsByKey(key: string): string {
    const [prefix, resetKey] = key.split(':')
    return resetKey ? prefix : undefined
  }

  static normalizeKey(key: string, text?: string) {
    if (this.getNsByKey(key)) {
      return key.replace(':', '.')
    }

    const nsKey = this.getNsByText(text)
    if (!nsKey) {
      return key
    }

    return `${nsKey}.${key}`
  }
}
