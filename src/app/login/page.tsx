"use client";
import login from "@/actions/login";
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
import { LoginSchema } from "@/schemas/login";
import { user } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

export default function Home() {
  const router = useRouter();
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const onSubmit = async () => {
    const result = safeParse(LoginSchema, {
      username: username.current?.value,
      password: password.current?.value,
    });

    if (result.success) {
      const registerrespone: ApiResponseType<user | null> = await login({
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
            <CardTitle className="text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Login to start your sesstion
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
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={"default"}
              type="submit"
              onClick={onSubmit}
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
