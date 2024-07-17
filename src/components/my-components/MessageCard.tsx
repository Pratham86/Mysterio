"use client"

import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from '@/lib/utils';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { useToast } from '../ui/use-toast';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
  
  


type MessageCardProps = {
    message : Message;
    onMessageDelete : (messageId : string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

    const {toast} = useToast();

    const handleDeleteConfirm = async () =>{
        await axios.delete(`/api/delete-message/${message._id}`)
        .then((res : AxiosResponse<ApiResponse>) =>{
            toast({
                title : "Success",
                description : res.data.message
            })

            onMessageDelete(message._id as string)
        })
        .catch((err) =>{
            toast({
                title : "Success",
                description : err.data.message
            })
        })
    }

  return (
    <div>

        <Card className={cn("ml-8 w-[380px] flex-col justify-between items-center")} >
            <CardHeader>
                <CardTitle className='text-center text-lg' >{message.content}</CardTitle>
                <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className='w-fit items-center text-center ml-20' variant="destructive"><X className='' />Delete Message</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </CardHeader>
            <CardContent>
                <p>{message.content}</p>
            </CardContent>
            
        </Card>


    </div>
  )
}

export default MessageCard