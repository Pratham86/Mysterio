import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { log } from "console";


export async function POST(request : Request){
    await dbConnect()

    try {
        const {username , email , password} = await request.json();
        console.log(username , email , password);
        

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username , isVerified : true
        });

        if(existingUserVerifiedByUsername){
            return Response.json(
                {
                    success : false,
                    message : "Username already taken"
                },
                {status : 400}
            )
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        });

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()

        if(existingUserByEmail){
            
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success : false,
                        message : "Email already registered and verified"
                    },
                    {status: 400}
                )
            }

            else{

                const hashedPassword = await bcrypt.hash(password , 10);

                const expiryDate = new Date(Date.now());

                expiryDate.setHours(expiryDate.getHours() + 1);

                const updateUser = await UserModel.findOneAndUpdate({
                    email
                } , {
                    $set : {verifyCode , username , password : hashedPassword , verifyCodeExpiry: expiryDate}
                } , {
                    new : true
                });

                // return Response.json(
                //     {
                //         success : true,
                //         message : "User information updated successfully. Please verify your account."
                //     },
                //     {status: 200}
                // )

                console.log(updateUser);
                
            }

            
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const user = new UserModel({
                username,
                email ,
                password : hashedPassword,
                verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified: false,
                isAcceptingMessage : true,
                messages : [],
            });
            
            await user.save();
            
        }

        // send verification email
        const emailResponse =  await sendVerificationEmail(email , username , verifyCode);
        log(emailResponse)
        if(!emailResponse.success){
            
            return Response.json({
                success : false,
                message : emailResponse.message
            } , {
                status : 400
            })
        }

        return Response.json({
            success : true,
            message : 'User registered successfully. Kindly verify your account'
        } , {
            status : 201
        })
        
    } catch (error) {
        console.error("Error registering user" , error);
        return Response.json(
            {
                success : false,
                message : "Error registering User"
            },
            {status : 500}
        )
        
    }
}