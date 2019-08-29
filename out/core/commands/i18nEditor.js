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
const meta_1 = require("../meta");
const I18nFile_1 = require("../i18nFile/I18nFile");
const Config_1 = require("../Config");
const getTransByLng = (filepath, key, lng) => {
    const i18n = I18nFile_1.i18nFile.getFileByFilepath(filepath);
    const transData = i18n.getI18n(key);
    return {
        i18n,
        transData,
        lngTransData: transData.find(transItem => transItem.lng === lng)
    };
};
exports.editI18nCommand = () => {
    return vscode.commands.registerCommand(meta_1.default.COMMANDS.editI18n, ({ filepath, key, lng }) => __awaiter(this, void 0, void 0, function* () {
        const { i18n, transData, lngTransData } = getTransByLng(filepath, key, lng);
        const text = yield vscode.window.showInputBox({
            prompt: `${key}`,
            value: lngTransData.text
        });
        if (text === undefined) {
            return;
        }
        lngTransData.text = text;
        i18n.writeI18n(transData);
    }));
};
exports.delI18nCommand = () => {
    return vscode.commands.registerCommand(meta_1.default.COMMANDS.delI18n, ({ filepath, key, lng }) => __awaiter(this, void 0, void 0, function* () {
        const { i18n, transData, lngTransData } = getTransByLng(filepath, key, lng);
        const text = lngTransData.text;
        // 删除
        lngTransData.text = '';
        yield i18n.writeI18n(transData);
        const recoverText = '恢复';
        const result = yield vscode.window.showInformationMessage(`${Config_1.default.extensionName}: 🚮 ${text}`, recoverText);
        if (result === recoverText) {
            // 恢复
            const { i18n, transData, lngTransData } = getTransByLng(filepath, key, lng);
            lngTransData.text = text;
            yield i18n.writeI18n(transData);
        }
    }));
};
exports.removeI18nCommand = () => {
    return vscode.commands.registerCommand(meta_1.default.COMMANDS.removeI18n, ({ filepath, key }) => __awaiter(this, void 0, void 0, function* () {
        const i18n = I18nFile_1.i18nFile.getFileByFilepath(filepath);
        const transData = i18n.getI18n(key);
        i18n.removeI18n(key);
        const recoverText = '恢复';
        const result = yield vscode.window.showInformationMessage(`${Config_1.default.extensionName}: 🚮 ${key}`, recoverText);
        if (result === recoverText) {
            i18n.writeI18n(transData);
        }
    }));
};
//# sourceMappingURL=i18nEditor.js.map