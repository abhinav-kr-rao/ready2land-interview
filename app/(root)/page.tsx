import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
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

          {dummyInterviews.map((interview) => {
            console.log("Dummy");
            return (<InterviewCard key={interview.id} {...interview} />)
          }
          )}

        </div>
      </section>

      <section className=" flex flex-col gap-6 mt-8">
        <h2>
          Take an interview
        </h2>
        <div className="interview-section">
          <p>
            No interviews available
          </p>
        </div>
      </section>
    </>
  );
}
