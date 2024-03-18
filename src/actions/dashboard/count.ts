"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";

interface DashBoardCountPayload {}

const DashBoardCount = async (
  payload: DashBoardCountPayload
): Promise<ApiResponseType<{ [key: string]: number } | null>> => {
  try {
    const villagecout = await prisma.village.count();
    const typecout = await prisma.file_type.count();
    const filecout = await prisma.file.count();
    const pagecount = 537256;

    const response = {
      village: villagecout,
      type: typecout,
      file: filecout,
      page: pagecount,
    };

    return {
      status: true,
      data: response,
      message: "File data get successfully",
      functionname: "DashBoardCount",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "DashBoardCount",
    };
    return response;
  }
};

export default DashBoardCount;
