"use client"

import React from 'react';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay"

import messages from "../../messages.json";

 
const Home = () => {

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnMouseEnter: true })
  )
    
  return (
    <>
      <main className='flex flex-col justify-center items-center py-12 px-4 md:px-24'>
        <section>
          <h1 className='text-center font-bold text-4xl pb-4 '>Dive into the mystery world of anonymous messages</h1>

          <p className='text-center font-normal'>Explore Mysterio - where your identity remains a secret.</p>
        </section>
  
          <Carousel className="mt-20 w-full max-w-xs" 
          plugins={[plugin.current]} 
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex-col aspect-square items-center justify-center p-6 gap-6 shadow-xl">
                      <p className='m-4 font-base '>
                        {message.title}
                      </p>
                      <p className="text-center mt-20 text-xl font-semibold">{message.content}</p>
                    </CardContent> 
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

      </main> 

     <footer className='text-center font-normal mt-10 '>&copy; {new Date(Date.now()).getFullYear()} Mysterio. All rights reserved.</footer>

    </>

  )
}
 
export default Home 