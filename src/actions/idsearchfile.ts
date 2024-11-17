"use server";
interface SearchFilePayload {
  file_id?: string;
}

import { errorToString } from "@/utils/methods";
import prisma from "../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { file } from "@prisma/client";

const IdFileSearch = async (
  payload: SearchFilePayload
): Promise<ApiResponseType<file[] | null>> => {
  try {
    let files: any[] = [];

    const fileresponse = await prisma.file.findMany({
      where: {
        deletedAt: null,
        file_id: payload.file_id,
      },
      include: {
        type: true,
        village: true,
        file_dates: true,
        file_name: true,
        file_ref: true,
        file_survey: true,
        physical_file_location: true,
      },
    });

    if (!fileresponse) {
      return {
        status: false,
        data: null,
        message: "Unable to get files",
        functionname: "IdFileSearch",
      };
    }

    return {
      status: true,
      data: fileresponse,
      message: "File data get successfully",
      functionname: "IdFileSearch",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "IdFileSearch",
    };
    return response;
  }
};

export default IdFileSearch;
