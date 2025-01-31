"use client";

import GetPdfFiles from "@/actions/files/getpdflist";
import GetFile from "@/actions/getfile";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface filedata {
  id: number;
  name: string;
  path: string;
}

interface ViewFileProps {
  fileid: number;
}
const ViewFile = (props: ViewFileProps) => {
  type CupboardLocation = {
    [key: string]: {
      width: string;
      height: string;
    };
  };

  const cupboard_locaton: CupboardLocation = {
    "1": {
      width: "17px",
      height: "178px",
    },
    "2": {
      width: "35px",
      height: "178px",
    },
    "3": {
      width: "54px",
      height: "178px",
    },
    "4": {
      width: "72px",
      height: "178px",
    },

    "5": {
      width: "90px",
      height: "178px",
    },
    "6": {
      width: "108px",
      height: "178px",
    },
    "7": {
      width: "127px",
      height: "178px",
    },
    "8": {
      width: "145px",
      height: "178px",
    },
    "9": {
      width: "167px",
      height: "178px",
    },
    "10": {
      width: "185px",
      height: "178px",
    },
    "11": {
      width: "195px",
      height: "8px",
    },
    "12": {
      width: "218px",
      height: "8px",
    },
    "13": {
      width: "240px",
      height: "8px",
    },
    "14": {
      width: "89px",
      height: "147px",
    },
    "15": {
      width: "106px",
      height: "147px",
    },
    "16": {
      width: "145px",
      height: "44px",
    },
    "17": {
      width: "145px",
      height: "65px",
    },
    "18": {
      width: "145px",
      height: "84px",
    },
    "19": {
      width: "145px",
      height: "104px",
    },
    "20": {
      width: "145px",
      height: "126px",
    },
    "21": {
      width: "145px",
      height: "147px",
    },
    "22": {
      width: "16px",
      height: "178px",
    },
    "23": {
      width: "202px",
      height: "147px",
    },
    "24": {
      width: "221px",
      height: "182px",
    },
    "25": {
      width: "240px",
      height: "182px",
    },
  };

  const self_locaton: CupboardLocation = {
    A: {
      width: "299px",
      height: "29px",
    },
    B: {
      width: "328px",
      height: "29px",
    },
    C: {
      width: "356px",
      height: "29px",
    },
    D: {
      width: "299px",
      height: "62px",
    },
    E: {
      width: "328px",
      height: "62px",
    },
    F: {
      width: "356px",
      height: "62px",
    },
    G: {
      width: "299px",
      height: "95px",
    },
    H: {
      width: "328px",
      height: "95px",
    },
    I: {
      width: "356px",
      height: "95px",
    },
    J: {
      width: "299px",
      height: "128px",
    },
    K: {
      width: "328px",
      height: "128px",
    },
    L: {
      height: "128px",
      width: "356px",
    },
    M: {
      width: "299px",
      height: "160px",
    },
    N: {
      width: "328px",
      height: "160px",
    },
    O: {
      width: "356px",
      height: "160px",
    },
  };

  interface CUPBoardLocation {
    height: string;
    width: string;
  }

  const [isData, setIsData] = useState<boolean>(false);

  const [cupboardLocation, setCupboardLocaton] = useState<CUPBoardLocation>({
    width: "0px",
    height: "0px",
  });
  const [selfLocation, setSelfLocaton] = useState<CUPBoardLocation>({
    width: "0px",
    height: "0px",
  });

  const SetLocation = (cupboard: string, self: string) => {
    const location_cupboard = cupboard_locaton[cupboard];
    if (location) {
      setCupboardLocaton(location_cupboard);
      setIsData(true);
    } else {
      setIsData(false);
    }
    const location_slef = self_locaton[self];
    if (location) {
      setSelfLocaton(location_slef);
      setIsData(true);
    } else {
      setIsData(false);
    }
  };

  const router = useRouter();

  const [isLoad, setLoad] = useState<boolean>(false);
  // const [image, setImage] = useState<string>("/img.jpg");

  const [isLoading, setLoading] = useState<boolean>(true);
  const [filedata, setFileData] = useState<any>(null);
  const [files, setFiles] = useState<filedata[]>([]);

  const [pdffile, setPdffile] = useState<string | null>(null);

  interface filedata {
    id: number;
    name: string;
    path: string;
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const response = await GetFile({ id: props.fileid });

      if (response.status) {
        setFileData((val: any) => response.data);
        const responsefile = await GetPdfFiles({
          location: response.data?.file_location!,
        });
        if (responsefile.data) {
          setFiles(responsefile.data);
        }
      } else {
        toast.error(response.message);
      }

      setLoading(false);
    };
    init();
  }, [props.fileid]);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <>
      <div className="min-h-screen p-2 mx-auto px-4">
        <Card className=" h-full p-2 px-6 text-sm">
          <div className="flex gap-4 items-center">
            <h1 className="text-left text-2xl font-medium">File Details</h1>
          </div>
          <div className="flex gap-2 items-center mt-2">
            <label htmlFor="fileid" className="w-60">
              File No :
            </label>
            <p>{filedata.file_id}</p>
          </div>
          <div className="flex gap-2 items-center mt-2">
            <label htmlFor="fileid" className="w-60">
              Old File No :
            </label>
            <p>{filedata.file_no}</p>
          </div>
          <div className="flex gap-2 items-center mt-2">
            <label htmlFor="fileid" className="w-60">
              File Type :
            </label>
            <p>{filedata.type.name}</p>
          </div>
          <div className="flex gap-2 items-center mt-2">
            <label htmlFor="fileid" className="w-60">
              Village :
            </label>
            <p>{filedata.village.name}</p>
          </div>
          <div className="flex gap-2 items-center  mt-2">
            <label htmlFor="name" className="w-60">
              Applicant Name :
            </label>
            <p>{filedata.applicant_name}</p>
          </div>
          <div className="flex gap-2 items-center  mt-2">
            <label htmlFor="survey" className="w-60">
              Survey Number :
            </label>
            <p>{filedata.survey_number}</p>
          </div>
          <div className="flex gap-2 items-center  mt-2">
            <label htmlFor="year" className="w-60">
              Year :
            </label>
            <p>{filedata.year}</p>
          </div>
          {/* {filedata.aadhar && (
            <div className="flex gap-2 items-center mt-4">
              <label htmlFor="adhar" className="w-60">
                Aadhar/Pan/GST :
              </label>
              <p>{filedata.aadhar}</p>
            </div>
          )} */}

          {filedata.remarks && (
            <div className="flex gap-2 items-start  mt-2">
              <label htmlFor="remark" className="w-60">
                Remarks :
              </label>
              <p>{filedata.remarks}</p>
            </div>
          )}
          {filedata.physicalFileLocationId ? (
            <div className="flex gap-2 items-start  mt-2">
              <label htmlFor="remark" className="w-60">
                File Location :
              </label>
              <div className="flex gap-4">
                <p>
                  {filedata.physical_file_location.cupboard_numer}-
                  {filedata.physical_file_location.shelf_number} (
                  {filedata.physical_file_location.shelf_location})
                </p>
                <button
                  className="bg-gray-200 p-1 px-4 rounded-sm"
                  onClick={() => {
                    setLoad(!isLoad);

                    SetLocation(
                      filedata.physical_file_location.cupboard_numer,
                      filedata.physical_file_location.shelf_number
                    );
                  }}
                >
                  View
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 items-start  mt-2">
              <label htmlFor="remark" className="w-60">
                File Location :
              </label>
              <div className="flex gap-4">
                <p>99-A (work in progress)</p>
                {/* <button
                  className="bg-gray-200 p-1 px-4 rounded-sm"
                  onClick={() => {
                    setImage(`/location/test.jpg`);
                    setShowImage(!showimage);
                  }}
                >
                  View
                </button> */}
              </div>
            </div>
          )}

          {filedata.verifiedAt && (
            <div className="flex gap-2 items-start  mt-4">
              <label htmlFor="remark" className="w-60">
                Verified At:
              </label>
              <p>{new Date(filedata.verifiedAt).toDateString()}</p>
            </div>
          )}
        </Card>
        {isLoad && (
          <div className="bg-white rounded-md w-full p-4 mt-4 shadow grid place-items-center">
            <div className="relative h-[190px] w-[380px]">
              <Image
                alt="place"
                src={"/place.jpg"}
                fill={true}
                className="w-full h-full object-cover"
              ></Image>
              {isData && (
                <>
                  <div
                    style={{
                      top: cupboardLocation.height,
                      left: cupboardLocation.width,
                    }}
                    className={`rounded-full h-[6px] w-[6px] bg-rose-500 absolute`}
                  ></div>
                  <div
                    style={{
                      top: selfLocation.height,
                      left: selfLocation.width,
                    }}
                    className={`rounded-full absolute`}
                  >
                    <p className="text-rose-500 text-[0.4rem] text-center leading-[0.4rem]">
                      Your <br /> File is <br /> Here
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-4 w-full flex-wrap">
          <ScrollArea className="p-2 min-w-60 flex-1 max-h-60 bg-white rounded-lg shadow">
            <h1 className="text-center text-lg font-semibold">Names</h1>
            {filedata.file_name.length > 0 ? (
              <div>
                {filedata.file_name.map((val: any, index: number) => (
                  <h1 key={index} className="text-sm">
                    {index + 1}. {val.name}
                  </h1>
                ))}
              </div>
            ) : (
              <h1 className="text-center mt-2">No File Name</h1>
            )}
          </ScrollArea>
          <ScrollArea className="p-2 min-w-60 flex-1 max-h-60 bg-white rounded-lg shadow">
            <h1 className="text-center text-lg font-semibold ">Reference No</h1>
            {filedata.file_ref.length > 0 ? (
              <div>
                {filedata.file_ref.map((val: any, index: number) => (
                  <h1 key={index} className="text-sm">
                    {index + 1}. {val.file_ref}
                  </h1>
                ))}
              </div>
            ) : (
              <h1 className="text-center mt-2">No Reference no. found.</h1>
            )}
          </ScrollArea>

          <ScrollArea className="p-2 min-w-60 flex-1 max-h-60 bg-white rounded-lg shadow">
            <h1 className="text-center text-lg font-semibold">Survey No</h1>
            {filedata.file_survey.length > 0 ? (
              <div>
                {filedata.file_survey.map((val: any, index: number) => (
                  <h1 key={index} className="text-sm">
                    {index + 1}. {val.survey_number}
                  </h1>
                ))}
              </div>
            ) : (
              <h1 className="text-center mt-2">No Survey no. found.</h1>
            )}
          </ScrollArea>

          {/* <Card className="p-2 min-w-60 flex-1">
            <h1 className="text-center text-xl font-semibold">File dates</h1>
            {filedata.file_dates.length > 0 ? (
              <div>
                {filedata.file_dates.map((val: any, index: number) => (
                  <h1 key={index}>
                    {index + 1}. {val.dates}
                  </h1>
                ))}
              </div>
            ) : (
              <h1 className="text-center mt-2">No File Dates</h1>
            )}
          </Card> */}
        </div>
        <Card className="bg-white mt-2 p-3 flex flex-col">
          <p className="text-lg font-semibold">Files</p>
          <Separator />
          {files.map((file: filedata, index: number) => {
            return (
              <button
                key={index}
                onClick={() => {
                  setPdffile(`/files/${filedata.file_location}/${file.name}`);
                  setTimeout(() => {
                    window.scrollTo({
                      top: document.documentElement.scrollHeight,
                      behavior: "smooth",
                    });
                  }, 500);
                }}
                className="text-xs hover:bg-gray-100 rounded-sm p-1 cursor-pointer flex gap-4 items-center"
              >
                <p>
                  {index + 1}. {file.name}
                </p>
                <div className="grow"></div>
                <p className="bg-gray-200 p-1 px-4 rounded-sm">View</p>
              </button>
            );
          })}
        </Card>
        {pdffile !== null && (
          <>
            <div className="w-full my-4">
              <embed
                src={pdffile}
                className="w-full h-[calc(100vh-50px)]"
                type="application/pdf"
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ViewFile;
