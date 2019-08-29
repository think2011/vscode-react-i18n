"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const i18nFile_1 = require("../i18nFile");
const meta_1 = require("../meta");
const Config_1 = require("../Config");
class Hover {
    createCommandUrl({ name, command, params, disabled = false }) {
        return disabled
            ? name
            : `[${name}](command:${command}?${encodeURIComponent(JSON.stringify(params))})`;
    }
    provideHover(document, position) {
        const key = this.getKey(document, position);
        if (!key) {
            return;
        }
        const i18n = i18nFile_1.i18nFile.getFileByFilepath(document.fileName);
        const transData = i18n.getI18n(key);
        const transText = transData
            .map(transItem => {
            const commands = [
                this.createCommandUrl({
                    name: '✎',
                    command: meta_1.default.COMMANDS.editI18n,
                    params: {
                        filepath: transItem.filepath,
                        key: transItem.key,
                        lng: transItem.lng
                    }
                }),
                this.createCommandUrl({
                    name: '×',
                    command: meta_1.default.COMMANDS.delI18n,
                    disabled: !transItem.text,
                    params: {
                        filepath: transItem.filepath,
                        key: transItem.key,
                        lng: transItem.lng
                    }
                })
            ].join(' ');
            return `| **${transItem.lng}** | ${transItem.text ||
                '-'} | ${commands} |`;
        })
            .join('\n');
        const transCommand = this.createCommandUrl({
            name: '译',
            command: meta_1.default.COMMANDS.transView,
            params: {
                key,
                filepath: document.fileName
            }
        });
        const delCommand = this.createCommandUrl({
            name: '删',
            command: meta_1.default.COMMANDS.removeI18n,
            params: {
                key,
                filepath: document.fileName
            }
        });
        const markdownText = new vscode.MarkdownString(`
||||
|---:|---|---:|
|${Config_1.default.extensionName.toUpperCase()}||${transCommand} ${delCommand}|
${transText}
||||`);
        markdownText.isTrusted = true;
        return new vscode.Hover(markdownText);
    }
}
exports.Hover = Hover;
//# sourceMappingURL=Hover.js.map