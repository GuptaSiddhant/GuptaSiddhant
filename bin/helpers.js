"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapText = exports.logTable = void 0;
var ansi_colors_1 = require("ansi-colors");
/** Log information in tabular columns */
exports.logTable = function (info) {
    var maxKeyLength = info.reduce(function (acc, cur) { return Math.max(acc, cur.key.length); }, 0);
    info.forEach(function (_a) {
        var key = _a.key, value = _a.value;
        var keySpace = new Array(maxKeyLength - key.length).fill(" ").join("");
        console.log(" ", ansi_colors_1.dim(key + ":" + keySpace), value);
    });
};
/** Wrap text with charLimit per sentence */
exports.wrapText = function (text, charLimit) {
    if (charLimit === void 0) { charLimit = 40; }
    var newStr = [];
    var sentence = "";
    text.split(" ").forEach(function (word) {
        if (sentence.length > charLimit) {
            newStr.push(sentence);
            sentence = "";
        }
        sentence += word + " ";
    });
    newStr.push(sentence);
    return "  " + newStr.join("\n  ");
};
