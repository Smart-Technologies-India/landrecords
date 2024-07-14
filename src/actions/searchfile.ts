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
import Fuse from "fuse.js";

const fileSearch = async (
  payload: SearchFilePayload
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
        file.file_ref.push(file_ref);
      }
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

    // -------------------------------------------------------

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

    // check file id
    if (payload.file_id) {
      files = files.filter((file: any) => file.file_id == payload.file_id);
    }

    // check file no
    if (payload.file_no) {
      files = files.filter((file: any) => file.file_no == payload.file_no);
    }

    if (payload.survey_number) {
      const fuse = new Fuse(files, {
        isCaseSensitive: false,
        threshold: 0.2,
        keys: ["survey_number"],
      });
      const searchresult = fuse.search(payload.survey_number);
      files = searchresult.map((result: any) => result.item);
    }

    if (payload.applicant_name) {
      const fuse = new Fuse(files, {
        isCaseSensitive: false,
        threshold: 0.2,
        keys: ["applicant_name"],
      });
      const searchresult = fuse.search(payload.applicant_name);
      files = searchresult.map((result: any) => result.item);
    }

    if (payload.file_ref) {
      const fuse = new Fuse(files, {
        isCaseSensitive: false,
        threshold: 0.2,
        keys: ["file_ref"],
      });
      const searchresult = fuse.search(payload.file_ref);
      files = searchresult.map((result: any) => result.item);
    }

    files = files.map((file: any) => {
      let file_survery = file.survey_number;
      let applicant_name = file.applicant_name;
      file.survey_number = file_survery.split(", ")[0];
      file.applicant_name = applicant_name.split(", ")[0];
      return file;
    });

    return {
      status: true,
      data: files,
      message: "File data get successfully",
      functionname: "MatchSearch",
    };

    // const searchfile = await prisma.file.findMany({
    //   where: {
    //     ...(payload.file_no && { file_no: payload.file_no }),
    //     ...(payload.file_id && { file_id: payload.file_id }),
    //     ...(payload.applicant_name && {
    //       applicant_name: { contains: payload.applicant_name },
    //     }),
    //     ...(payload.survey_number && { survey_number: payload.survey_number }),
    //     ...(payload.year && { year: parseInt(payload.year) }),
    //     ...(payload.aadhar && { aadhar: payload.aadhar }),
    //     ...(payload.remarks && { remarks: { contains: payload.remarks } }),
    //     ...(payload.typeId && {
    //       typeId: parseInt(payload.typeId.toString() ?? "0"),
    //     }),
    //     ...(payload.villageId && {
    //       villageId: parseInt(payload.villageId.toString() ?? "0"),
    //     }),
    //     ...(payload.file_ref && {
    //       remarks: { contains: payload.file_ref },
    //     }),
    //     deletedAt: null,
    //   },
    //   include: {
    //     type: true,
    //     village: true,
    //   },
    // });

    // if (searchfile) {
    //   files = [...searchfile];
    // }

    // // search date
    // if (payload.dates) {
    //   const dates = await prisma.file_dates.findMany({
    //     where: {
    //       deletedAt: null,
    //       dates: {
    //         contains: payload.dates,
    //       },
    //     },
    //     include: {
    //       file: {
    //         include: {
    //           village: true,
    //           type: true,
    //         },
    //       },
    //     },
    //   });

    //   const newfiles = dates.map((d) => d.file);

    //   let data_to_search: any = {};
    //   if (payload.file_no) data_to_search.file_no = payload.file_no;
    //   if (payload.file_id) data_to_search.file_id = payload.file_id;
    //   if (payload.applicant_name)
    //     data_to_search.applicant_name = payload.applicant_name;
    //   if (payload.survey_number)
    //     data_to_search.survey_number = payload.survey_number;
    //   if (payload.year) data_to_search.year = payload.year;
    //   if (payload.aadhar) data_to_search.aadhar = payload.aadhar;
    //   if (payload.remarks) data_to_search.remarks = payload.remarks;
    //   if (payload.typeId) data_to_search.typeId = payload.typeId;
    //   if (payload.villageId) data_to_search.villageId = payload.villageId;

    //   const matchfiles = newfiles.filter((f: any) => {
    //     let match = false;
    //     for (const key in data_to_search) {
    //       if (
    //         f[key]
    //           .toString()
    //           .toLowerCase()
    //           .includes(data_to_search[key].toString().toLowerCase())
    //       ) {
    //         match = true;
    //       } else {
    //         match = false;
    //         break;
    //       }
    //       return match;
    //     }
    //   });

    //   if (matchfiles) {
    //     files = [...files, ...matchfiles];
    //   }

    //   // if (Object.keys(data_to_search).length > 0) {
    //   //   files = matchfiles;
    //   // } else {
    //   //   files = [...files, ...newfiles];
    //   // }
    // }

    // // search name

    // if (payload.applicant_name) {
    //   const name = await prisma.file_name.findMany({
    //     where: {
    //       deletedAt: null,
    //       name: {
    //         contains: payload.applicant_name,
    //       },
    //     },
    //     include: {
    //       file: {
    //         include: {
    //           village: true,
    //           type: true,
    //         },
    //       },
    //     },
    //   });

    //   const newfiles = name.map((n) => n.file);

    //   let data_to_search: any = {};
    //   if (payload.file_no) data_to_search.file_no = payload.file_no;
    //   if (payload.file_id) data_to_search.file_id = payload.file_id;
    //   if (payload.applicant_name)
    //     data_to_search.applicant_name = payload.applicant_name;

    //   if (payload.survey_number)
    //     data_to_search.survey_number = payload.survey_number;
    //   if (payload.year) data_to_search.year = payload.year;
    //   if (payload.aadhar) data_to_search.aadhar = payload.aadhar;
    //   if (payload.remarks) data_to_search.remarks = payload.remarks;
    //   if (payload.typeId) data_to_search.typeId = payload.typeId;
    //   if (payload.villageId) data_to_search.villageId = payload.villageId;

    //   const matchfiles = newfiles.filter((f: any) => {
    //     let match = false;
    //     for (const key in data_to_search) {
    //       if (
    //         f[key]
    //           .toString()
    //           .toLowerCase()
    //           .includes(data_to_search[key].toString().toLowerCase())
    //       ) {
    //         match = true;
    //       } else {
    //         match = false;
    //         break;
    //       }
    //     }
    //     return match;
    //   });
    //   // if (Object.keys(data_to_search).length > 0) {
    //   //   files = matchfiles;
    //   // } else {
    //   //   files = [...files, ...newfiles];
    //   // }
    //   if (matchfiles) {
    //     files = [...files, ...matchfiles];
    //   }
    // }

    // // search survey number
    // if (payload.survey_number) {
    //   const surveyfiles = await prisma.file_survey.findMany({
    //     where: {
    //       deletedAt: null,
    //       survey_number: {
    //         contains: payload.survey_number,
    //       },
    //     },
    //     include: {
    //       file: {
    //         include: {
    //           village: true,
    //           type: true,
    //         },
    //       },
    //     },
    //   });

    //   const newfiles = surveyfiles.map((s) => s.file);

    //   let data_to_search: any = {};
    //   if (payload.file_no) data_to_search.file_no = payload.file_no;
    //   if (payload.file_id) data_to_search.file_id = payload.file_id;
    //   if (payload.applicant_name)
    //     data_to_search.applicant_name = payload.applicant_name;
    //   if (payload.survey_number)
    //     data_to_search.survey_number = payload.survey_number;
    //   if (payload.year) data_to_search.year = payload.year;
    //   if (payload.aadhar) data_to_search.aadhar = payload.aadhar;
    //   if (payload.remarks) data_to_search.remarks = payload.remarks;
    //   if (payload.typeId) data_to_search.typeId = payload.typeId;
    //   if (payload.villageId) data_to_search.villageId = payload.villageId;

    //   const matchfiles = newfiles.filter((f: any) => {
    //     let match = false;
    //     for (const key in data_to_search) {
    //       if (
    //         f[key]
    //           .toString()
    //           .toLowerCase()
    //           .includes(data_to_search[key].toString().toLowerCase())
    //       ) {
    //         match = true;
    //       } else {
    //         match = false;
    //         break;
    //       }
    //     }
    //     return match;
    //   });

    //   if (matchfiles) {
    //     files = [...files, ...matchfiles];
    //   }

    //   // if (Object.keys(data_to_search).length > 0) {
    //   //   // files = [...files, ...matchfiles];
    //   //   files = matchfiles;
    //   // } else {
    //   //   files = [...files, ...newfiles];
    //   // }
    // }

    // // search file ref
    // if (payload.file_ref) {
    //   const file_ref = await prisma.file_ref.findMany({
    //     where: {
    //       deletedAt: null,
    //       file_ref: {
    //         contains: payload.file_ref,
    //       },
    //     },
    //     include: {
    //       file: {
    //         include: {
    //           village: true,
    //           type: true,
    //         },
    //       },
    //     },
    //   });

    //   const newfiles = file_ref.map((f) => f.file);

    //   let data_to_search: any = {};
    //   if (payload.file_no) data_to_search.file_no = payload.file_no;
    //   if (payload.file_id) data_to_search.file_id = payload.file_id;
    //   if (payload.applicant_name)
    //     data_to_search.applicant_name = payload.applicant_name;
    //   if (payload.survey_number)
    //     data_to_search.survey_number = payload.survey_number;
    //   if (payload.year) data_to_search.year = payload.year;
    //   if (payload.aadhar) data_to_search.aadhar = payload.aadhar;
    //   if (payload.remarks) data_to_search.remarks = payload.remarks;
    //   if (payload.typeId) data_to_search.typeId = payload.typeId;
    //   if (payload.villageId) data_to_search.villageId = payload.villageId;

    //   const matchfiles = newfiles.filter((f: any) => {
    //     let match = false;
    //     for (const key in data_to_search) {
    //       if (
    //         f[key]
    //           .toString()
    //           .toLowerCase()
    //           .includes(data_to_search[key].toString().toLowerCase())
    //       ) {
    //         match = true;
    //       } else {
    //         match = false;
    //         break;
    //       }
    //     }
    //     return match;
    //   });

    //   if (matchfiles) {
    //     files = [...files, ...matchfiles];
    //   }

    //   // if (Object.keys(data_to_search).length > 0) {
    //   //   files = matchfiles;
    //   // } else {
    //   //   files = [...files, ...newfiles];
    //   // }
    // }

    // files = files.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);

    // return {
    //   status: true,
    //   data: files,
    //   message: "File data get successfully",
    //   functionname: "fileSearch",
    // };
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
