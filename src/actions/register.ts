"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { user } from "@prisma/client";
import { hash } from "bcrypt";
import { cookies } from "next/headers";

interface RegisterPayload {
  username: string;
  password: string;
}
const register = async (
  payload: RegisterPayload
): Promise<ApiResponseType<user | null>> => {
  try {
    const user = await prisma.user.findFirst({
      where: { username: payload.username, status: "ACTIVE" },
    });

    if (user)
      return {
        status: false,
        data: null,
        message: "Username already exists. Please try another username.",
        functionname: "register",
      };

    const newpassword = await hash(payload.password, 10);
    const newUser = await prisma.user.create({
      data: {
        username: payload.username,
        password: newpassword,
        role: "USER",
      },
    });

    if (!newUser)
      return {
        status: false,
        data: null,
        message: "User not created",
        functionname: "register",
      };
    cookies().set("id", newUser.id.toString());
    cookies().set("role", newUser.role.toString());
    return {
      status: true,
      data: newUser,
      message: "User register successfully",
      functionname: "register",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "register",
    };
    return response;
  }
};

export default register;
