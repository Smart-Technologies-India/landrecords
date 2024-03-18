"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { file } from "@prisma/client";

interface GetAllFilesPayload {}

const GetAllFiles = async (
  payload: GetAllFilesPayload
): Promise<ApiResponseType<file[] | null>> => {
  try {
    const file = await prisma.file.findMany({
      include: {
        user: true,
        village: true,
        type: true,
        file_name: true,
        file_survey: true,
        file_ref: true,
        file_dates: true,
      },
    });

    if (!file)
      return {
        status: false,
        data: null,
        message: "Invalid file id. Please try again.",
        functionname: "GetAllFiles",
      };

    return {
      status: true,
      data: file,
      message: "File data get successfully",
      functionname: "GetAllFiles",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetAllFiles",
    };
    return response;
  }
};

export default GetAllFiles;
