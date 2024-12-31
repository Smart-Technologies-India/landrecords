"use server";

interface Form1FamilyType {
  name: string;
  age: number;
  relationship: string;
}

interface Form1LandType {
  village: string;
  survey_no: string;
  area: string;
  remark?: string;
}
interface Form1AcquisitionType {
  village: string;
  survey_no: string;
  area: string;
  type: string;
  date: Date;
  remark?: string;
}

interface UpdateForm1GenPayload {
  id: number;
  remark?: string;
  url?: string;
  action_taken?: boolean;
  action?: string;
}

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { form1 } from "@prisma/client";

const UpdateFrom1Gen = async (
  payload: UpdateForm1GenPayload
): Promise<ApiResponseType<boolean | null>> => {
  try {
    const isexist = await prisma.form1.findFirst({
      where: {
        id: payload.id,
        deletedAt: null,
      },
    });
    if (!isexist) {
      return {
        status: false,
        data: null,
        message: "Something want wrong. Form-1 Not exist.",
        functionname: "UpdateFrom1",
      };
    }
    const form1_response: form1 = await prisma.form1.update({
      where: {
        id: isexist.id,
      },
      data: {
        ...(payload.action && {
          action: payload.action,
        }),
        status: "ACTIVE",
        ...(payload.remark && {
          remark: payload.remark,
        }),
        ...(payload.url && {
          url: payload.url,
        }),
        ...(payload.action_taken && {
          action_taken: payload.action_taken,
        }),
      },
    });

    if (!form1_response) {
      return {
        status: false,
        data: null,
        message: "Something want wrong unable to create From-1.",
        functionname: "UpdateFrom1",
      };
    }

    return {
      status: true,
      data: true,
      message: "Form-1 data Uploaded successfully",
      functionname: "UpdateFrom1",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "UpdateFrom1",
    };
    return response;
  }
};

export default UpdateFrom1Gen;
