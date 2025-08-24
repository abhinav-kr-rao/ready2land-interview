import Agent from '@/components/Agent';
import DisplayTechIcons from '@/components/DisplayTechIcons';
import { getCurrentUser, getInterviewByID } from '@/lib/actions/auth.action';
import { getRandomInterviewCover } from '@/lib/utils';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async ({ params }: RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUser();

    const interview = await getInterviewByID(id);

    if (!interview) {
        redirect('/');
    }

    return (
        <>
            <div className=" flex flow-row gap-4 justify-between">
                <div className=" flex flex-row gap-4 items-center max-sm:flex-col">
                    <div className=" flex flex-row gap-4 items-center">
                        <Image src={getRandomInterviewCover()} width={40} height={40} alt='img'
                            className=' rounded-full object-cover size-[40px]' />
                        <h3 className=' capitalize'>
                            {interview.role} interview
                        </h3>
                    </div>
                    <DisplayTechIcons techStack={interview.techstack} />
                </div>
                <p className=' rounded-lg bg-dark-200 capitalize px-4 py-2 h-fit'>
                    {interview.type}
                </p>
            </div>
            <Agent
                userName={user?.name||''}
                userId={user?.id}
                interviewId={id}
                questions={interview.questions}
                type='interview'
            />
        </>
    )
}

export default page