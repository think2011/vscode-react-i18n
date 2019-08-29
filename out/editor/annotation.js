"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const editor_1 = require("../core/editor");
const utils_1 = require("../utils");
const utils_2 = require("../utils");
class AnnotationProvider extends editor_1.Annotation {
    get KEY_REG() {
        return utils_1.KEY_REG;
    }
    transformKey(text, key) {
        const prefix = utils_2.KeyDetector.getKeyPrefixByKey(key) || utils_2.KeyDetector.getKeyPrefixByText(text);
        return `${prefix}.${key}`;
    }
}
exports.annotationEditor = () => {
    const annotation = new AnnotationProvider();
    return annotation.disposables;
};
//# sourceMappingURL=annotation.js.map