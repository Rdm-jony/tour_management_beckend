"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.llmWithTools = exports.suggestTourTool = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const tools_1 = require("langchain/tools");
const mistralai_1 = require("@langchain/mistralai");
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
exports.suggestTourTool = new tools_1.DynamicTool({
    name: "suggest_tour",
    description: "Suggests tours based on the user's request such as location, type,costForm or experience.",
    func: (input) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const res = yield axios_1.default.get("http://localhost:5000/api/v1/tour");
            const tours = ((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.data) || [];
            const matched = tours === null || tours === void 0 ? void 0 : tours.filter((tour) => {
                const keywords = input.toLowerCase().split(" ");
                return keywords.some(keyword => {
                    var _a, _b, _c;
                    return ((_a = tour.location) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(keyword)) ||
                        ((_b = tour.title) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(keyword)) ||
                        ((_c = tour.description) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(keyword));
                });
            });
            if (!matched.length)
                return "দুঃখিত, আপনার চাহিদার সাথে মিল পাওয়া যায়নি।";
            return matched.map((t) => `📍 ${t.title} (${t.location})\n📝 ${t.description}`).join("\n\n");
        }
        catch (err) {
            console.log(err);
            return "Server error: ট্যুর সাজেস্ট করতে সমস্যা হয়েছে।";
        }
    })
});
const llm = new mistralai_1.ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0
});
exports.llmWithTools = llm.bindTools([exports.suggestTourTool]);
