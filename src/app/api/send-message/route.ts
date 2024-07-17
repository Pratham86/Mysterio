import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { Message } from "@/model/User";

export async function POST(request : Request){
    await dbConnect();

    const {username , content} = await request.json();

    try {
        const user = await UserModel.findOne({username});

        if(!user){
            return Response.json({
                success : false,
                messsge : "User not found"
            },{status : 404}) 
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success : false,
                messsge : "User is not accepting messages"
            },{status : 400})
        }
        else{

            const newMessage = {
                content ,
                createdAt : new Date()
            }

            user.messages.push(newMessage as Message)

            await user.save();

            return Response.json({
                success : true,
                messsge : "Message sent successfully"
            },{status : 200})
        }
    } catch (error) {
        return Response.json({
            success : false,
            messsge : "Not able to send message"
        },{status : 500})
    }

}