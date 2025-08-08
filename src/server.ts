/* eslint-disable no-console */
import mongoose from "mongoose";
import { Server } from "http"
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";
// import { llmWithTools, suggestTourTool } from "./app/tools/suggestTourTool";
// import { HumanMessage } from "@langchain/core/messages";

let server: Server;
const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log("Coonect db ✅")

        server = app.listen(5000, () => {
            console.log(`server running on port ${envVars.PORT} ✔`)
        })

        // const messages = [new HumanMessage("suggest a tour location in chittagong?")];

        // const aiMessage = await llmWithTools.invoke(messages);
        // messages.push(aiMessage);

        // const toolMessage = await suggestTourTool.invoke(aiMessage.tool_calls?.[0]);
        // messages.push(toolMessage);
        // console.log(messages)

    } catch (error) {
        console.log(error)
    }
}

(async () => {
    await connectRedis()
    await startServer()
    await seedSuperAdmin()
})()

//unhandle promise reject error
process.on("unhandledRejection", (err) => {
    console.log("unhandle rejection error..server shout down...", err);
    if (server) {
        server.close(() => process.exit(1))
    }
    process.exit(1)
})

// Promise.reject(new Error("i forgot to handle catch error"))

//uncaught local error
process.on("uncaughtException", (err) => {
    console.log("uncaught exception detected..server shout down...", err);
    if (server) {
        server.close(() => process.exit(1))
    }
    process.exit(1)
})

// throw new Error("i forgot to handle local error..")
process.on("uncaughtException", (err) => {
    console.log("uncaught exception detected..server shout down...", err);
    if (server) {
        server.close(() => process.exit(1))
    }
    process.exit(1)
})

//cloud server signal error
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received..server shout down...");
    if (server) {
        server.close(() => process.exit(1))
    }
    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal received..server shout down...");
    if (server) {
        server.close(() => process.exit(1))
    }
    process.exit(1)
})
