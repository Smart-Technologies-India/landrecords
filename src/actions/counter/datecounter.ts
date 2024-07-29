"use server";

import { ApiResponseType } from "@/models/response";
import { errorToString, formateDate } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { file, Role } from "@prisma/client";

interface DateCounterPayload {
  date: string;
}

interface ResponseData {
  id: number;
  name: string;
  role: string;
  filecount: number;
  pagecount: number;
}

const DateCounter = async (
  payload: DateCounterPayload
): Promise<ApiResponseType<any>> => {
  try {
    const fileresponse = await prisma.file.findMany({
      where: {
        updatedAt: {
          gte: new Date(payload.date), // Start of the day
          lt: new Date(
            new Date(payload.date).setDate(new Date(payload.date).getDate() + 1)
          ), // Start of the next day
        },
      },
    });

    if (!fileresponse) {
      return {
        status: false,
        data: null,
        message: "Unable to get files. Please try again.",
        functionname: "DateCounter",
      };
    }

    const userresponse = await prisma.user.findMany({
      where: {
        status: "ACTIVE",
        role: "ADMIN",
        deletedAt: null,
      },
    });
    if (!userresponse) {
      return {
        status: false,
        data: null,
        message: "Unable to get users. Please try again.",
        functionname: "Counter",
      };
    }

    let responsedata: ResponseData[] = [];

    for (let i = 0; i < userresponse.length; i++) {
      const userentryfile = fileresponse.filter(
        (val: file) => val.userId == userresponse[i].id
      );

      let data: ResponseData = {
        id: userresponse[i].id,
        name: userresponse[i].username,
        role: userresponse[i].role,
        filecount: 0,
        pagecount: 0,
      };
      for (let j = 0; j < userentryfile.length; j++) {
        data.filecount += 1;
        data.pagecount += userentryfile[j].page_number!;
      }

      responsedata.push(data);
    }

    return {
      status: true,
      data: responsedata,
      message: "All count get.",
      functionname: "DateCounter",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "DateCounter",
    };
    return response;
  }
};

export default DateCounter;
