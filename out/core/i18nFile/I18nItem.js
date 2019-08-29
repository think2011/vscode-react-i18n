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
const path = require("path");
const translation_js_1 = require("translation.js");
const lodash_1 = require("lodash");
const fs = require("fs");
const Utils_1 = require("../Utils");
const Config_1 = require("../Config");
const Log_1 = require("../Log");
var StructureType;
(function (StructureType) {
    StructureType[StructureType["DIR"] = 0] = "DIR";
    StructureType[StructureType["FILE"] = 1] = "FILE"; // 结构是语言文件的模式
})(StructureType || (StructureType = {}));
const fileCache = {};
class I18nItem {
    constructor(localepath) {
        this.localepath = localepath;
        this.setStructureType();
        this.watch();
    }
    setStructureType() {
        const isDirectory = this.lngs.some(lngItem => lngItem.isDirectory);
        this.structureType = isDirectory ? StructureType.DIR : StructureType.FILE;
    }
    watch() {
        const watcher = vscode.workspace.createFileSystemWatcher(`${this.localepath}/**`);
        const updateFile = (type, { fsPath: filepath }) => {
            const { ext } = path.parse(filepath);
            if (ext !== '.json')
                return;
            switch (type) {
                case 'del':
                    Reflect.deleteProperty(fileCache, filepath);
                    break;
                case 'change':
                case 'create':
                    fileCache[filepath] = this.readFile(filepath);
                    break;
                default:
                // do nothing..
            }
        };
        watcher.onDidChange(updateFile.bind(this, 'change'));
        watcher.onDidCreate(updateFile.bind(this, 'create'));
        watcher.onDidDelete(updateFile.bind(this, 'del'));
    }
    get lngs() {
        const { localepath } = this;
        const files = fs
            .readdirSync(localepath)
            .map((pathname) => {
            const filepath = path.resolve(localepath, pathname);
            const isDirectory = fs.lstatSync(filepath).isDirectory();
            const originLng = isDirectory ? pathname : path.parse(pathname).name;
            return {
                localepath,
                filepath,
                isDirectory,
                originLng,
                lng: Utils_1.default.normalizeLng(originLng)
            };
        })
            .filter(lngItem => !!lngItem.lng)
            .sort(lngItem => {
            return lngItem.lng === Config_1.default.sourceLocale ? -1 : 1;
        });
        if (!files.length) {
            Log_1.default.error(`未能识别locale目录:${localepath}`);
        }
        return files;
    }
    readFile(filepath) {
        try {
            const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
            return typeof data === 'object' ? data : {};
        }
        catch (err) {
            return {};
        }
    }
    transByApi({ text, from = Config_1.default.sourceLocale, to }) {
        return __awaiter(this, void 0, void 0, function* () {
            const plans = [translation_js_1.google, translation_js_1.baidu, translation_js_1.youdao];
            const errors = [];
            let res = undefined;
            for (const plan of plans) {
                try {
                    res = yield plan.translate({ text, from, to });
                    break;
                }
                catch (e) {
                    errors.push(e);
                }
            }
            const result = res && res.result && res.result[0];
            if (!result)
                throw errors;
            return result;
        });
    }
    overrideCheck(keypath) {
        return __awaiter(this, void 0, void 0, function* () {
            let [{ text }] = this.getI18n(keypath);
            let overrideKey = text ? keypath : undefined;
            if (!overrideKey) {
                let tempKeypath = keypath.split('.');
                while (tempKeypath.length) {
                    tempKeypath.pop();
                    const tempOverrideKey = tempKeypath.join('.');
                    const [{ text: tempText }] = this.getI18n(tempOverrideKey);
                    if (typeof tempText !== 'object' && typeof tempText !== undefined) {
                        overrideKey = tempOverrideKey;
                        text = tempText;
                        break;
                    }
                }
            }
            if (!overrideKey) {
                return true;
            }
            const overrideText = '覆盖';
            const isOverride = yield vscode.window.showInformationMessage(`已有 ${overrideKey}:${text}, 覆盖吗？`, { modal: true }, overrideText);
            return isOverride === overrideText;
        });
    }
    transI18n(transData) {
        const mainTrans = transData.find(item => item.lng === Config_1.default.sourceLocale);
        const tasks = transData.map((transItem) => __awaiter(this, void 0, void 0, function* () {
            if (transItem === mainTrans) {
                return transItem;
            }
            transItem.text =
                (yield this.transByApi({
                    text: mainTrans.text,
                    from: Config_1.default.sourceLocale,
                    to: transItem.lng
                })) || transItem.text;
            return transItem;
        }));
        return Promise.all(tasks);
    }
    removeI18n(key) {
        const transData = this.getI18n(key);
        transData.forEach(({ filepath, keypath }) => {
            const file = fileCache[filepath];
            fs.writeFileSync(filepath, JSON.stringify(lodash_1.omit(file, keypath), null, 2));
        });
    }
    getI18n(key) {
        return this.lngs.map(lngItem => {
            let i18nFilepath = lngItem.filepath;
            let keypath = key;
            if (this.structureType === StructureType.DIR) {
                const [filename, ...realpath] = key.split('.');
                i18nFilepath = path.join(i18nFilepath, `${filename}.json`);
                keypath = realpath.join('.');
            }
            // 读取文件
            // TODO: LRU缓存优化
            if (!fileCache[i18nFilepath]) {
                fileCache[i18nFilepath] = this.readFile(i18nFilepath);
            }
            return Object.assign({}, lngItem, { id: Math.random()
                    .toString(36)
                    .substr(-6), key,
                keypath, filepath: i18nFilepath, text: keypath
                    ? lodash_1.get(fileCache[i18nFilepath], keypath)
                    : fileCache[i18nFilepath] });
        });
    }
    writeI18n(transData) {
        return __awaiter(this, void 0, void 0, function* () {
            const writePromise = transData.map(({ filepath, keypath, text }) => {
                return new Promise((resolve, reject) => {
                    if (!fileCache[filepath]) {
                        fileCache[filepath] = this.readFile(filepath);
                    }
                    const file = fileCache[filepath];
                    lodash_1.set(file, keypath, text);
                    fs.writeFile(filepath, JSON.stringify(file, null, 2), err => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                });
            });
            return Promise.all(writePromise);
        });
    }
}
exports.I18nItem = I18nItem;
//# sourceMappingURL=I18nItem.js.map