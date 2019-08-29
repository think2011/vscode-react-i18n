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
// 初始化全局配置
const Config_1 = require("./core/Config");
Config_1.default.extAuthor = 'think2011';
Config_1.default.extName = 'react-i18n';
const Log_1 = require("./core/Log");
const coreCommandsModules = require("./core/commands");
const Utils_1 = require("./Utils");
const editorModules = require("./editor");
process.on('uncaughtException', function (err) {
    Log_1.default.error(err, false);
});
function activate(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        Log_1.default.info(`🌞 ${Config_1.default.extensionName} Activated, v${Config_1.default.version}`);
        if (!(yield Utils_1.isReactProject())) {
            Log_1.default.info('🌑 Inactive');
            return;
        }
        const modules = Object.values(Object.assign({}, coreCommandsModules, editorModules));
        modules.forEach((module) => {
            const disposables = module(ctx);
            if (Array.isArray(disposables)) {
                ctx.subscriptions.push(...disposables);
            }
            else {
                ctx.subscriptions.push(disposables);
            }
        });
    });
}
exports.activate = activate;
function deactivate() {
    Log_1.default.info('🌚 Deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map