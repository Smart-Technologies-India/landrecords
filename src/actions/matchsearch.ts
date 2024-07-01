"use server";
interface MetchSearchPayload {
  typeId?: number;
  villageId?: number;
  survey_number?: string;
  applicant_name?: string;
  year?: string;
  file_ref?: string;
}

import { errorToString } from "@/utils/methods";
import prisma from "../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { file } from "@prisma/client";
import Fuse from "fuse.js";

const MatchSearch = async (
  payload: MetchSearchPayload
): Promise<ApiResponseType<file[] | null>> => {
  try {
    let files: any[] = [];

    const fileresponse = await prisma.file.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        type: true,
        village: true,
      },
    });

    if (!fileresponse) {
      return {
        status: false,
        data: null,
        message: "Unable to get files",
        functionname: "MatchSearch",
      };
    }

    const filerefresponse = await prisma.file_ref.findMany({
      where: {
        deletedAt: null,
      },
    });

    if (!filerefresponse) {
      return {
        status: false,
        data: null,
        message: "Unable to get files ref",
        functionname: "MatchSearch",
      };
    }

    const filenameresponse = await prisma.file_name.findMany({
      where: {
        deletedAt: null,
      },
    });

    if (!filenameresponse) {
      return {
        status: false,
        data: null,
        message: "Unable to get files names",
        functionname: "MatchSearch",
      };
    }

    const filesurveyresponse = await prisma.file_survey.findMany({
      where: {
        deletedAt: null,
      },
    });

    if (!filesurveyresponse) {
      return {
        status: false,
        data: null,
        message: "Unable to get files survey",
        functionname: "MatchSearch",
      };
    }

    files = fileresponse.map((file: any) => {
      let file_survery = file.survey_number;
      let applicant_name = file.applicant_name;
      file.survey_number = [file_survery];
      file.applicant_name = [applicant_name];
      file.file_ref = [];

      return file;
    });

    const fileMap = new Map<number, any>();

    // Populate the map with the files
    files.forEach((file) => fileMap.set(file.id, file));

    for (let i = 0; i < filerefresponse.length; i++) {
      const file_id = filerefresponse[i].fileId;
      const file_ref = filerefresponse[i].file_ref;

      const file = fileMap.get(file_id);
      if (file) {
        // Push the file reference to the file_ref array
        file.file_ref.push(file_ref);
      }

      //   const file: any[] = files.filter((file: any) => file.id == file_id);
      //   file[0].file_ref.push(file_ref);

      //   const expectfiles = files.filter((file: any) => file.id != file_id);
      //   files = [...expectfiles, ...file];
    }

    for (let i = 0; i < filenameresponse.length; i++) {
      const file_id = filenameresponse[i].fileId;
      const applicant_name = filenameresponse[i].name;

      const file = fileMap.get(file_id);
      if (file) {
        file.applicant_name.push(applicant_name);
      }
    }

    for (let i = 0; i < filesurveyresponse.length; i++) {
      const file_id = filesurveyresponse[i].fileId;
      const survey_number = filesurveyresponse[i].survey_number;

      const file = fileMap.get(file_id);
      if (file) {
        file.survey_number.push(survey_number);
      }
    }

    files = Array.from(fileMap.values());

    for (let i = 0; i < files.length; i++) {
      files[i].applicant_name = files[i].applicant_name.join(", ");
      files[i].file_ref = files[i].file_ref.join(", ");
      files[i].survey_number = files[i].survey_number.join(", ");
    }

    // check file id
    if (payload.typeId) {
      files = files.filter((file: any) => file.typeId == payload.typeId);
    }
    // check village id
    if (payload.villageId) {
      files = files.filter((file: any) => file.villageId == payload.villageId);
    }

    // check year
    if (payload.year) {
      files = files.filter((file: any) => file.year == payload.year);
    }

    if (payload.survey_number) {
      const fuse = new Fuse(files, {
        isCaseSensitive: false,
        threshold: 0.6,
        keys: ["survey_number"],
      });
      const searchresult = fuse.search(payload.survey_number);
      files = searchresult.map((result: any) => result.item);
    }

    if (payload.applicant_name) {
      const fuse = new Fuse(files, {
        isCaseSensitive: false,
        threshold: 0.6,
        keys: ["applicant_name"],
      });
      const searchresult = fuse.search(payload.applicant_name);
      files = searchresult.map((result: any) => result.item);
    }

    if (payload.file_ref) {
      const fuse = new Fuse(files, {
        isCaseSensitive: false,
        threshold: 0.6,
        keys: ["file_ref"],
      });
      const searchresult = fuse.search(payload.file_ref);
      files = searchresult.map((result: any) => result.item);
    }

    // files = files.map((file: any) => {
    //   let file_survery = file.survey_number;
    //   let applicant_name = file.applicant_name;
    //   file.survey_number = file_survery.split(", ")[0];
    //   file.applicant_name = applicant_name.split(", ")[0];
    //   return file;
    // });

    return {
      status: true,
      data: files,
      message: "File data get successfully",
      functionname: "MatchSearch",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "MatchSearch",
    };
    return response;
  }
};

export default MatchSearch;
