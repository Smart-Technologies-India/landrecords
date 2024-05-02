"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";

interface GetAllFilesPagenetedPayload {
  skip: number;
  take: number;
}

const GetAllFilesPageneted = async (
  payload: GetAllFilesPagenetedPayload
): Promise<ApiResponseType<any | null>> => {
  try {
    const fileCount = await prisma.file.count();
    if (fileCount === 0) {
      return {
        status: false,
        data: null,
        message: "No files found",
        functionname: "GetAllFilesPageneted",
      };
    }
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
      skip: payload.skip,
      take: payload.take,
    });

    if (!file)
      return {
        status: false,
        data: null,
        message: "Invalid file id. Please try again.",
        functionname: "GetAllFilesPageneted",
      };

    //   add count in response
    const allfiles_with_count = {
      count: fileCount,
      files: file,
    };

    return {
      status: true,
      data: allfiles_with_count,
      message: "File data get successfully",
      functionname: "GetAllFilesPageneted",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetAllFilesPageneted",
    };
    return response;
  }
};

export default GetAllFilesPageneted;
