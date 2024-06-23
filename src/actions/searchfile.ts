"use server";
interface SearchFilePayload {
  file_no?: string;
  file_id?: string;
  applicant_name?: string;
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
    let files: file[] = [];

    const searchfile = await prisma.file.findMany({
      where: {
        ...(payload.file_no && { file_no: payload.file_no }),
        ...(payload.file_id && { file_id: payload.file_id }),
        ...(payload.applicant_name && {
          applicant_name: { contains: payload.applicant_name },
        }),
        ...(payload.survey_number && { survey_number: payload.survey_number }),
        ...(payload.year && { year: parseInt(payload.year) }),
        ...(payload.aadhar && { aadhar: payload.aadhar }),
        ...(payload.remarks && { remarks: { contains: payload.remarks } }),
        ...(payload.typeId && {
          typeId: parseInt(payload.typeId.toString() ?? "0"),
        }),
        ...(payload.villageId && {
          villageId: parseInt(payload.villageId.toString() ?? "0"),
        }),
        ...(payload.file_ref && {
          remarks: { contains: payload.file_ref },
        }),
        deletedAt: null,
      },
      include: {
        type: true,
        village: true,
      },
    });

    if (searchfile) {
      files = [...searchfile];
    }

    // search date
    if (payload.dates) {
      const dates = await prisma.file_dates.findMany({
        where: {
          deletedAt: null,
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

      const newfiles = dates.map((d) => d.file);

      let data_to_search: any = {};
      if (payload.file_no) data_to_search.file_no = payload.file_no;
      if (payload.file_id) data_to_search.file_id = payload.file_id;
      if (payload.applicant_name)
        data_to_search.applicant_name = payload.applicant_name;
      if (payload.survey_number)
        data_to_search.survey_number = payload.survey_number;
      if (payload.year) data_to_search.year = payload.year;
      if (payload.aadhar) data_to_search.aadhar = payload.aadhar;
      if (payload.remarks) data_to_search.remarks = payload.remarks;
      if (payload.typeId) data_to_search.typeId = payload.typeId;
      if (payload.villageId) data_to_search.villageId = payload.villageId;

      const matchfiles = newfiles.filter((f: any) => {
        let match = false;
        for (const key in data_to_search) {
          if (
            f[key]
              .toString()
              .toLowerCase()
              .includes(data_to_search[key].toString().toLowerCase())
          ) {
            match = true;
          } else {
            match = false;
            break;
          }
          return match;
        }
      });

      if (Object.keys(data_to_search).length > 0) {
        files = matchfiles;
      } else {
        files = [...files, ...newfiles];
      }
    }

    // search name

    if (payload.applicant_name) {
      const name = await prisma.file_name.findMany({
        where: {
          deletedAt: null,
          name: {
            contains: payload.applicant_name,
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

      const newfiles = name.map((n) => n.file);

      let data_to_search: any = {};
      if (payload.file_no) data_to_search.file_no = payload.file_no;
      if (payload.file_id) data_to_search.file_id = payload.file_id;
      if (payload.applicant_name)
        data_to_search.applicant_name = payload.applicant_name;

      if (payload.survey_number)
        data_to_search.survey_number = payload.survey_number;
      if (payload.year) data_to_search.year = payload.year;
      if (payload.aadhar) data_to_search.aadhar = payload.aadhar;
      if (payload.remarks) data_to_search.remarks = payload.remarks;
      if (payload.typeId) data_to_search.typeId = payload.typeId;
      if (payload.villageId) data_to_search.villageId = payload.villageId;

      const matchfiles = newfiles.filter((f: any) => {
        let match = false;
        for (const key in data_to_search) {
          if (
            f[key]
              .toString()
              .toLowerCase()
              .includes(data_to_search[key].toString().toLowerCase())
          ) {
            match = true;
          } else {
            match = false;
            break;
          }
        }
        return match;
      });
      if (Object.keys(data_to_search).length > 0) {
        files = matchfiles;
      } else {
        files = [...files, ...newfiles];
      }
    }

    // search survey number
    if (payload.survey_number) {
      const surveyfiles = await prisma.file_survey.findMany({
        where: {
          deletedAt: null,
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

      const newfiles = surveyfiles.map((s) => s.file);

      let data_to_search: any = {};
      if (payload.file_no) data_to_search.file_no = payload.file_no;
      if (payload.file_id) data_to_search.file_id = payload.file_id;
      if (payload.applicant_name)
        data_to_search.applicant_name = payload.applicant_name;
      if (payload.survey_number)
        data_to_search.survey_number = payload.survey_number;
      if (payload.year) data_to_search.year = payload.year;
      if (payload.aadhar) data_to_search.aadhar = payload.aadhar;
      if (payload.remarks) data_to_search.remarks = payload.remarks;
      if (payload.typeId) data_to_search.typeId = payload.typeId;
      if (payload.villageId) data_to_search.villageId = payload.villageId;

      const matchfiles = newfiles.filter((f: any) => {
        let match = false;
        for (const key in data_to_search) {
          if (
            f[key]
              .toString()
              .toLowerCase()
              .includes(data_to_search[key].toString().toLowerCase())
          ) {
            match = true;
          } else {
            match = false;
            break;
          }
        }
        return match;
      });

      if (Object.keys(data_to_search).length > 0) {
        // files = [...files, ...matchfiles];
        files = matchfiles;
      } else {
        files = [...files, ...newfiles];
      }
    }

    // search file ref
    if (payload.file_ref) {
      const file_ref = await prisma.file_ref.findMany({
        where: {
          deletedAt: null,
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

      const newfiles = file_ref.map((f) => f.file);

      let data_to_search: any = {};
      if (payload.file_no) data_to_search.file_no = payload.file_no;
      if (payload.file_id) data_to_search.file_id = payload.file_id;
      if (payload.applicant_name)
        data_to_search.applicant_name = payload.applicant_name;
      if (payload.survey_number)
        data_to_search.survey_number = payload.survey_number;
      if (payload.year) data_to_search.year = payload.year;
      if (payload.aadhar) data_to_search.aadhar = payload.aadhar;
      if (payload.remarks) data_to_search.remarks = payload.remarks;
      if (payload.typeId) data_to_search.typeId = payload.typeId;
      if (payload.villageId) data_to_search.villageId = payload.villageId;

      const matchfiles = newfiles.filter((f: any) => {
        let match = false;
        for (const key in data_to_search) {
          if (
            f[key]
              .toString()
              .toLowerCase()
              .includes(data_to_search[key].toString().toLowerCase())
          ) {
            match = true;
          } else {
            match = false;
            break;
          }
        }
        return match;
      });

      if (Object.keys(data_to_search).length > 0) {
        files = matchfiles;
      } else {
        files = [...files, ...newfiles];
      }
    }

    files = files.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);

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
