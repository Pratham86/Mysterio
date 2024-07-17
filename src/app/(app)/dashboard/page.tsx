"use client"

import MessageCard from '@/components/my-components/MessageCard';
import Navbar from '@/components/my-components/Navbar'
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { acceptSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Skeleton } from "@/components/ui/skeleton"


const Dashboard = () => {

  const [messages , setMessages] = useState<Message[]>([]);

  const [isLoading , setIsLoading] = useState<boolean>(false);

  const [isSwitchLoading , setIsSwitchLoading] = useState(false);

  const {toast} = useToast();

  const handleDeleteMessage = (messageId : string) =>{

    setMessages(messages.filter(message => message._id !== messageId));

    
  }

  const {data : session} = useSession();

  const form = useForm<z.infer<typeof acceptSchema>>({
    resolver : zodResolver(acceptSchema)
  });

  const {register , watch , setValue} = form;

  const acceptMessages = watch('acceptMessages'); // watch the value of acceptMessages

  const fetchAcceptMessage = useCallback( async () =>{ // fetch the accept message from the server
    setIsSwitchLoading(true);

    await axios.get<ApiResponse>('/api/accept-messages')
      .then((res) =>{
        setValue('acceptMessages' , res.data.isAcceptingMessage as boolean);
      })
      .catch((err : AxiosError<ApiResponse>) =>{
        toast({
          title : "Error",
          description : err.response?.data.message,
          variant : "destructive"
        })
      }) 
      .finally(() =>
        setIsSwitchLoading(false)
      )
  }, [setValue]); // add toast to the dependencies

  const fetchMessages = useCallback(async (refresh : boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);

    await axios.get<ApiResponse>('/api/get-messages')
    .then((res) => {
      setMessages(res.data.messages || [])

      if(refresh) {
        toast({
          title : "Refreshed Messages",
          description : "Showing refreshed messages."
        })
      }
    })
    .catch((err) => (
      toast({
        title : "Error",
        description : err.response?.data.message,
        variant : "destructive"
      })

    ))
    .finally(() =>
      setIsLoading(false)
    )
  } , [setIsLoading , setMessages]);


  useEffect(() => {
    if(!session || !session.user){
      return
    }
 
    fetchAcceptMessage()

    fetchMessages()

  } , [session , setValue , fetchAcceptMessage,fetchMessages])

  const handleSwitchChange = async () =>{

    await axios.post<ApiResponse>('/api/accept-messages',{
      acceptMessages : !acceptMessages
    })
    .then((res) => {
      setValue('acceptMessages' , !acceptMessages)

      toast({
        title : res.data.message
      })
    })
    .catch((err : AxiosError<ApiResponse>) => (
      toast({
        title : "Error",
        description : err.response?.data.message,
        variant : "destructive"
      })
    ))
  }

  const user = session?.user as User;

  const baseUrlCopy = `${window.location.protocol}//${window.location.host}`

  const profileUrl = `${baseUrlCopy}/u/${user ? user.username : ""}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);

    toast({
      title : "URL copied",
      description : "Profile URL has been copied to clipboard"
    })
  }

  if(!session || !session.user){
    return <div>
      Please Login
    </div>
  }

  return (
    <>
    {
      isLoading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-4 w-screen" />
          <Skeleton className="h-4 w-screen" />
          <Skeleton className="h-4 w-screen" />
          <Skeleton className="h-4 w-screen" />
          <Skeleton className="h-4 w-screen" />
          <Skeleton className="h-4 w-screen" />
          <>
          <Skeleton className="mt-20 h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          </>
          <>
          <Skeleton className="mt-20 h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          </>
        </div>
      ) : (
        <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
          
          <h1 className='text-3xl font-bold mb-10'>User Dashboard</h1>
          
          <div className="mb-4">
            <h2 className='text-lg font-semibold mb-2'>Copy your unique link</h2>
    
            <div className="flex items-center mr-4">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="input input-bordered w-full p-2 mr-2"
              />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
          </div>


          <div className="mb-4">
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="ml-2">
              Accept Messages: {acceptMessages ? 'On' : 'Off'}
            </span>
          </div>
          <Separator />

          <Button
            className="mt-4"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          > 
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw onClick={() => fetchMessages()} className="h-4 w-4" />
            )}
          </Button>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <MessageCard
                  key={index}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <p>No messages to display.</p>
            )}      
          </div>
        </div>
      )
    }

    </>
  )
}

export default Dashboard