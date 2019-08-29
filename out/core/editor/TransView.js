"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const meta_1 = require("../meta");
const Config_1 = require("../Config");
const I18nFile_1 = require("../i18nFile/I18nFile");
const EVENT_TYPE = {
    READY: 0,
    ALL_TRANS: 1,
    TRANS: 2,
    WRITE_FILE: 3
};
class TransView {
    constructor() {
        this.disposables = [];
        this.init();
    }
    init() {
        const cmd = vscode.commands.registerCommand(meta_1.default.COMMANDS.transView, ({ filepath = vscode.window.activeTextEditor.document.fileName } = {}) => {
            this.filepath = filepath;
            this.createPanel();
        });
        this.disposables.push(cmd);
    }
    get shortFileName() {
        return this.filepath
            .split(path.sep)
            .slice(-3)
            .join(path.sep);
    }
    createPanel() {
        if (this.panel) {
            return;
        }
        this.panel = vscode.window.createWebviewPanel('transView', '翻译中心', vscode.ViewColumn.Beside, { enableScripts: true });
        const { webview } = this.panel;
        webview.html = fs.readFileSync(path.resolve(Config_1.default.extension.extensionPath, 'static/transView.html'), 'utf-8');
        webview.onDidReceiveMessage(this.onMessage.bind(this));
        // 切换回 webview
        const viewChangeWatcher = this.panel.onDidChangeViewState(webview => {
            if (webview.webviewPanel.active) {
                this.postAllTrans();
            }
        });
        // 更换文件
        const fileWatcher = vscode.window.onDidChangeActiveTextEditor(() => {
            const activeDocument = vscode.window.activeTextEditor.document;
            const isSameOrNotFile = activeDocument.uri.scheme !== 'file' ||
                activeDocument.fileName === this.filepath;
            if (isSameOrNotFile) {
                return;
            }
            this.filepath = activeDocument.fileName;
            this.postAllTrans();
        });
        this.panel.onDidDispose(() => {
            viewChangeWatcher.dispose();
            fileWatcher.dispose();
            this.panel = null;
        });
    }
    postAllTrans() {
        const i18n = I18nFile_1.i18nFile.getFileByFilepath(this.filepath);
        const keys = this.getKeysByFilepath(this.filepath);
        const allTrans = keys.reduce((acc, key) => {
            acc[key] = i18n.getI18n(key);
            return acc;
        }, {});
        this.panel.webview.postMessage({
            type: EVENT_TYPE.ALL_TRANS,
            data: {
                shortFileName: this.shortFileName,
                sourceLocale: Config_1.default.sourceLocale,
                allTrans
            }
        });
    }
    onMessage({ type, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { webview } = this.panel;
            const i18n = I18nFile_1.i18nFile.getFileByFilepath(this.filepath);
            switch (type) {
                case EVENT_TYPE.READY:
                    this.postAllTrans();
                    break;
                case EVENT_TYPE.TRANS:
                    const { key, trans } = data;
                    const transData = yield i18n.transI18n(trans);
                    webview.postMessage({
                        type: EVENT_TYPE.TRANS,
                        data: {
                            key,
                            trans: transData
                        }
                    });
                    i18n.writeI18n(transData);
                    break;
                case EVENT_TYPE.WRITE_FILE:
                    i18n.writeI18n(data);
                    break;
                default:
                //
            }
        });
    }
}
exports.TransView = TransView;
//# sourceMappingURL=TransView.js.map