"use client"

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { signInSchema } from '@/schemas/signInSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useSession, signIn, signOut } from "next-auth/react"


const SignIn = () => {

  const router = useRouter();

  const {toast} = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver : zodResolver(signInSchema),
  });

  const onSubmit = async (data : z.infer<typeof signInSchema>) =>{

    const result = await signIn( "credentials" , {
      redirect : false ,
      identifier : data.identifier,
      password : data.password
    });

    if( result?.error ){
      toast({
        title : "Error",
        description : result.error,
        variant: "destructive"
      })
    }
    
    if(result?.url ){
      console.log(result);
      
      router.replace('/dashboard')
    }

  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Login
          </h1>

          <p className='mb-4'>
            Enter your credentials to login into your mysrerio account.
          </p>

        </div>

 
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>

            <FormField
            name="identifier"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email/Username</FormLabel>
                <FormControl>
                  <Input placeholder="Email / Username" {...field}
                  />
                </FormControl>
                    
                <FormMessage />
              </FormItem>)}
            />

            <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field}
                  />
                </FormControl>
                    
                <FormMessage />
              </FormItem>)}
            />

            <Button type = "submit" >
              Login
            </Button>
          </form>
        </Form>

          

      </div>
            
    </div>
  )
}

export default SignIn;