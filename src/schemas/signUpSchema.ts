import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2 , "Username must be of atleast length 2")
    .max(20 , "Username must be no more than 20 characters")
    .regex(  /^(?!_)[A-Za-z0-9_]{3,16}(?<!_)$/ , "Username must not contain special character")

export const signUpSchema = z.object({

    username : usernameValidation,

    email : z.string().email({message:"Invalid email"}),

    password : z.string().min(6 , {message : "password must be atleast 6 characters"})
});