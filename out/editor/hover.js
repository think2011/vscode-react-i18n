"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const editor_1 = require("../core/editor");
const utils_1 = require("../utils");
class HoverProvider extends editor_1.Hover {
    getKey(document, position) {
        return utils_1.KeyDetector.getKey(document, position);
    }
}
exports.hoverEditor = () => {
    return vscode.languages.registerHoverProvider([
        { language: 'react', scheme: '*' },
        { language: 'javascriptreact', scheme: '*' },
        { language: 'typescriptreact', scheme: '*' },
        { language: 'javascript', scheme: '*' },
        { language: 'typescript', scheme: '*' }
    ], new HoverProvider());
};
//# sourceMappingURL=hover.js.map