import dbConnect from "@/lib/dbConnect";
import {z} from "zod";
import UserModel from "@/model/User";

import { usernameValidation } from "@/schemas/signUpSchema";
import { log } from "console";

const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request : Request){
    
    await dbConnect();

    try {
        const {searchParams} = new URL(request.url);
        
        const queryParam = {
            username : searchParams.get('username')
        }

        const result = UsernameQuerySchema.safeParse(queryParam);

        log(result);

        if(!result.success){
            const usernameError = result.error.format().username?._errors || [];
            
            
            return Response.json({
                success : false,
                message : usernameError?.length > 0 ? usernameError.join(', ') : "Invalid query Parameter",

            } , {status: 400})
        }

        const {username} = result.data;

        
        const existingUser = await UserModel.findOne({
            username , isVerified : true
        });

        
        if(existingUser){
            return Response.json({
                success : false,
                message : "Username already taken"
            } , {status: 400})
        }

        
        return Response.json({
            success : true,
            message : "Username is unique"
        } , {status: 200})


    } catch (error) {
        console.log("Error checking username availability" , error);

        return Response.json({
            success: false,
            message : "Error checking username availability"
        }, {
            status : 500
        })
    }
}