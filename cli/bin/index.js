#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inquirer = void 0;
var ansi_colors_1 = require("ansi-colors");
var enquirer_1 = require("enquirer");
var choices_1 = __importDefault(require("./choices"));
var log = console.log, clear = console.clear;
function header() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, name, title, heading, makeLine, separator, spacing;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    clear();
                    clear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("./database/about.json")); })];
                case 1:
                    _a = _b.sent(), name = _a.name, title = _a.title;
                    heading = name.split("").join(" ").toUpperCase();
                    makeLine = function (length, char) {
                        if (length === void 0) { length = 2; }
                        if (char === void 0) { char = " "; }
                        return Array(length).fill(char).join("");
                    };
                    separator = makeLine(heading.length + 2, "─");
                    spacing = makeLine((heading.length - title.length - 2) / 2);
                    log("\u256D" + separator + "\u256E");
                    log("│", ansi_colors_1.green.bold(heading), "│");
                    log("│", spacing, ansi_colors_1.yellow(title), spacing, "│");
                    log("\u2570" + separator + "\u256F");
                    return [2 /*return*/];
            }
        });
    });
}
var menuMessages = [
    "What would you like to know?",
    "Where to next?",
    "What's next?",
    "Wanna continue with",
];
// Function to handle prompts
function inquirer(firstTime) {
    return __awaiter(this, void 0, void 0, function () {
        var message, response, option, match, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!firstTime) return [3 /*break*/, 2];
                    // Clean slate and render header
                    return [4 /*yield*/, header()];
                case 1:
                    // Clean slate and render header
                    _b.sent();
                    log("  Welcome to my CLI resume.\n  Feel free to roam around.");
                    return [3 /*break*/, 3];
                case 2:
                    log("");
                    _b.label = 3;
                case 3:
                    message = firstTime
                        ? "Where to begin?"
                        : menuMessages[Math.floor(Math.random() * menuMessages.length)];
                    return [4 /*yield*/, enquirer_1.prompt([
                            {
                                type: "select",
                                name: "option",
                                message: message,
                                choices: Object.keys(choices_1.default),
                            },
                        ])];
                case 4:
                    response = _b.sent();
                    // ------------------
                    // Clean slate and render header
                    return [4 /*yield*/, header()];
                case 5:
                    // ------------------
                    // Clean slate and render header
                    _b.sent();
                    option = response.option;
                    // Print Choice
                    log(ansi_colors_1.cyan("•"), ansi_colors_1.bold(option.toUpperCase()));
                    match = Object.entries(choices_1.default).find(function (_a) {
                        var choice = _a[0];
                        return choice === option;
                    });
                    // Execute choice callback
                    _a = match;
                    if (!_a) 
                    // Execute choice callback
                    return [3 /*break*/, 7];
                    return [4 /*yield*/, match[1]()];
                case 6:
                    _a = (_b.sent());
                    _b.label = 7;
                case 7:
                    // Execute choice callback
                    _a;
                    // Recurse till Exit
                    return [4 /*yield*/, inquirer()];
                case 8:
                    // Recurse till Exit
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.inquirer = inquirer;
function exitErrorCallback() {
    clear();
    log(ansi_colors_1.bold("Siddhant Gupta's Resume"));
    log("Thank you for using the CLI.");
    log("`npx guptasiddhant`");
}
// Entry point
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Handle exit with error
        process.on("exit", function (code) { return code > 0 && exitErrorCallback(); });
        // firstTime inquiring
        inquirer(true);
        return [2 /*return*/];
    });
}); })();
