"use server";
interface updateFilePayload {
  id: number;
  userId?: number;
  file_no?: string;
  applicant_name?: string;
  survey_number?: string;
  villageId?: number;
  remarks?: string;
  user_id?: number;
  year?: number;
  aadhar?: string;
  typeId?: number;
  names?: string[];
  surveyNumbers?: string[];
  referenceNumbers?: string[];
  dates?: string[];
}

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { file } from "@prisma/client";
import { revalidatePath } from "next/cache";

const updateFile = async (
  payload: updateFilePayload
): Promise<ApiResponseType<file | null>> => {
  try {
    const isexist = await prisma.file.findFirst({
      where: { id: parseInt(payload.id.toString()) },
    });

    if (!isexist) {
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "updateFile",
      };
    }

    if (payload.names) {
      for (let i = 0; i < payload.names.length; i++) {
        const isexit = await prisma.file_name.findFirst({
          where: {
            name: payload.names[i],
            fileId: isexist.id,
          },
        });

        if (isexit) {
          return {
            status: false,
            data: null,
            message: `${payload.names[i]} already exist in name section.`,
            functionname: "updateFile",
          };
        }
      }
    }

    if (payload.surveyNumbers) {
      for (let i = 0; i < payload.surveyNumbers.length; i++) {
        const isexit = await prisma.file_survey.findFirst({
          where: {
            fileId: isexist.id,
            survey_number: payload.surveyNumbers[i],
          },
        });

        if (isexit) {
          return {
            status: false,
            data: null,
            message: `${payload.surveyNumbers[i]} already exist in Survey Number section.`,
            functionname: "updateFile",
          };
        }
      }
    }

    if (payload.referenceNumbers) {
      for (let i = 0; i < payload.referenceNumbers.length; i++) {
        const isexit = await prisma.file_ref.findFirst({
          where: {
            fileId: isexist.id,
            file_ref: payload.referenceNumbers[i],
          },
        });

        if (isexit) {
          return {
            status: false,
            data: null,
            message: `${payload.referenceNumbers[i]} already exist in Reference Number section.`,
            functionname: "updateFile",
          };
        }
      }
    }

    if (payload.dates) {
      for (let i = 0; i < payload.dates.length; i++) {
        const isexit = await prisma.file_dates.findFirst({
          where: {
            fileId: isexist.id,
            dates: payload.dates[i],
          },
        });

        if (isexit) {
          return {
            status: false,
            data: null,
            message: `${payload.dates[i]} already exist in date section.`,
            functionname: "updateFile",
          };
        }
      }
    }

    const data_to_update: any = {};

    if (payload.file_no) data_to_update.file_no = payload.file_no;
    if (payload.applicant_name)
      data_to_update.applicant_name = payload.applicant_name;
    if (payload.survey_number)
      data_to_update.survey_number = payload.survey_number;
    if (payload.year) data_to_update.year = payload.year;
    if (payload.typeId) data_to_update.typeId = payload.typeId;
    if (payload.villageId) data_to_update.villageId = payload.villageId;
    if (payload.userId) data_to_update.userId = payload.userId;
    if (payload.aadhar) data_to_update.aadhar = payload.aadhar;
    if (payload.remarks) data_to_update.remarks = payload.remarks;

    const file: file = await prisma.file.update({
      where: {
        id: isexist.id,
      },
      data: data_to_update,
    });

    if (!file)
      return {
        status: false,
        data: null,
        message: "Something want wrong unable to add file.",
        functionname: "updateFile",
      };

    if (payload.names) {
      for (let i = 0; i < payload.names.length; i++) {
        const isexit = await prisma.file_name.findFirst({
          where: {
            name: payload.names[i],
            fileId: file.id,
          },
        });

        if (isexit) {
          return {
            status: false,
            data: null,
            message: `${payload.names[i]} already exist in name section.`,
            functionname: "updateFile",
          };
        }

        const addresponse = await prisma.file_name.create({
          data: {
            fileId: file.id,
            name: payload.names[i],
          },
        });

        if (!addresponse) {
          return {
            status: false,
            data: null,
            message: `Unable to add ${payload.names[i]} name.Try again!`,
            functionname: "updateFile",
          };
        }
      }
    }

    if (payload.surveyNumbers) {
      for (let i = 0; i < payload.surveyNumbers.length; i++) {
        const isexit = await prisma.file_survey.findFirst({
          where: {
            fileId: file.id,
            survey_number: payload.surveyNumbers[i],
          },
        });

        if (isexit) {
          return {
            status: false,
            data: null,
            message: `${payload.surveyNumbers[i]} already exist in Survey Number section.`,
            functionname: "updateFile",
          };
        }

        const addresponse = await prisma.file_survey.create({
          data: {
            fileId: file.id,
            survey_number: payload.surveyNumbers[i],
            villageId: payload.villageId!,
          },
        });

        if (!addresponse) {
          return {
            status: false,
            data: null,
            message: `Unable to add ${payload.surveyNumbers[i]} Survey Number.Try again!`,
            functionname: "updateFile",
          };
        }
      }
    }

    if (payload.referenceNumbers) {
      for (let i = 0; i < payload.referenceNumbers.length; i++) {
        const isexit = await prisma.file_ref.findFirst({
          where: {
            fileId: file.id,
            file_ref: payload.referenceNumbers[i],
          },
        });

        if (isexit) {
          return {
            status: false,
            data: null,
            message: `${payload.referenceNumbers[i]} already exist in Reference Number section.`,
            functionname: "updateFile",
          };
        }

        const addresponse = await prisma.file_ref.create({
          data: {
            fileId: file.id,
            file_ref: payload.referenceNumbers[i],
          },
        });

        if (!addresponse) {
          return {
            status: false,
            data: null,
            message: `Unable to add ${payload.referenceNumbers[i]} Reference Number.Try again!`,
            functionname: "updateFile",
          };
        }
      }
    }

    if (payload.dates) {
      for (let i = 0; i < payload.dates.length; i++) {
        const isexit = await prisma.file_dates.findFirst({
          where: {
            fileId: file.id,
            dates: payload.dates[i],
          },
        });

        if (isexit) {
          return {
            status: false,
            data: null,
            message: `${payload.dates[i]} already exist in date section.`,
            functionname: "updateFile",
          };
        }

        const addresponse = await prisma.file_dates.create({
          data: {
            fileId: file.id,
            dates: payload.dates[i],
          },
        });

        if (!addresponse) {
          return {
            status: false,
            data: null,
            message: `Unable to add ${payload.dates[i]} date.Try again!`,
            functionname: "updateFile",
          };
        }
      }
    }

    revalidatePath("/home");

    return {
      status: true,
      data: file,
      message: "File data get successfully",
      functionname: "updateFile",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "updateFile",
    };
    return response;
  }
};

export default updateFile;
