"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ControllerFieldState, ControllerRenderProps, FieldValues, useForm, UseFormStateReturn } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  username: z.string().min(2).max(50),
})

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(4) : z.string().optional(),
    email: z.email(),
    password: z.string().min(6)
  })
}


const AuthForm = ({ type }: { type: FormType }) => {

  const router = useRouter();

  // 1. Define your form.

  const isSignIn = type === "sign-in";
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      if (isSignIn) {
        toast.success("Signed in");
        router.push('/');

      }
      else {
        toast.success("Account created successfully, now sign in");
        router.push('/sign-in');

      }
    }
    catch (error) {
      console.log(error);
      toast.error(`There was error ${error}`);

    }
  }


  return (
    <div className="card-border">
      <div className=" flex flex-col">
        <div className=" flex flex-row h-30 gap-4 justify-center">
          <Image src="/logo.svg" alt="logo" width={32} height={38} />
          <h2>
            <span className=" text-amber-600">Ready</span><span className=" text-white">2</span><span className=" text-purple-600">Land</span>
          </h2>
        </div>
        <h3>Get ready for the interview with AI</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4 form w-full">
            {!isSignIn && <FormField
              name="name"
              label="Name"
              control={form.control}
              type="text"
              placeholder="Your name"
            />}
            <FormField
              name="email"
              label="Email"
              control={form.control}
              type="email"
              placeholder="Your email"
            />
            <FormField
              name="password"
              label="Password"
              type="password"
              control={form.control}
              placeholder="Enter password"
            />

            <Button className=" btn" type="submit">
              {isSignIn ? "Sign in" : "Create an account"}
            </Button>
          </form>
        </Form>
        <p className=" text-center">
          {isSignIn ? "No account?" : "Have an account"}
          <Link href={isSignIn ? '/sign-up' : '/sign-in'} className=" font-bold ml-1 text-user-primary">
            {isSignIn ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div >
  )
}

export default AuthForm