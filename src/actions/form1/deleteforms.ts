"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";

interface DeleteFrom1Payload {
  id: number;
}

const DeleteFrom1Family = async (
  payload: DeleteFrom1Payload
): Promise<ApiResponseType<boolean | null>> => {
  try {
    const form1_family = await prisma.form1_family.delete({
      where: {
        deletedAt: null,
        id: payload.id,
      },
    });

    if (!form1_family)
      return {
        status: false,
        data: null,
        message: "Something want wrong. Please try again.",
        functionname: "DeleteFrom1Family",
      };

    return {
      status: true,
      data: true,
      message: "From-1 family deleted successfully",
      functionname: "DeleteFrom1Family",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "DeleteFrom1Family",
    };
    return response;
  }
};

const DeleteFrom1Land = async (
  payload: DeleteFrom1Payload
): Promise<ApiResponseType<boolean | null>> => {
  try {
    const form1_land = await prisma.form1_land.delete({
      where: {
        deletedAt: null,
        id: payload.id,
      },
    });

    if (!form1_land)
      return {
        status: false,
        data: null,
        message: "Something want wrong. Please try again.",
        functionname: "DeleteFrom1Land",
      };

    return {
      status: true,
      data: true,
      message: "From-1 land deleted successfully",
      functionname: "DeleteFrom1Land",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "DeleteFrom1Land",
    };
    return response;
  }
};

const DeleteFrom1Acquisition = async (
  payload: DeleteFrom1Payload
): Promise<ApiResponseType<boolean | null>> => {
  try {
    const form1_family = await prisma.form1_acquisition.delete({
      where: {
        deletedAt: null,
        id: payload.id,
      },
    });

    if (!form1_family)
      return {
        status: false,
        data: null,
        message: "Something want wrong. Please try again.",
        functionname: "DeleteFrom1Acquisition",
      };

    return {
      status: true,
      data: true,
      message: "From-1 acquisition deleted successfully",
      functionname: "DeleteFrom1Acquisition",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "DeleteFrom1Acquisition",
    };
    return response;
  }
};

export { DeleteFrom1Family, DeleteFrom1Land, DeleteFrom1Acquisition };
