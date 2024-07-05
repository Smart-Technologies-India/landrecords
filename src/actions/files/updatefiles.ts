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
    if (payload.userId) data_to_update.remarks = payload.remarks;

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
      await prisma.file_name.createMany({
        data: payload.names.map((name) => ({
          fileId: file.id,
          name,
        })),
      });
    }
    if (payload.surveyNumbers) {
      await prisma.file_survey.createMany({
        data: payload.surveyNumbers.map((surveyNumber) => ({
          fileId: file.id,
          survey_number: surveyNumber,
          villageId: payload.villageId!,
        })),
      });
    }

    if (payload.referenceNumbers) {
      await prisma.file_ref.createMany({
        data: payload.referenceNumbers.map((referenceNumber, index) => ({
          fileId: file.id,
          file_ref: referenceNumber,
        })),
      });
    }

    if (payload.dates) {
      await prisma.file_dates.createMany({
        data: payload.dates.map((date) => ({
          fileId: file.id,
          dates: date,
        })),
      });
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
