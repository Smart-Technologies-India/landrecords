"use server";
interface LoginPayload {
  username: string;
  password: string;
}

import { errorToString } from "@/utils/methods";
import prisma from "../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { user } from "@prisma/client";
import { compare } from "bcrypt";
import { cookies } from "next/headers";

const login = async (
  payload: LoginPayload
): Promise<ApiResponseType<user | null>> => {
  try {
    const user = await prisma.user.findFirst({
      where: { username: payload.username, status: "ACTIVE" },
    });

    if (!user)
      return {
        status: false,
        data: null,
        message: "Invalid Credentials. Please try again.",
        functionname: "login",
      };

    const password = compare(payload.password, user.password!);

    if (!password)
      return {
        status: false,
        data: null,
        message: "Invalid Credentials. Please try again.",
        functionname: "login",
      };
    cookies().set("id", user.id.toString());
    cookies().set("role", user.role.toString());
    return {
      status: true,
      data: user,
      message: "User data get successfully",
      functionname: "login",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "login",
    };
    return response;
  }
};

export default login;
