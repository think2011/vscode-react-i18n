"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Config_1 = require("../Config");
class Extract {
    provideCodeActions() {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !Config_1.default.hasI18nPaths) {
            return;
        }
        const { selection } = editor;
        const text = editor.document.getText(selection);
        if (!text || selection.start.line !== selection.end.line) {
            return;
        }
        return this.getCommands({
            filepath: editor.document.fileName,
            range: selection,
            text
        });
    }
}
exports.Extract = Extract;
//# sourceMappingURL=Extract.js.map