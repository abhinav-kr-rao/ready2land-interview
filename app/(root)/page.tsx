import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import { getCurrentUser, getInterviewByUserID, getLatestInterviews } from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const user = await getCurrentUser();
  const [interviews, pastInterviews] = await Promise.all(
    [await getLatestInterviews({ userId: user!.id }), await getInterviewByUserID(user!.id)])


  const hasPastInterviews = interviews!.length > 0;
  const hasNextInterviews = pastInterviews!.length > 0;
  return (
    <>
      <section className=" card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>
            Get interview ready
          </h2>
          <p>
            Practice mock interviews
          </p>
          <Button asChild className='btn-primary'>

            <Link href='/interview'>
              Start an interview
            </Link>
          </Button>
        </div>
        <Image src='/robot.png' width={200} height={200} alt="robot"
          className=" max-sm:hidden"
        />
      </section>
      <section className=" flex flex-col gap-6 mt-8">

        <h2>
          Your interviews
        </h2>
        <div className="interview-section">

          {
            hasPastInterviews ? (
              interviews?.map((interview) => {

                return (<InterviewCard key={interview.id} {...interview} />)
              }
              )) : (<p>
                You have not taken any interviews yet.
              </p>)
          }

        </div>
      </section>

      <section className=" flex flex-col gap-6 mt-8">
        <h2>
          Take an interview
        </h2>
        <div className="interview-section">
          {
            hasNextInterviews ? (
              pastInterviews?.map((interview) => {

                return (<InterviewCard key={interview.id} {...interview} />)
              }
              )
            ) :

              (<p>
                No new interviews available
              </p>)
          }
        </div>
      </section >
    </>
  );
}
