"use client"

import React from 'react'
import Link from 'next/link'
import { useSession , signOut} from 'next-auth/react';
import {User} from 'next-auth';
import { Button } from '../ui/button';

const Navbar = () => {

    const {data : session} = useSession();

    const user : User | null = session?.user || null;

    return (
        <nav className='mb-2 shadow-md p-4 md:p-6 w-screen-10' >
            <div className='container flex flex-col md:flex-row justify-between items-center'>
                <Link href='/'>
                    Home
                </Link>
                {
                    user ? (
                        <>
                            <h1 className='mr-4 font-extrabold text-4xl'>Mysterio</h1>

                            <Button className='w-full md:w-auto'  onClick={() => signOut()}>Sign Out</Button>
                        </>
                    ) : (
                        <>
                            <h1 className='mr-4 font-extrabold text-4xl'>Mysterio</h1>

                            <Link href = {'/sign-in'}>
                                <Button>Login</Button>
                            </Link>

                        </>

                        
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar