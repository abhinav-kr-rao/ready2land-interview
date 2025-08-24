'use server'

import { feedbackSchema } from "@/constants";
import { auth, db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { cookies } from "next/headers";

export async function signup(params: SignUpParams) {
    const { uid, name, email } = params;
    const userRecord = await db.collection('users').doc(uid).get();
    try {
        if (userRecord.exists) {
            return {
                success: false,
                message: "User already exists. Sign in"
            }
        }

        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: "Account created"
        }

    }
    catch (err) {
        console.log("Error", err);

    }
}

export async function signin(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: "User does not exists"
            }
        }

        await setSessionCookie(idToken);
    }
    catch (err) {
        console.log(err);
        return {
            success: false,
            message: "Failed to login"
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();
    const one_week = 60 * 60 * 7 * 24;

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: one_week * 1000,  // 1 week
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: one_week,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) return null;

    try {

        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if (!userRecord.exists)
            return null;

        return {
            ...userRecord.data(),
            id: userRecord.id
        } as User;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;

}


export async function getInterviewByUserID(userId:string):Promise<Interview[]|null> {
    const interviews= await db.collection("interviews").where('userId','==',userId).orderBy('createdAt','desc').get();

    return interviews.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
    }) )as Interview[];
}

export async function getLatestInterviews(params:GetLatestInterviewsParams):Promise<Interview[]|null> {
    const {userId,limit=20}=params;
    const interviews= await db.collection("interviews").where('finalized','==',true).where('userId','!=',userId).orderBy('createdAt','desc').limit(limit).get();
    

    return interviews.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
    }) )as Interview[];
}

export async function getInterviewByID(id:string):Promise<Interview|null> {
    const interviews= await db.collection("interviews").doc(id).get();

    return interviews.data() as Interview|null;
}


export async function createFeedback(params:CreateFeedbackParams) {
    const {interviewId,userId,transcript}=params;

    try{
        const formattedTranscript=transcript.map((sentence:{role:string;content:string;})=>(
            `- ${sentence.role}:${sentence.content}\n`
        )).join('');

        const {object:{totalScore,categoryScores,strengths,areasForImprovement,finalAssessment}}=await generateObject({
            model:google('gemini-2.0-flash-001'),
            schema:feedbackSchema,
             prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
        })

        const feedback=await db.collection('feedback').add({
            interviewId,
            userId,
            totalScore,
            categoryScores,
            strengths,
            areasForImprovement,
            finalAssessment,
            createdAt:new Date().toISOString()
        })

        return {
            success:true,
            feedbackId:feedback.id
        }
    }
    catch(err)
    {
        console.log("Error occured",err);
        return {
            success:false
        }
    }
}

export async function getFeedbackByInterviewId(params:GetFeedbackByInterviewIdParams):Promise<Feedback|null> {
    const {interviewId,userId}=params;
    const feedback= await db.collection("feedback").where('interviewId','==',interviewId).where('userId','==',userId).limit(1).get();
    
    if(feedback.empty)
    {
        return null;
    }

    const feedbackDocs=feedback.docs[0];

    return {
        id:feedbackDocs.id,
        ...feedbackDocs.data()
    } as Feedback;
}
// export async function signout() {
//     try {
//         const auth = getAuth();
//         await signOut(auth);
//         console.log("Signed out success");
        
//     }
//     catch (err) {
//         console.log("error signing out", err);

//     }
// }