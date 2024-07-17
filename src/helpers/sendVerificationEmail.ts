import { resend } from "@/lib/resend";
import verificationEmail from "../../emails/verificationEmail"
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificationEmail = async (email: string , username : string , verifyCode : string): Promise<ApiResponse> => {

    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Mysterio message | Verification Code',
            react: verificationEmail({username , otp : verifyCode}),
        });

        console.log(error)
        
        if(data){

            return {
                success : true,
                message : 'Verification email sent successfully'
                
            }
        }
        else {
            
            return {
                success : false,
                message : 'Failed to send the verification email'

            }
        }

        
    } catch (error) {
        console.log("Error sending verification email" , error);

        return{success : false , message : 'Failed to send the verification email'}
    }
}
