"use server";
interface GetForm1Payload {
  id: number;
}

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import {
  form1,
  form1_acquisition,
  form1_family,
  form1_land,
} from "@prisma/client";

const getFrom1 = async (
  payload: GetForm1Payload
): Promise<
  ApiResponseType<
    | (form1 & {
        form1_acquisition: form1_acquisition[];
        form1_family: form1_family[];
        form1_land: form1_land[];
      })
    | null
  > 
> => {
  try {
    const form1 = await prisma.form1.findFirst({
      where: {
        deletedAt: null,
        id: payload.id,
      },
      include: {
        form1_acquisition: true,
        form1_family: true,
        form1_land: true,
      },
    });

    if (!form1)
      return {
        status: false,
        data: null,
        message: "Something want wrong. Please try again.",
        functionname: "getFrom1",
      };

    return {
      status: true,
      data: form1,
      message: "From-1 data get successfully",
      functionname: "getFrom1",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "getFrom1",
    };
    return response;
  }
};

export default getFrom1;
