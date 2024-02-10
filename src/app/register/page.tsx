"use client";
import register from "@/actions/register";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { ApiResponseType } from "@/models/response";
import { RegisterSchema } from "@/schemas/register";
import { user } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

export default function Home() {
  const router = useRouter();
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const repassword = useRef<HTMLInputElement>(null);

  const onSubmit = async () => {
    const result = safeParse(RegisterSchema, {
      username: username.current?.value,
      password: password.current?.value,
      repassword: repassword.current?.value,
    });

    if (result.success) {
      const registerrespone: ApiResponseType<user | null> = await register({
        password: result.output.password,
        username: result.output.username,
      });
      if (registerrespone.status) {
        router.push("/home");
      } else {
        toast.error(registerrespone.message);
      }
    } else {
      let errorMessage = "";
      if (result.issues[0].input) {
        errorMessage = result.issues[0].message;
      } else {
        errorMessage = result.issues[0].path![0].key + " is required";
      }
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="grid place-items-center min-h-screen">
        <Card className="w-72">
          <CardHeader>
            <CardTitle className="text-center">Register</CardTitle>
            <CardDescription className="text-center">
              Register to start your sesstion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <label htmlFor="username">Username</label>
            <Input
              placeholder="username"
              id="password"
              name="password"
              ref={username}
            />
            <div className="h-4"></div>
            <label htmlFor="password">Password</label>
            <Input
              placeholder="password"
              id="password"
              name="password"
              ref={password}
            />
            <div className="h-4"></div>
            <label htmlFor="repassword">Re-Password</label>
            <Input
              placeholder="repassword"
              id="repassword"
              name="repassword"
              ref={repassword}
            />
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={"default"}
              type="submit"
              onClick={onSubmit}
            >
              Register
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
