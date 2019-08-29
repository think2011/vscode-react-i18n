"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const Config_1 = require("./Config");
class Log {
    static get outputChannel() {
        if (!this._channel)
            this._channel = vscode_1.window.createOutputChannel(Config_1.default.extName);
        return this._channel;
    }
    static raw(...values) {
        this.outputChannel.appendLine(values.map(i => i.toString()).join(' '));
    }
    static info(message, intend = 0) {
        this.outputChannel.appendLine(`${'\t'.repeat(intend)}${message}`);
    }
    static error(err, prompt = true, intend = 0) {
        if (prompt)
            vscode_1.window.showErrorMessage(`${Config_1.default.extName} Error: ${err.toString()}`);
        if (typeof err === 'string')
            Log.info(`🐛 ERROR: ${err}`, intend);
        else
            Log.info(`🐛 ERROR: ${err.name}: ${err.message}\n${err.stack}`, intend);
    }
    static divider() {
        this.outputChannel.appendLine('\n――――――\n');
    }
}
exports.default = Log;
//# sourceMappingURL=Log.js.map