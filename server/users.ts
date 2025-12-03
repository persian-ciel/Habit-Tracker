'use server'

import {auth} from "@/lib/auth";
import { error } from "console";
import { success } from "zod";
import { tr } from "zod/v4/locales";

export const signIn = async(email: string, password: string) => {
    try{
    await auth.api.signInEmail({
        body: {
            email,
            password
        }
        
    })
    return{
        success: true,
        message: "Signed in successfully"
    }
}catch(e){
    const error = e as Error
        return{
        success: true,
        message:  error.message || "Something went wrong"
    }
    }
}
export const signUp = async(username: string, email: string, password: string) => {
    try{
    await auth.api.signUpEmail({
        body: {
            email ,
            password ,
            name: username
        }
    })
    return{
        success: true,
        message: "Account created successfully"
    }
}catch(e){
        const error = e as Error
        return{
        success: false,
        message:  error.message || "Something went wrong"
    }
    }
}