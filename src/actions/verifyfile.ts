"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { file } from "@prisma/client";

interface VerifyFilePayload {
  id: number;
}

const verifyFile = async (
  payload: VerifyFilePayload
): Promise<ApiResponseType<file | null>> => {
  try {
    const updatefile = await prisma.file.update({
      where: { id: parseInt(payload.id.toString()) },
      data: {
        verifiedAt: new Date(),
      },
    });

    if (!updatefile)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "verifyFile",
      };

    return {
      status: true,
      data: updatefile,
      message: "File verified successfully",
      functionname: "verifyFile",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "verifyFile",
    };
    return response;
  }
};

export default verifyFile;
