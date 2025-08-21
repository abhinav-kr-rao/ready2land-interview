import Navbar from '@/components/Navbar'
import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

const Rootlayout = async ({ children }: { children: ReactNode }) => {
    const isUserAuthenticated=await isAuthenticated();

    if(!isUserAuthenticated)
        redirect('/sign-in')
    return (
        <div>
            <Navbar />
            {children}
        </div>
    )
}

export default Rootlayout