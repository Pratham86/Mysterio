import {z} from 'zod'

export const messageSchema = z.object({
    content : z.string()
            .min(10 , "Content must be of atleaast 10 characters")
            .max(300 , "Message exceeds word limit (300 characters)")

});