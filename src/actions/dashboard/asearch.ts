"use server";

enum SearchType {
  VILLAGE_USER,
  VILLAGE_SURVAY,
  FILETYPE_VILLAGE,
  FILETYPE_USER,
  FILETEYPE_YEAR,
  VILLAGE_YEAR,
}

interface ASearchFilePayload {
  searchtype: SearchType;
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
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { file } from "@prisma/client";

const ASearchFile = async (
  payload: ASearchFilePayload
): Promise<ApiResponseType<file[] | null>> => {
  try {
    let files: file[] = [];
    // year search
    if (payload.year) {
      const year = await prisma.file.findMany({
        where: {
          year: parseInt(payload.year),
        },
        include: {
          village: true,
          type: true,
        },
      });

      if (year) {
        files = [...files, ...year];
      }
    }

    // file number search
    if (payload.file_no) {
      const file_no = await prisma.file.findMany({
        where: {
          file_no: payload.file_no,
        },
        include: {
          village: true,
          type: true,
        },
      });

      if (file_no) {
        files = [...files, ...file_no];
      }
    }
    // file id search
    if (payload.file_id) {
      const file_id = await prisma.file.findMany({
        where: {
          file_id: payload.file_id,
        },
        include: {
          village: true,
          type: true,
        },
      });

      if (file_id) {
        files = [...files, ...file_id];
      }
    }

    // aadhar search
    if (payload.aadhar) {
      const aadhar = await prisma.file.findMany({
        where: {
          aadhar: payload.aadhar,
        },
        include: {
          village: true,
          type: true,
        },
      });

      if (aadhar) {
        files = [...files, ...aadhar];
      }
    }

    // remarks search
    if (payload.remarks) {
      const remarks = await prisma.file.findMany({
        where: {
          remarks: {
            contains: payload.remarks,
          },
        },
        include: {
          village: true,
          type: true,
        },
      });

      if (remarks) {
        files = [...files, ...remarks];
      }
    }

    // type search

    if (payload.typeId) {
      const type = await prisma.file.findMany({
        where: {
          typeId: parseInt(payload.typeId.toString() ?? "0"),
        },
        include: {
          village: true,
          type: true,
        },
      });

      if (type) {
        files = [...files, ...type];
      }
    }

    // village search
    if (payload.villageId) {
      const village = await prisma.file.findMany({
        where: {
          villageId: parseInt(payload.villageId.toString() ?? "0"),
        },
        include: {
          village: true,
          type: true,
        },
      });

      if (village) {
        files = [...files, ...village];
      }
    }

    // search date
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
        files = [...files, ...dates.map((d) => d.file)];
      }
    }

    // search name

    if (payload.applicant_name) {
      const filename = await prisma.file.findMany({
        where: {
          applicant_name: {
            contains: payload.applicant_name,
          },
        },
        include: {
          village: true,
          type: true,
        },
      });

      if (filename) {
        files = [...files, ...filename];
      }

      const name = await prisma.file_name.findMany({
        where: {
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
      if (name) {
        files = [...files, ...name.map((n) => n.file)];
      }
    }

    // search survey number
    if (payload.survey_number) {
      const surveyfiles = await prisma.file_survey.findMany({
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

      if (surveyfiles) {
        files = [...files, ...surveyfiles.map((s) => s.file)];
      }

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
        files = [...files, ...survey.map((s) => s.file)];
      }
    }

    // search file ref
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
        files = [...files, ...file_ref.map((f) => f.file)];
      }
    }

    files = files.filter(
      (v, i, a) => a.findIndex((t) => t.file_id === v.file_id) === i
    );

    if (payload.searchtype == SearchType.FILETYPE_USER) {
      files = files.filter(
        (f) =>
          f.typeId == payload.typeId &&
          f.applicant_name.includes(payload.applicant_name!)
      );
    } else if (payload.searchtype == SearchType.FILETYPE_VILLAGE) {
      files = files.filter(
        (f) => f.typeId == payload.typeId && f.villageId == payload.villageId
      );
    } else if (payload.searchtype == SearchType.VILLAGE_USER) {
      files = files.filter(
        (f) =>
          f.villageId == payload.villageId &&
          f.applicant_name.includes(payload.applicant_name!)
      );
    } else if (payload.searchtype == SearchType.VILLAGE_SURVAY) {
      files = files.filter(
        (f) =>
          f.villageId == payload.villageId &&
          (f.survey_number.includes(payload.survey_number!) ||
            f.remarks!.includes(payload.survey_number!))
      );
    } else if (payload.searchtype == SearchType.VILLAGE_YEAR) {
      files = files.filter(
        (f) =>
          f.villageId == payload.villageId && f.year == parseInt(payload.year!)
      );
    } else if (payload.searchtype == SearchType.FILETEYPE_YEAR) {
      files = files.filter(
        (f) => f.typeId == payload.typeId && f.year == parseInt(payload.year!)
      );
    }

    return {
      status: true,
      data: files,
      message: "File data get successfully",
      functionname: "ASearchFile",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "ASearchFile",
    };
    return response;
  }
};

export default ASearchFile;
