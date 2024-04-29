"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { physical_file_location } from "@prisma/client";

interface GetCupboardNumberPayload {}

const GetCupboardNumber = async (
  payload: GetCupboardNumberPayload
): Promise<ApiResponseType<physical_file_location[] | null>> => {
  try {
    const file_location = await prisma.physical_file_location.findMany({
      where: {
        status: "ACTIVE",
      },
    });

    let uniqueCupboardNumber: physical_file_location[] = [];
    file_location.forEach((location: physical_file_location) => {
      const cupboard_number = uniqueCupboardNumber.map(
        (location: physical_file_location) => location.cupboard_numer
      );
      if (!cupboard_number.includes(location.cupboard_numer!)) {
        uniqueCupboardNumber.push(location);
      }
    });




    if (!file_location)
      return {
        status: false,
        data: null,
        message: "No file location found. Please try again.",
        functionname: "GetCupboardNumber",
      };

    return {
      status: true,
      data: uniqueCupboardNumber,
      message: "File location data get successfully",
      functionname: "GetCupboardNumber",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetCupboardNumber",
    };
    return response;
  }
};

export default GetCupboardNumber;
