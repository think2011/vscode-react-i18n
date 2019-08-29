"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Log_1 = require("../core/Log");
__export(require("./KeyDetector"));
exports.KEY_REG = /(?:[\s{\.]t)\(['"]([^]+?)['"]/g;
exports.isReactProject = () => {
    const mainProject = vscode.workspace.workspaceFolders[0];
    if (!mainProject) {
        return false;
    }
    try {
        const pkgJSON = require(`${mainProject.uri.fsPath}/package.json`);
        const { dependencies, devDependencies } = pkgJSON;
        return Object.keys(Object.assign({}, dependencies, devDependencies)).some(pkgName => {
            return /i18next/.test(pkgName);
        });
    }
    catch (err) {
        Log_1.default.error(err);
    }
};
//# sourceMappingURL=index.js.map