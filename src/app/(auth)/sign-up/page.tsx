'use client'

import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod";
import Link from 'next/link';
import axios  , {AxiosError} from 'axios';
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';


const page = () => {

  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const [isSubmitting , setIsSubmitting] = useState(false);

  const [debouncedUsername, setDebouncedUsername] = useDebounceValue(username, 500);

  const {toast} = useToast();

  const router = useRouter();

  // zod implementation

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver : zodResolver(signUpSchema),
    defaultValues : {
      username : '',
      email: '',
      password: ''
    } 
  });

  useEffect(() => {
    const checkUsernameUnique = async () =>{

      if(debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage('');

        await axios.get(`/api/check-username?username=${debouncedUsername}`)

        .then((res) => setUsernameMessage(res.data.message))

        .catch(err => {
          const axiosError = err as AxiosError<ApiResponse>

          setUsernameMessage(axiosError.response?.data.message ?? "Error Checking Username")

        })

        .finally(() => setIsCheckingUsername(false));

      }
    } 
  
    checkUsernameUnique();
  
  } , [debouncedUsername]);



  const onSubmit = async (data: z.infer<typeof signUpSchema>) =>{

    setIsSubmitting(true)

    await axios.post<ApiResponse>('/api/sign-up' , data)
    
    .then((res) =>{
      
      toast({
        title: 'Success',
        description : res.data.message
      })
 
      router.replace(`/verify/${data.username}`);
    })

    .catch((err : AxiosError<ApiResponse>) =>(
      toast({
        title: 'Sign-up Failure',
        description : err.response?.data.message ?? "Error Signing Up",
        variant:'destructive'
      })
    ))

    .finally(() => setIsSubmitting(false))

  }
  

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mysterio
          </h1>

          <p className="mb-4">
            Sign-up to start your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>

            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} 
                    onChange={(e) => {
                      field.onChange(e)
                      setDebouncedUsername(e.target.value)
                    }}
                    />
                  </FormControl>
                    {isCheckingUsername && <Loader2 className='animate-spin' />}

                    <p className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}>
                        {usernameMessage}

                    </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type = "password" placeholder="Password" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type = "submit" disabled = {isSubmitting}>
              {
                isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-2 w-2 animate-bounce'/> Please wait
                  </>
                ) : ("Sign Up")
              }
            </Button>


          </form>

        </Form>

        <div className="text-center">
          <p>
            Already a member?{" "}
            <Link href={"/sign-in"} className='text-blue-600 hoover:text-blue-900'>
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default page

