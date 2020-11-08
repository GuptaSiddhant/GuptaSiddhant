"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapText = exports.logTable = void 0;
var ansi_colors_1 = __importDefault(require("ansi-colors"));
/** Log information in tabular columns */
exports.logTable = function (info) {
    var maxKeyLength = info.reduce(function (acc, cur) { return Math.max(acc, cur.key.length); }, 0);
    console.log(""); // Line break
    info.forEach(function (_a) {
        var key = _a.key, _b = _a.value, value = _b === void 0 ? "" : _b, color = _a.color;
        var keySpace = new Array(maxKeyLength - key.length).fill(" ").join("");
        console.log(" ", ansi_colors_1.default["dim"](key + keySpace + " :"), ansi_colors_1.default[color || "reset"](value.replace("\n", " ")));
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
