// import { signout } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
// import { useRouter } from 'next/navigation'
import React from 'react'

const Navbar = () => {

    // const router = useRouter();
    // const handleSignOut = () => {
    //     signout();
    //     router.push('/sign-in');
    // }

    return (
        <nav className=' flex gap-6 justify-around'>
            <Link href='/' className='flex  gap-4'>
                <Image
                    src='/logo.svg' width={38} height={32} alt='logo'
                />
                <h2>
                    Ready2Land
                </h2>
            </Link>
            {/* <div className=" bg-amber-200 rounded-3xl p-2">
                <button className=' text-black hover:cursor-pointer' onClick={handleSignOut}>
                    Sign out
                </button>
            </div> */}
        </nav>
    )
}

export default Navbar