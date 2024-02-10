"use server";
interface SearchFilePayload {
  file_id?: string;
  name?: string;
  survey_number?: string;
  year?: string;
  aadhar?: string;
  remarks?: string;
  typeId?: number;
  villageId?: number;
  file_ref?: string;
  dates?: string;
}

import { errorToString } from "@/utils/methods";
import prisma from "../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { file } from "@prisma/client";

const fileSearch = async (
  payload: SearchFilePayload
): Promise<ApiResponseType<file[] | null>> => {
  try {
    let files: file[];

    let data_for_search: { [key: string]: unknown } = {};
    if (payload.file_id) {
      data_for_search.file_id = payload.file_id;
    }
    if (payload.name) {
      data_for_search.name = payload.name;
    }
    if (payload.survey_number) {
      data_for_search.survey_number = payload.survey_number;
    }
    if (payload.year) {
      data_for_search.year = parseInt(payload.year);
    }
    if (payload.aadhar) {
      data_for_search.aadhar = payload.aadhar;
    }
    if (payload.remarks) {
      data_for_search.remarks = payload.remarks;
    }
    if (payload.typeId) {
      data_for_search.typeId = payload.typeId;
    }
    if (payload.villageId) {
      data_for_search.villageId = payload.villageId;
    }
    if (payload.file_ref) {
      data_for_search.file_ref = payload.file_ref;
    }
    if (payload.dates) {
      data_for_search.dates = payload.dates;
    }

    files = await prisma.file.findMany({
      where: {
        AND: data_for_search,
      },
      include: {
        village: true,
        type: true,
      },
    });

    if (!files)
      return {
        status: false,
        data: null,
        message: "No data found",
        functionname: "fileSearch",
      };

    if (payload.name) {
      const name = await prisma.file_name.findMany({
        where: {
          name: {
            contains: payload.name,
          },
        },
        include: {
          file: {
            include: {
              village: true,
              type: true,
            },
          },
        },
      });

      if (name) {
        files = name.map((n) => n.file);
      }
    }

    if (payload.survey_number) {
      const survey = await prisma.file_survey.findMany({
        where: {
          survey_number: {
            contains: payload.survey_number,
          },
        },
        include: {
          file: {
            include: {
              village: true,
              type: true,
            },
          },
        },
      });

      if (survey) {
        files = survey.map((s) => s.file);
      }
    }

    if (payload.file_ref) {
      const file_ref = await prisma.file_ref.findMany({
        where: {
          file_ref: {
            contains: payload.file_ref,
          },
        },
        include: {
          file: {
            include: {
              village: true,
              type: true,
            },
          },
        },
      });

      if (file_ref) {
        files = file_ref.map((f) => f.file);
      }
    }

    if (payload.dates) {
      const dates = await prisma.file_dates.findMany({
        where: {
          dates: {
            contains: payload.dates,
          },
        },
        include: {
          file: {
            include: {
              village: true,
              type: true,
            },
          },
        },
      });

      if (dates) {
        files = dates.map((d) => d.file);
      }
    }

    files = files.filter(
      (v, i, a) => a.findIndex((t) => t.file_id === v.file_id) === i
    );

    return {
      status: true,
      data: files,
      message: "File data get successfully",
      functionname: "fileSearch",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "fileSearch",
    };
    return response;
  }
};

export default fileSearch;
