"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const Config_1 = require("../Config");
const I18nItem_1 = require("./I18nItem");
class I18nFile {
    constructor() {
        this.i18nItems = new Map();
    }
    getFileByFilepath(filepath) {
        const localepath = this.getRelativePathByFilepath(filepath);
        const i18nFile = this.i18nItems.get(localepath);
        if (i18nFile) {
            return i18nFile;
        }
        this.i18nItems.set(localepath, new I18nItem_1.I18nItem(localepath));
        return this.i18nItems.get(localepath);
    }
    getRelativePathByFilepath(filepath) {
        const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const i18nPaths = Config_1.default.i18nPaths;
        const i18nRootPath = i18nPaths
            .map((pathItem) => path.resolve(rootPath, pathItem))
            .sort((a, b) => 
        //通过对比哪个更接近来确定符合要求的目录
        path.relative(filepath, a).length > path.relative(filepath, b).length
            ? 1
            : -1)[0];
        return i18nRootPath;
    }
}
exports.i18nFile = new I18nFile();
//# sourceMappingURL=I18nFile.js.map