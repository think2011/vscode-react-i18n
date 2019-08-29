"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const editor_1 = require("../core/editor");
const utils_1 = require("../utils");
class TransViewProvider extends editor_1.TransView {
    getKeysByFilepath(filepath) {
        return utils_1.KeyDetector.getKeyByFilepath(filepath);
    }
}
exports.transViewEditor = () => {
    const transView = new TransViewProvider();
    return transView.disposables;
};
//# sourceMappingURL=transView.js.map