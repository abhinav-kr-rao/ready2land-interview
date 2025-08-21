'use server'

import { auth, db } from "firebase/admin";
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

        console.log(params);
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
        } as User
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