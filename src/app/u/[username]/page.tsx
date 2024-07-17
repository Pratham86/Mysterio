"use client"


import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import { useToast } from "@/components/ui/use-toast";
import { messageSchema } from '@/schemas/messageSchema';
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { useParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'


const page = () => {

  const {toast} = useToast();

  const[isSuggesting , setIsSuggesting] = useState<boolean>(false);

  const [suggestedMessages , setSuggestedMessages] = useState<String[]>([]);

  const {username} = useParams();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  

  const temp = [
    "How are you doing?","What is your faviourite book?" , "jqwdioiofiofi kjasncclknaslkcn akldnilanlan"
  ]

  const onSubmit = async (data: z.infer<typeof messageSchema>) => { 
    
    await axios.post<ApiResponse>(`/api/send-message`, {
      username , content : data.content
    })
    .then((res) => {
      toast({
        title : "Success",
        description: `Message posted successfully`,
        
      })
    })
    .catch((err : AxiosError<ApiResponse>) => {
      toast({
        title : "Failed",
        description: "Error while sending message"
      })

      console.log(err.response?.data);
      
    })
  }

  const suggestMessage = async () => {
    setIsSuggesting(true);

    await axios.post<ApiResponse>(`/api/suggest-messages` , {body : 1})
    .then((res) => {
      const triplets = res.data.message.split("Or");
      const lastMessages = triplets[triplets.length - 1].split("||");
      
      setSuggestedMessages(lastMessages);
      // console.log(res);
      
    })
    .catch((err) => {
      toast({
        title : "Error",
        description : "Not able to retrieve the suggested messages."
      })
    })
    setIsSuggesting(false)
  }

  return (
    <div className='p-10'>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-2xl font-bold '>Send anonymous message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please type your message here"
                    className='border-gray-800 border-2'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      
      <div className='mt-20 flex-col justify-between items-center gap-10'>
        <Button onClick={suggestMessage}>
          Suggest Messages
        </Button>

        {isSuggesting && (
          <div className="shadow-xl items-center mt-10 rounded-md border mb-20 mx-10">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        )}  
        { ((!isSuggesting && suggestedMessages.length === 0) ? 
          (
            <p className="text-center my-10">No Suggested Messages</p>
          ) : (
            <ScrollArea className="shadow-xl items-center mt-10 rounded-md border mb-20 mx-10">
              <div className="p-4">
                <h1 className="my-5 text-2xl font-semibold text-center">Messages</h1>
                {suggestedMessages.map((message , index) => (
                  <div key={index}>
                    <Separator className="my-2" />
                    
                    <div key={index} className="text-normal text-center">
                      {message}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ))
        }
        

      </div>

    </div>
  )
}

export default page