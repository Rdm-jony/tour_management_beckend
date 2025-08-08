/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicTool } from "langchain/tools";
import { ChatMistralAI } from "@langchain/mistralai";
import dotenv from "dotenv"
import axios from "axios";
dotenv.config()

export const suggestTourTool = new DynamicTool({
    name: "suggest_tour",
    description: "Suggests tours based on the user's request such as location, type,costForm or experience.",
    func: async (input: string) => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/tour");
            const tours = res?.data?.data || [];
            const matched = tours?.filter((tour: { location: string; title: string; description: string; }) => {
                const keywords = input.toLowerCase().split(" ");

                return keywords.some(keyword =>
                    tour.location?.toLowerCase().includes(keyword) ||
                    tour.title?.toLowerCase().includes(keyword) ||
                    tour.description?.toLowerCase().includes(keyword)
                );
            });

            if (!matched.length) return "দুঃখিত, আপনার চাহিদার সাথে মিল পাওয়া যায়নি।";
            return matched.map((t: { title: any; location: any; description: any; }) => `📍 ${t.title} (${t.location})\n📝 ${t.description}`).join("\n\n");
        } catch (err: any) {
            console.log(err)
            return "Server error: ট্যুর সাজেস্ট করতে সমস্যা হয়েছে।";
        }
    }
});


const llm = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0
});

export const llmWithTools = llm.bindTools([suggestTourTool]);




