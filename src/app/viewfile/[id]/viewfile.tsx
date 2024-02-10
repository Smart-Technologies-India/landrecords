"use client";

import GetFile from "@/actions/getfile";
import GetUser from "@/actions/getuser";
import logout from "@/actions/logout";
import verifyFile from "@/actions/verifyfile";
import { Fa6SolidArrowLeftLong } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { user } from "@prisma/client";
import { verify } from "crypto";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ViewFileProps {
  id: number;
  fileid: number;
}
const ViewFile = (props: ViewFileProps) => {
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(true);
  const [userdata, setUserData] = useState<user | null>(null);
  const [filedata, setFileData] = useState<any>(null);

  const init = async () => {
    setLoading(true);

    const responseuser = await GetUser({ id: props.id });
    if (responseuser.status) {
      setUserData((val) => responseuser.data);
    } else {
      toast.error(responseuser.message);
    }

    const response = await GetFile({ id: props.fileid });
    if (response.status) {
      setFileData((val: any) => response.data);
    } else {
      toast.error(response.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  const logoutbtn = async () => {
    const response = await logout({});
    if (response.status) {
      router.push("/");
    } else {
      toast.error(response.message);
    }
  };

  const verifyfile = async () => {
    const response = await verifyFile({ id: props.fileid });
    if (response.status) {
      toast.success(response.message);
      init();
    } else {
      toast.error(response.message);
    }
  };

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <>
      <div className="min-h-screen p-2 mx-auto w-5/6">
        <Card>
          <CardHeader className="py-2 px-4 flex flex-row items-center gap-4">
            <Fa6SolidArrowLeftLong
              className="text-2xl cursor-pointer"
              onClick={() => router.back()}
            />
            <h1 className="text-xl">{userdata?.username}</h1>
            <p className="text-2xl grow text-center">Land Records</p>
            <Button onClick={logoutbtn}>Logout</Button>
          </CardHeader>
        </Card>

        <Card className=" h-full p-2 mt-4 px-6">
          <h1 className="text-center text-2xl font-medium">
            Search File Details
          </h1>
          <div className="flex gap-2 items-center mt-4">
            <label htmlFor="fileid" className="w-60">
              File Id :
            </label>
            <p>{filedata.file_id}</p>
          </div>
          <div className="flex gap-2 items-center mt-4">
            <label htmlFor="fileid" className="w-60">
              File Type :
            </label>
            <p>{filedata.type.name}</p>
          </div>
          <div className="flex gap-2 items-center mt-4">
            <label htmlFor="fileid" className="w-60">
              Village :
            </label>
            <p>{filedata.village.name}</p>
          </div>
          <div className="flex gap-2 items-center  mt-4">
            <label htmlFor="name" className="w-60">
              File Name :
            </label>
            <p>{filedata.name}</p>
          </div>
          <div className="flex gap-2 items-center  mt-4">
            <label htmlFor="survey" className="w-60">
              Survey Number :
            </label>
            <p>{filedata.survey_number}</p>
          </div>
          <div className="flex gap-2 items-center  mt-4">
            <label htmlFor="year" className="w-60">
              Year :
            </label>
            <p>{filedata.survey_number}</p>
          </div>
          <div className="flex gap-2 items-center mt-4">
            <label htmlFor="adhar" className="w-60">
              Aadhar/Pan/GST :
            </label>
            <p>{filedata.aadhar}</p>
          </div>

          <div className="flex gap-2 items-start  mt-4">
            <label htmlFor="remark" className="w-60">
              Remarks :
            </label>
            <p>{filedata.remarks}</p>
          </div>
          {filedata.verifiedAt && (
            <div className="flex gap-2 items-start  mt-4">
              <label htmlFor="remark" className="w-60">
                Verified At:
              </label>
              <p>{new Date(filedata.verifiedAt).toDateString()}</p>
            </div>
          )}
        </Card>
        <div className="flex gap-4 mt-4 w-full flex-wrap">
          <Card className="p-2 min-w-60 flex-1">
            <h1 className="text-center text-xl font-semibold">Names</h1>
            {filedata.file_name.length > 0 ? (
              <div>
                {filedata.file_name.map((val: any, index: number) => (
                  <h1 key={index}>
                    {index + 1}. {val.name}
                  </h1>
                ))}
              </div>
            ) : (
              <h1 className="text-center mt-2">No File Name</h1>
            )}
          </Card>
          <Card className="p-2 min-w-60 flex-1">
            <h1 className="text-center text-xl font-semibold">
              File reference
            </h1>
            {filedata.file_ref.length > 0 ? (
              <div>
                {filedata.file_ref.map((val: any, index: number) => (
                  <h1 key={index}>
                    {index + 1}. {val.name}
                  </h1>
                ))}
              </div>
            ) : (
              <h1 className="text-center mt-2">No File reference</h1>
            )}
          </Card>
          <Card className="p-2 min-w-60 flex-1">
            <h1 className="text-center text-xl font-semibold">File survey</h1>
            {filedata.file_survey.length > 0 ? (
              <div>
                {filedata.file_survey.map((val: any, index: number) => (
                  <h1 key={index}>
                    {index + 1}. {val.name}
                  </h1>
                ))}
              </div>
            ) : (
              <h1 className="text-center mt-2">No File survey</h1>
            )}
          </Card>
          <Card className="p-2 min-w-60 flex-1">
            <h1 className="text-center text-xl font-semibold">File dates</h1>
            {filedata.file_dates.length > 0 ? (
              <div>
                {filedata.file_dates.map((val: any, index: number) => (
                  <h1 key={index}>
                    {index + 1}. {val.name}
                  </h1>
                ))}
              </div>
            ) : (
              <h1 className="text-center mt-2">No File Dates</h1>
            )}
          </Card>
        </div>
        {filedata.verifiedAt == null ? (
          <Button className="w-full mt-4" onClick={verifyfile}>
            Verify File
          </Button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ViewFile;
