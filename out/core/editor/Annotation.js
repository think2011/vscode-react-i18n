"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const lodash_1 = require("lodash");
const index_1 = require("../i18nFile/index");
const Config_1 = require("../Config");
const textEditorDecorationType = vscode.window.createTextEditorDecorationType({});
const unuseDecorationType = vscode.window.createTextEditorDecorationType({
    opacity: '0.6'
});
class Annotation {
    constructor() {
        this.disposables = [];
        const { disposables } = this;
        const debounceUpdate = lodash_1.debounce(() => this.update(), 500);
        Config_1.default.i18nPaths.forEach(i18nPath => {
            const i18nDirWatcher = vscode.workspace.createFileSystemWatcher(`${i18nPath}/**`);
            i18nDirWatcher.onDidChange(debounceUpdate);
            i18nDirWatcher.onDidCreate(debounceUpdate);
            i18nDirWatcher.onDidDelete(debounceUpdate);
            disposables.push(i18nDirWatcher);
        });
        disposables.push(vscode.window.onDidChangeActiveTextEditor(debounceUpdate), vscode.workspace.onDidChangeTextDocument(debounceUpdate));
    }
    update() {
        const activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor) {
            return;
        }
        const { document } = activeTextEditor;
        const text = document.getText();
        const decorations = [];
        const unuseDecorations = [];
        activeTextEditor.setDecorations(unuseDecorationType, []);
        if (!text) {
            activeTextEditor.setDecorations(textEditorDecorationType, []);
        }
        // 从文本里遍历生成中文注释
        // TODO: 这里的实现职责耦合了
        let match = null;
        while ((match = this.KEY_REG.exec(text))) {
            const index = match.index;
            const matchKey = match[0];
            const key = this.transformKey(text, matchKey.replace(new RegExp(this.KEY_REG), '$1'));
            const i18n = index_1.i18nFile.getFileByFilepath(document.fileName);
            const trans = i18n.getI18n(key);
            const { text: mainText = '' } = trans.find(transItem => transItem.lng === Config_1.default.sourceLocale) || {};
            const range = new vscode.Range(document.positionAt(index), document.positionAt(index + matchKey.length + 1));
            const decoration = {
                range,
                renderOptions: {
                    after: {
                        color: 'rgba(153, 153, 153, .7)',
                        contentText: mainText ? `›${mainText}` : '',
                        fontWeight: 'normal',
                        fontStyle: 'normal'
                    }
                }
            };
            // 没有翻译的文案透明化处理
            if (!mainText) {
                unuseDecorations.push({ range });
            }
            decorations.push(decoration);
        }
        activeTextEditor.setDecorations(unuseDecorationType, unuseDecorations);
        activeTextEditor.setDecorations(textEditorDecorationType, decorations);
    }
    transformKey(_text, key) {
        return key;
    }
}
exports.Annotation = Annotation;
//# sourceMappingURL=Annotation.js.map