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
  namecount: number;
  refcount: number;
  surveycount: number;
}

const getTime = (date: Date): Date => {
  // Get the time zone offset in minutes
  const timezoneOffset = date.getTimezoneOffset();

  // Adjust the time to align with the local time zone
  const adjustedDate = new Date(date.getTime() - timezoneOffset * 60 * 1000);

  return new Date(adjustedDate.toISOString().split("T")[0] + "T00:00:00.000Z");
  // "2024-08-14T00:00:00.000Z"
};

const DateCounter = async (
  payload: DateCounterPayload
): Promise<ApiResponseType<any>> => {
  try {
    const todayDate = getTime(new Date(payload.date));

    const fileresponse = await prisma.file.findMany({
      where: {
        updatedAt: {
          gte: todayDate.toISOString(),
          lte: new Date(
            todayDate.setDate(todayDate.getDate() + 1)
          ).toISOString(),
        },
      },
      include: {
        file_name: {
          where: {
            createdAt: {
              gte: todayDate.toISOString(),
              lte: new Date(
                todayDate.setDate(todayDate.getDate() + 1)
              ).toISOString(),
            },
          },
        },
        file_ref: {
          where: {
            createdAt: {
              gte: todayDate.toISOString(),
              lte: new Date(
                todayDate.setDate(todayDate.getDate() + 1)
              ).toISOString(),
            },
          },
        },
        file_survey: {
          where: {
            createdAt: {
              gte: todayDate.toISOString(),
              lte: new Date(
                todayDate.setDate(todayDate.getDate() + 1)
              ).toISOString(),
            },
          },
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
        deletedAt: null,
        status: "ACTIVE",
        role: "ADMIN",
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
        (val: file) => val.qc == userresponse[i].id
      );

      let data: ResponseData = {
        id: userresponse[i].id,
        name: userresponse[i].username,
        role: userresponse[i].role,
        filecount: 0,
        pagecount: 0,
        namecount: 0,
        refcount: 0,
        surveycount: 0,
      };
      for (let j = 0; j < userentryfile.length; j++) {
        data.filecount += 1;
        data.pagecount += userentryfile[j].page_number!;
        data.namecount += userentryfile[j].file_name.length;
        data.refcount += userentryfile[j].file_ref.length;
        data.surveycount += userentryfile[j].file_survey.length;
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
