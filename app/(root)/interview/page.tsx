import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'
import React from 'react'

const page = async () => {
    const user = await getCurrentUser();
    // console.log(user);

    return (
        <>
            <h3>
                Interview generation
            </h3>

            <Agent userName={user!.name} type='generate' userId={user?.id} />
        </>
    )
}

export default page