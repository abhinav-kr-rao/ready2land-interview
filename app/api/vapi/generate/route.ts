import { generateObject, generateText } from "ai";
import { google } from '@ai-sdk/google'
import { db } from "@/firebase/admin";
import z from "zod";

export async function GET() {
    return Response.json({
        success: true,
        message: "Thank you "
    }, { status: 200 })
}


const PROMPT = (role: string, level: string, techstack: string, type: string, amount: number) => `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `

export async function POST(request: Request) {
    const { type, role, level, techstack, amount, userid } = await request.json();

    try {
        const { object: questions } = await generateObject({
            model: google('gemini-2.5-flash-lite'),
            schema: z.object({
                questions: z.array(z.string())
            }),
            prompt: PROMPT(role, level, techstack, type, amount)
        })

        console.log("Questions by AI are ", questions);

        const interview = {
            role, type, level,
            techstack: techstack.split(','),
            questions: questions.questions,
            userId: userid,
            finalized: true,
            createdAt: new Date().toISOString()
        } // also try cover image


        await db.collection("interviews").add(interview);

        return Response.json({ success: true }, { status: 200 })
    }
    catch (err) {
        console.error(err);
        return Response.json({
            success: false,
            error: err
        }, { status: 500 })
    }
} 