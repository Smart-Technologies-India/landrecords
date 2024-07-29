"use server";

import { ApiResponseType } from "@/models/response";
import { errorToString, formateDate } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { subDays, startOfDay, endOfDay } from "date-fns";
import { file, Role } from "@prisma/client";

interface CounterPayload {}

interface DataResponse {
  date: string;
  filecount: number;
  pagecount: number;
}

interface ResponseData {
  id: number;
  name: string;
  role: string;
  data: DataResponse[];
}

const Counter = async (
  payload: CounterPayload
): Promise<ApiResponseType<any>> => {
  try {
    const enddate = new Date();
    const startDate = subDays(enddate, 7);

    // scanner end date
    // meta and qc updated at
    // entry created at
    // verify verifyed at

    const fileresponse = await prisma.file.findMany({
      where: {
        deletedAt: null,
        updatedAt: {
          gte: startOfDay(startDate),
          lte: endOfDay(enddate),
        },
      },
    });

    if (!fileresponse) {
      return {
        status: false,
        data: null,
        message: "Unable to get files. Please try again.",
        functionname: "Counter",
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

      let dataadd: DataResponse[] = [];

      for (let j = 0; j < userentryfile.length; j++) {
        //   const date = userentryfile[j].createdAt.toString().split("T")[0];
        const date = formateDate(
          new Date(userentryfile[j].updatedAt ?? new Date().toISOString())
        );

        const existingEntry = dataadd.find((entry) => entry.date === date);
        if (existingEntry) {
          existingEntry.filecount += 1;
          existingEntry.pagecount += userentryfile[j].page_number ?? 0;
        } else {
          const data: DataResponse = {
            filecount: 1,
            pagecount: userentryfile[j].page_number ?? 0,
            date: date,
          };
          dataadd.push(data);
        }
      }

      const data: ResponseData = {
        id: userresponse[i].id,
        name: userresponse[i].username,
        role: userresponse[i].role,
        data: dataadd,
      };
      responsedata.push(data);
    }

    return {
      status: true,
      data: responsedata,
      message: "All count get.",
      functionname: "Counter",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "Counter",
    };
    return response;
  }
};

export default Counter;
