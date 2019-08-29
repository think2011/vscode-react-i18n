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
const fg = require("fast-glob");
const meta_1 = require("../meta");
const Config_1 = require("../Config");
const Log_1 = require("../Log");
class InitPath {
    autoInit() {
        return __awaiter(this, void 0, void 0, function* () {
            const rootPath = vscode.workspace.rootPath;
            const pattern = [`${rootPath}/**/(locales|locale|i18n|lang|langs)`];
            const result = yield fg(pattern, {
                ignore: ['**/node_modules'],
                onlyDirectories: true
            });
            Config_1.default.updateI18nPaths(result);
            const info = `${Config_1.default.extensionName}:🌟已帮你配置以下目录\n ${result.join('\n')}`;
            vscode.window.showInformationMessage(info);
            Log_1.default.info(info);
        });
    }
    manualInit() {
        return __awaiter(this, void 0, void 0, function* () {
            const okText = '立即配置';
            const result = yield vscode.window.showInformationMessage(`${Config_1.default.extensionName}: 项目里的locales文件夹在哪？`, okText);
            if (result !== okText) {
                return;
            }
            const dirs = yield this.pickDir();
            Config_1.default.updateI18nPaths(dirs);
            this.success();
        });
    }
    pickDir() {
        return __awaiter(this, void 0, void 0, function* () {
            let dirs = yield vscode.window.showOpenDialog({
                defaultUri: vscode.Uri.file(vscode.workspace.rootPath),
                canSelectFolders: true
            });
            return dirs.map(dirItem => dirItem.path);
        });
    }
    success() {
        return __awaiter(this, void 0, void 0, function* () {
            const okText = '继续配置';
            const result = yield vscode.window.showInformationMessage(`${Config_1.default.extensionName}: 配置好了，还有其他目录吗？`, okText, '没有了');
            if (result !== okText) {
                return;
            }
            this.manualInit();
        });
    }
}
const initPath = new InitPath();
exports.autoInitCommand = () => {
    if (!Config_1.default.hasI18nPaths) {
        initPath.autoInit();
    }
    return vscode.commands.registerCommand(meta_1.default.COMMANDS.autoInitPath, () => {
        initPath.autoInit();
    });
};
exports.manualInitCommand = () => {
    return vscode.commands.registerCommand(meta_1.default.COMMANDS.manualInitPath, () => {
        initPath.manualInit();
    });
};
//# sourceMappingURL=initPath.js.map