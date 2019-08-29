"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Utils_1 = require("./Utils");
const I18N_PATHS_KEY = 'i18nPaths';
class Config {
    static get extension() {
        return vscode.extensions.getExtension(this.extensionId);
    }
    static get extensionId() {
        return `${this.extAuthor}.${this.extName}`;
    }
    static get extensionName() {
        return this.extName;
    }
    static get i18nPaths() {
        const paths = this.getConfig(I18N_PATHS_KEY);
        return paths ? paths.split(',') : [];
    }
    static get version() {
        return this.extension.packageJSON.version;
    }
    static get hasI18nPaths() {
        return !!this.i18nPaths.length;
    }
    static get sourceLocale() {
        return Utils_1.default.normalizeLng(this.getConfig('sourceLocale') || 'zh-CN');
    }
    static getConfig(key) {
        return vscode.workspace.getConfiguration(this.extensionName).get(key);
    }
    static setConfig(key, value, isGlobal = false) {
        return vscode.workspace
            .getConfiguration(this.extensionName)
            .update(key, value, isGlobal);
    }
    static updateI18nPaths(paths) {
        const i18nPaths = [...new Set(this.i18nPaths.concat(paths))];
        this.setConfig(I18N_PATHS_KEY, i18nPaths.join(','));
    }
}
exports.default = Config;
//# sourceMappingURL=Config.js.map