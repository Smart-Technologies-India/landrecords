"use server";
interface GetAllForm1Payload {}

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import {
  form1,
  form1_acquisition,
  form1_family,
  form1_land,
} from "@prisma/client";

const getAllFrom1 = async (
  payload: GetAllForm1Payload
): Promise<
  ApiResponseType<Array<
    form1 & {
      form1_acquisition: form1_acquisition[];
      form1_family: form1_family[];
      form1_land: form1_land[];
    }
  > | null>
> => {
  try {
    const form1 = await prisma.form1.findMany({
      where: {
        deletedAt: null,
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
        functionname: "getAllFrom1",
      };

    return {
      status: true,
      data: form1,
      message: "All From-1 type get successfully",
      functionname: "getAllFrom1",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "getAllFrom1",
    };
    return response;
  }
};

export default getAllFrom1;
