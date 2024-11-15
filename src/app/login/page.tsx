"use client";
import login from "@/actions/login";
import { Fa6RegularEye, Fa6RegularEyeSlash } from "@/components/icons";
import { Button } from "@/components/ui/button";

import { ApiResponseType } from "@/models/response";
import { LoginSchema } from "@/schemas/login";
import { user } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

export default function Home() {
  const router = useRouter();
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [isShow, setShow] = useState<boolean>(false);

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
        if (registerrespone.data?.role === "ADMIN") {
          router.push("/search");
        } else if (registerrespone.data?.role === "FEEDER") {
          router.push("/feeder");
        } else if (registerrespone.data?.role === "SYSTEM") {
          router.push("/system");
        } else if (registerrespone.data?.role === "USER") {
          router.push("/home");
        } else if (
          registerrespone.data?.role === "DEPARTMENT" ||
          registerrespone.data?.role === "LDC" ||
          registerrespone.data?.role === "SUPTD"
        ) {
          router.push("/dashboard");
        } else {
          router.push("/home");
        }
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
      <div className="p-10 rounded-md min-h-screen w-full bg-[#f5f6f8] grid grid-cols-5 bg-gradient-to-tr from-[#2350f0] to-blue-400 relative">
        <div className="col-span-3 relative bg-gradient-to-tr from-[#2350f0] to-blue-400  grid place-items-center  rounded-l-md shadow-2xl">
          <div></div>
          <div>
            <p className="text-white text-3xl text-center leading-relaxed font-bold">
              Land Reforms DNH
            </p>
            <p className="text-white text-sm text-center font-medium">
              Preserving the Past, Securing the Future
            </p>
          </div>
          <div className="w-[28rem] h-64 relative">
            <Image
              fill={true}
              src="/login.png"
              alt="error"
              className=" object-cover object-center rounded-sm"
            />
          </div>
          <div></div>
        </div>

        <div className="col-span-2 grid place-items-center bg-white  rounded-r-md relative">
          <div className="bg-[#5ca0f9] absolute left-0 top-10 rounded-r-md">
            <p className="text-white px-4 py-2 text-2xl">Welcome Back</p>
          </div>
          <div>
            <p className="text-center text-2xl font-semibold text-blue-500">
              Login to your Account
            </p>
            <div className="h-4"></div>
            <label htmlFor="username" className="text-gray-500 text-sm">
              Username
            </label>
            <div></div>
            <input
              placeholder="username"
              id="password"
              name="password"
              className="w-60 border border-gray-400 rounded-sm py-1 px-2 mt-1 placeholder:text-sm"
              ref={username}
            />
            <div className="h-2"></div>
            <label htmlFor="username" className="text-gray-500 text-sm">
              Password
            </label>
            <div></div>
            <div className="flex items-center w-60 border border-gray-400 rounded-sm pr-2">
              <input
                type={isShow ? "text" : "password"}
                placeholder="password"
                id="password"
                name="password"
                className=" py-1 px-2 placeholder:text-sm rounded-sm w-full"
                ref={password}
              />
              {isShow ? (
                <Fa6RegularEyeSlash onClick={() => setShow(false)} />
              ) : (
                <Fa6RegularEye onClick={() => setShow(true)} />
              )}
            </div>

            <div className="h-4"></div>
            <div className="w-60">
              <Button
                className="w-full bg-blue-500 text-white hover:bg-blue-600 h-9"
                variant={"default"}
                type="submit"
                onClick={onSubmit}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
