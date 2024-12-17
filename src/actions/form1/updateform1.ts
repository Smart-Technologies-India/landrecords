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

interface UpdateForm1Payload {
  id: number;
  holder_name: string;
  residence_place: string;
  celiling_applicable: string;
  action?: string;
  remark?: string;
  form1_family: Form1FamilyType[];
  form1_land: Form1LandType[];
  form1_acquisition: Form1AcquisitionType[];
  inward_number: string;
  date_of_inward: string;
  url?: string;
  action_taken?: boolean;
}

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { form1 } from "@prisma/client";

const UpdateFrom1 = async (
  payload: UpdateForm1Payload
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
        inward_number: payload.inward_number,
        date_of_inward: payload.date_of_inward,
        holder_name: payload.holder_name,
        residence_place: payload.residence_place,
        celiling_applicable: payload.celiling_applicable,
        status: "ACTIVE",
        ...(payload.action && {
          action: payload.action,
        }),
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

    if (payload.form1_family.length > 0) {
      const form1_family = await prisma.form1_family.createMany({
        data: payload.form1_family.map((val: Form1FamilyType) => ({
          age: val.age,
          name: val.name,
          relationship: val.relationship,
          form1id: form1_response.id,
        })),
      });

      if (!form1_family) {
        return {
          status: false,
          data: null,
          message: "Something want wrong unable to create From-1 Family.",
          functionname: "UpdateFrom1",
        };
      }
    }

    if (payload.form1_land.length > 0) {
      const form1_land = await prisma.form1_land.createMany({
        data: payload.form1_land.map((val: Form1LandType) => ({
          form1id: form1_response.id,
          area: val.area,
          survey_no: val.survey_no,
          village: val.village,
          remark: val.remark,
        })),
      });

      if (!form1_land) {
        return {
          status: false,
          data: null,
          message: "Something want wrong unable to create From-1 Land.",
          functionname: "UpdateFrom1",
        };
      }
    }
    if (payload.form1_acquisition.length > 0) {
      const form1_acquisition = await prisma.form1_acquisition.createMany({
        data: payload.form1_acquisition.map((val: Form1AcquisitionType) => ({
          form1id: form1_response.id,
          area: val.area,
          survey_no: val.survey_no,
          village: val.village,
          date: val.date,
          type: val.type,
          remark: val.remark,
        })),
      });

      if (!form1_acquisition) {
        return {
          status: false,
          data: null,
          message: "Something want wrong unable to create From-1 Acquisition.",
          functionname: "UpdateFrom1",
        };
      }
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

export default UpdateFrom1;
