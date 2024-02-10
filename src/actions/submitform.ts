"use server";
interface FormPayload {
  user_id: number;
  file_id: string;
  name: string;
  survey_number: string;
  year: number;
  aadhar: string;
  remarks: string;
  typeId: number;
  villageId: number;
  names: string[];
  surveyNumbers: string[];
  referenceNumbers: string[];
  dates: string[];
}

import { errorToString } from "@/utils/methods";
import prisma from "../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { file } from "@prisma/client";
import { revalidatePath } from "next/cache";

const fileSubmit = async (
  payload: FormPayload
): Promise<ApiResponseType<file | null>> => {
  try {
    const file: file = await prisma.file.create({
      data: {
        file_id: payload.file_id,
        name: payload.name,
        survey_number: payload.survey_number,
        year: payload.year,
        aadhar: payload.aadhar,
        remarks: payload.remarks,
        typeId: payload.typeId,
        villageId: payload.villageId,
        userId: payload.user_id,
      },
    });

    if (!file)
      return {
        status: false,
        data: null,
        message: "Something want wrong unable to add file.",
        functionname: "fileSubmit",
      };

    await prisma.file_name.createMany({
      data: payload.names.map((name) => ({
        fileId: file.id,
        name,
      })),
    });
    await prisma.file_survey.createMany({
      data: payload.surveyNumbers.map((surveyNumber) => ({
        fileId: file.id,
        survey_number: surveyNumber,
        villageId: payload.villageId,
      })),
    });

    await prisma.file_ref.createMany({
      data: payload.referenceNumbers.map((referenceNumber, index) => ({
        fileId: file.id,
        file_ref: referenceNumber,
      })),
    });

    await prisma.file_dates.createMany({
      data: payload.dates.map((date) => ({
        fileId: file.id,
        dates: date,
      })),
    });


    return {
      status: true,
      data: file,
      message: "File data get successfully",
      functionname: "fileSubmit",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "fileSubmit",
    };
    return response;
  }
};

export default fileSubmit;
