"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const editor_1 = require("../core/editor");
const vscode = require("vscode");
const index_1 = require("../Utils/index");
class ExtractProvider extends editor_1.Extract {
    keyTransform(key) {
        const nsKeyByKey = index_1.KeyDetector.getKeyPrefixByKey(key);
        const [, ...restKey] = key.split(/[.:]/);
        if (nsKeyByKey) {
            return `${nsKeyByKey}.${restKey.join('.')}`;
        }
        const nsKey = this.getNSkey();
        return nsKey ? `${nsKey}.${restKey.join('.')}` : key;
    }
    defaultKeyTransform(defaultKey) {
        const [, ...resetKey] = defaultKey.split('.');
        if (!resetKey.length) {
            return defaultKey;
        }
        const nsKey = this.getNSkey();
        return nsKey ? `${nsKey}:${resetKey.join('.')}` : `${nsKey}:${defaultKey}`;
    }
    getNSkey() {
        const { document } = vscode.window.activeTextEditor;
        const text = document.getText();
        return index_1.KeyDetector.getKeyPrefixByText(text);
    }
    keyReplace(template) {
        return key => {
            const nsKey = this.getNSkey();
            const [mainKey, ...restKey] = key.split('.');
            let displayKey = null;
            if (nsKey === mainKey) {
                displayKey = restKey.join('.');
            }
            displayKey =
                nsKey === mainKey
                    ? restKey.join('.')
                    : `${mainKey}:${restKey.join('.')}`;
            return template.replace(/{key}/g, displayKey);
        };
    }
    getCommands(params) {
        const promptText = `请输入要保存的路径，例如:common:document.title`;
        return [
            {
                command: 'react-i18n.extract',
                title: `提取为{t('key')}`,
                arguments: [
                    Object.assign({}, params, { promptText, keyTransform: this.keyTransform.bind(this), defaultKeyTransform: this.defaultKeyTransform.bind(this), keyReplace: this.keyReplace(`{t('{key}')}`).bind(this) })
                ]
            },
            {
                command: 'react-i18n.extract',
                title: `提取为t('key')`,
                arguments: [
                    Object.assign({}, params, { promptText, keyTransform: this.keyTransform.bind(this), defaultKeyTransform: this.defaultKeyTransform.bind(this), keyReplace: this.keyReplace(`t('{key}')`).bind(this) })
                ]
            }
        ];
    }
}
exports.extractEditor = () => {
    return vscode.languages.registerCodeActionsProvider([
        { language: 'react', scheme: '*' },
        { language: 'javascriptreact', scheme: '*' },
        { language: 'typescriptreact', scheme: '*' },
        { language: 'javascript', scheme: '*' },
        { language: 'typescript', scheme: '*' }
    ], new ExtractProvider(), {
        providedCodeActionKinds: [vscode.CodeActionKind.Refactor]
    });
};
//# sourceMappingURL=extract.js.map