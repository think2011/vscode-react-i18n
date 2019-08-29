"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lngs_1 = require("./lngs");
class Utils {
    static normalizeLng(lng) {
        const result = lngs_1.default.find((lngItem) => {
            if (Array.isArray(lngItem) && lngItem[1].includes(lng)) {
                return true;
            }
            if (typeof lngItem === 'string' &&
                lng.toUpperCase() === lngItem.toUpperCase()) {
                return true;
            }
        });
        return result
            ? (Array.isArray(result) ? result[0] : result)
            : undefined;
    }
}
exports.default = Utils;
//# sourceMappingURL=Utils.js.map