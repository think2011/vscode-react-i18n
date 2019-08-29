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
const path = require("path");
const i18nFile_1 = require("../i18nFile");
const Config_1 = require("../Config");
const toCamelCase = str => {
    return str.replace(/(-\w)/g, $1 => {
        return $1[1].toUpperCase();
    });
};
const onExtract = ({ filepath, text, keyReplace, promptText = `请输入要保存的路径，例如:home.document.title`, keyTransform = key => key, defaultKeyTransform = key => key }) => __awaiter(this, void 0, void 0, function* () {
    // 生成参考key
    let relativeName = path.relative(vscode.workspace.rootPath, filepath);
    relativeName = path.parse(relativeName);
    let defaultKey = relativeName.dir
        .split(path.sep)
        .splice(1)
        .concat(relativeName.name)
        .map(toCamelCase);
    if (defaultKey.length > 1) {
        defaultKey = defaultKey.splice(1);
    }
    defaultKey = `${defaultKey.join('.')}.${Math.random()
        .toString(36)
        .substr(-6)}`;
    let key = yield vscode.window.showInputBox({
        prompt: promptText,
        valueSelection: [defaultKey.lastIndexOf('.') + 1, defaultKey.length],
        value: defaultKeyTransform(defaultKey)
    });
    if (!key) {
        return;
    }
    key = keyTransform(key);
    const i18n = i18nFile_1.i18nFile.getFileByFilepath(filepath);
    // 重复检测
    const isOverride = yield i18n.overrideCheck(key);
    if (!isOverride) {
        return;
    }
    // 替换内容
    vscode.window.activeTextEditor.edit(editBuilder => {
        const { start, end } = vscode.window.activeTextEditor.selection;
        editBuilder.replace(new vscode.Range(start, end), keyReplace(key));
    });
    // 翻译内容
    let transData = i18n.getI18n(key);
    const mainTrans = transData.find(item => item.lng === Config_1.default.sourceLocale);
    mainTrans.text = text;
    transData = yield i18n.transI18n(transData);
    // 写入翻译
    i18n.writeI18n(transData);
});
exports.extract = () => {
    return vscode.commands.registerCommand(meta_1.default.COMMANDS.extract, onExtract);
};
//# sourceMappingURL=extract.js.map