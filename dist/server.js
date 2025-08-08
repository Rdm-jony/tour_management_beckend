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
/* eslint-disable no-console */
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
const redis_config_1 = require("./app/config/redis.config");
// import { llmWithTools, suggestTourTool } from "./app/tools/suggestTourTool";
// import { HumanMessage } from "@langchain/core/messages";
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.envVars.DB_URL);
        console.log("Coonect db ✅");
        server = app_1.default.listen(5000, () => {
            console.log(`server running on port ${env_1.envVars.PORT} ✔`);
        });
        // const messages = [new HumanMessage("suggest a tour location in chittagong?")];
        // const aiMessage = await llmWithTools.invoke(messages);
        // messages.push(aiMessage);
        // const toolMessage = await suggestTourTool.invoke(aiMessage.tool_calls?.[0]);
        // messages.push(toolMessage);
        // console.log(messages)
    }
    catch (error) {
        console.log(error);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_config_1.connectRedis)();
    yield startServer();
    yield (0, seedSuperAdmin_1.seedSuperAdmin)();
}))();
//unhandle promise reject error
process.on("unhandledRejection", (err) => {
    console.log("unhandle rejection error..server shout down...", err);
    if (server) {
        server.close(() => process.exit(1));
    }
    process.exit(1);
});
// Promise.reject(new Error("i forgot to handle catch error"))
//uncaught local error
process.on("uncaughtException", (err) => {
    console.log("uncaught exception detected..server shout down...", err);
    if (server) {
        server.close(() => process.exit(1));
    }
    process.exit(1);
});
// throw new Error("i forgot to handle local error..")
process.on("uncaughtException", (err) => {
    console.log("uncaught exception detected..server shout down...", err);
    if (server) {
        server.close(() => process.exit(1));
    }
    process.exit(1);
});
//cloud server signal error
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received..server shout down...");
    if (server) {
        server.close(() => process.exit(1));
    }
    process.exit(1);
});
process.on("SIGINT", () => {
    console.log("SIGINT signal received..server shout down...");
    if (server) {
        server.close(() => process.exit(1));
    }
    process.exit(1);
});
