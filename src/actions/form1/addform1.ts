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

interface AddForm1Payload {
  inward_number: string;
  date_of_inward: string;
  holder_name: string;
  residence_place: string;
  celiling_applicable: string;
  action?: string;
  remark?: string;
  form1_family: Form1FamilyType[];
  form1_land: Form1LandType[];
  form1_acquisition: Form1AcquisitionType[];
  file?: string;
}

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { form1 } from "@prisma/client";

const AddFrom1 = async (
  payload: AddForm1Payload
): Promise<ApiResponseType<boolean | null>> => {
  try {
    const form1_response: form1 = await prisma.form1.create({
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
        ...(payload.file && {
          file: payload.file,
        }),
      },
    });

    if (!form1_response) {
      return {
        status: false,
        data: null,
        message: "Something want wrong unable to create From-1.",
        functionname: "fileSubmit",
      };
    }

    const generateSerialNumber = (id: string): string => {
      // Get the current date
      const now = new Date();

      // Format the date as ddmmdd
      const day = String(now.getDate()).padStart(2, "0"); // Two digits
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Two digits (months are 0-indexed)
      const year = String(now.getFullYear()).slice(-2); // Last two digits of the year

      // Format the ID as a 4-digit string
      const paddedId = String(id).padStart(4, "0");

      // Combine the date and ID
      return `${day}${month}${year}${paddedId}`;
    };

    const update_response = await prisma.form1.update({
      where: {
        id: form1_response.id,
      },
      data: {
        sr_number: generateSerialNumber(form1_response.id.toString()),
      },
    });

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
        functionname: "fileSubmit",
      };
    }

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
        functionname: "fileSubmit",
      };
    }

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
        functionname: "fileSubmit",
      };
    }

    return {
      status: true,
      data: true,
      message: "Form-1 data Uploaded successfully",
      functionname: "AddFrom1",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AddFrom1",
    };
    return response;
  }
};

export default AddFrom1;
