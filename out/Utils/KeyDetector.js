"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const _1 = require("./");
class KeyDetector {
    static getKeyByContent(text) {
        const prefix = this.getKeyPrefixByText(text);
        const keys = (text.match(_1.KEY_REG) || []).map(key => `${prefix}.${key.replace(_1.KEY_REG, '$1')}`);
        return [...new Set(keys)];
    }
    static getKeyByFilepath(filepath) {
        const file = fs.readFileSync(filepath, 'utf-8');
        return this.getKeyByContent(file);
    }
    static getKey(document, position) {
        const keyRange = document.getWordRangeAtPosition(position, _1.KEY_REG);
        const key = keyRange
            ? document.getText(keyRange).replace(_1.KEY_REG, '$1')
            : undefined;
        if (!key) {
            return;
        }
        return `${this.getKeyPrefixByKey(key) ||
            this.getKeyPrefixByText(document.getText())}.${key}`;
    }
    static getKeyPrefixByText(text) {
        const NS_REG = /(?:useTranslation|withTranslation)\(\[?['"](.*?)['"]/g;
        const nsKey = (text.match(NS_REG) || [])[0] || '';
        return nsKey.replace(NS_REG, '$1');
    }
    static getKeyPrefixByKey(key) {
        const [prefix, resetKey] = key.split(':');
        return resetKey ? prefix : undefined;
    }
}
exports.KeyDetector = KeyDetector;
//# sourceMappingURL=KeyDetector.js.map