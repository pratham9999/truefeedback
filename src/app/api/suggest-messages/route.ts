/* eslint-disable @typescript-eslint/no-unused-vars */
import  { GoogleGenerativeAI } from  "@google/generative-ai";
import { log } from "console";
import { NextResponse } from "next/server";

if (!process.env.GOOGLE_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const runtime = "edge";

export async function POST(req : Request) {
     try {

        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
         
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContentStream(prompt);
        let finalResponse = "";

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            finalResponse += chunkText;  // Aggregate all chunks
        }

    

        // Return final response
        return NextResponse.json({
            success: true,
            message: finalResponse
        });

        
     } catch (error) {
        console.error("An unexpected Error:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to generate content",
            error: error instanceof Error ? error.message : "Unknown error"
        }, {
            status: 500
        });
        
     }
}