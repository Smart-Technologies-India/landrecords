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
    const pagecount = await prisma.file.findMany({
      where: {
        deletedAt: null,
      },
    });

    const totalPageCount: number = pagecount.reduce((total, file) => {
      return total + (file.page_number || 0); // Ensure `page_number` is numeric and handle null/undefined
    }, 0);

    const response = {
      village: villagecout,
      type: typecout,
      file: filecout,
      page: totalPageCount,
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
