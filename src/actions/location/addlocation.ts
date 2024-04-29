"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { file } from "@prisma/client";

interface addLocationPayload {
  fileid: number;
  locationid: number;
  userid: number;
}

const addLocation = async (
  payload: addLocationPayload
): Promise<ApiResponseType<file | null>> => {
  try {
    const islocationexist = await prisma.physical_file_location.findFirst({
      where: {
        id: parseInt(payload.locationid.toString() ?? "0"),
      },
    });

    if (!islocationexist)
      return {
        status: false,
        data: null,
        message: "File location not found. Please try again.",
        functionname: "addLocation",
      };

    const isfileexist = await prisma.file.findFirst({
      where: {
        id: parseInt(payload.fileid.toString() ?? "0"),
      },
    });

    if (!isfileexist)
      return {
        status: false,
        data: null,
        message: "File not found. Please try again.",
        functionname: "addLocation",
      };

    const updateresponse = await prisma.file.update({
      where: {
        id: isfileexist.id,
      },
      data: {
        user: {
          connect: {
            id: payload.userid,
          },
        },
        physical_file_location: {
          connect: {
            id: islocationexist.id,
          },
        },
      },
    });

    if (!updateresponse)
      return {
        status: false,
        data: null,
        message: "File location not updated. Please try again.",
        functionname: "addLocation",
      };

    return {
      status: true,
      data: updateresponse,
      message: "File location updated successfully",
      functionname: "addLocation",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "addLocation",
    };
    return response;
  }
};

export default addLocation;
