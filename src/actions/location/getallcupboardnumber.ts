"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { physical_file_location } from "@prisma/client";

interface GetAllCupboardNumberPayload {}

const GetAllCupboardNumber = async (
  payload: GetAllCupboardNumberPayload
): Promise<ApiResponseType<physical_file_location[] | null>> => {
  try {
    const file_location = await prisma.physical_file_location.findMany({
      where: {
        status: "ACTIVE",
      },
    });



    if (!file_location)
      return {
        status: false,
        data: null,
        message: "No file location found. Please try again.",
        functionname: "GetAllCupboardNumber",
      };

    return {
      status: true,
      data: file_location,
      message: "File location data get successfully",
      functionname: "GetAllCupboardNumber",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetAllCupboardNumber",
    };
    return response;
  }
};

export default GetAllCupboardNumber;
