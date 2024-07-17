import dbConnect from "@/lib/dbConnect";
import {z} from "zod";
import UserModel from "@/model/User";

import { usernameValidation } from "@/schemas/signUpSchema";

const UserVerificationQuery = z.object({
    username : usernameValidation
})

export async function POST(request : Request){
    await dbConnect()

    try {
        const{username , code} = await request.json();

        const decodedUsername = decodeURIComponent(username);
        const decodedCode = decodeURIComponent(code);

        const result = UserVerificationQuery.safeParse({
            username : decodedUsername
        })

        if(!result.success){
            const usernameError = result.error.format().username?._errors || [];
            
            
            return Response.json({
                success : false,
                message : usernameError?.length > 0 ? usernameError.join(', ') : "Username Error",

            } , {status: 400})
        }

        const user = await UserModel.findOne({username : decodedUsername})
        console.log(user);
        
        if(!user){
            return Response.json({
                success: false,
                message : "User not found"
            }, {
                status : 400
            }) 
        }

        const isCodeCorrect = user.verifyCode === decodedCode

        console.log(user.verifyCode , decodedCode);
        
        const isCodeValid = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeCorrect){

            if(isCodeValid){

                user.isVerified = true
                await user.save();
    
                return Response.json({
                    success: true,
                    message : "Accout Verified Successfully"
                }, {
                    status : 200
                })
            }
            else{
                return Response.json({
                    success: false,
                    message : "Code has expired its validity. Please SignUp again"
                }, {
                    status : 400
                })
            }
        }
        else{
            return Response.json({
                success: false,
                message : "Verification code entered is incorrect"
            }, {
                status : 400
            })
        }
        
    } catch (error) {
        console.log("Error verifying user" , error);

        return Response.json({
            success: false,
            message : "Error verifying user"
        }, {
            status : 500
        })
    }
}