"use client";

import updateFile from "@/actions/files/updatefiles";
import GetFile from "@/actions/getfile";
import getVillage from "@/actions/getvillage";
import GetUser from "@/actions/user/getuser";
import logout from "@/actions/user/logout";
import verifyFile from "@/actions/verifyfile";
import {
  Fa6SolidArrowLeftLong,
  Fa6SolidCircleMinus,
  Fa6SolidCirclePlus,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ApiResponseType } from "@/models/response";
import { UpdateFileSchema } from "@/schemas/updatefile";
import { capitalcase } from "@/utils/methods";
import { file, user, village } from "@prisma/client";
import { Divide } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

interface ViewFileProps {
  id: number;
  fileid: number;
}
const ViewFile = (props: ViewFileProps) => {
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(true);
  const [userdata, setUserData] = useState<user | null>(null);
  const [filedata, setFileData] = useState<any>(null);
  const [villages, setVillages] = useState<village[]>([]);

  // input data start from

  const file_no = useRef<HTMLInputElement>(null);
  const [village, setVillage] = useState<number>(0);
  const applicant_name = useRef<HTMLInputElement>(null);
  const survey = useRef<HTMLInputElement>(null);
  const remark = useRef<HTMLTextAreaElement>(null);

  const [names, setNames] = useState<string[]>([]);
  const [surveyNumbers, setSurveyNumbers] = useState<string[]>([]);
  const [referenceNumbers, setReferenceNumbers] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);

  // input data end from

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const responseuser = await GetUser({ id: props.id });
      if (responseuser.status) {
        setUserData((val) => responseuser.data);
      } else {
        toast.error(responseuser.message);
      }

      const response: any = await GetFile({ id: props.fileid });
      if (response.status) {
        setFileData((val: any) => response.data);
        setVillage(response.data.village.id);

        setTimeout(() => {
          file_no.current!.value = response.data!.file_no;
          applicant_name.current!.value = response.data!.applicant_name;
          survey.current!.value = response.data!.survey_number;
          remark.current!.value = response.data!.remarks;
        }, 2000);
      } else {
        toast.error(response.message);
      }

      const villages_response = await getVillage({});
      if (villages_response.status) {
        setVillages(villages_response.data!);
      }

      setLoading(false);
    };
    init();
  }, [props.id, props.fileid]);

  const logoutbtn = async () => {
    const response = await logout({});
    if (response.status) {
      router.push("/");
    } else {
      toast.error(response.message);
    }
  };

  const updatefile = async () => {
    const result = safeParse(UpdateFileSchema, {
      file_no: file_no.current!.value,
      applicant_name: applicant_name.current!.value,
      survey_number: survey.current!.value,
      remark: remark.current!.value,
      villageId: village,
      referenceNumbers: referenceNumbers,
      names: names,
      surveyNumbers: surveyNumbers,
      dates: dates,
    });

    if (result.success) {
      const nameset = new Set(names);
      const surveyset = new Set(surveyNumbers);
      const referenceset = new Set(referenceNumbers);
      const datesset = new Set(dates);

      const filesubmit: ApiResponseType<file | null> = await updateFile({
        id: props.fileid,
        file_no: result.output.file_no,
        applicant_name: result.output.applicant_name,
        survey_number: result.output.survey_number,
        remarks: remark.current!.value,
        villageId: result.output.villageId,
        names: Array.from(nameset),
        surveyNumbers: Array.from(surveyset),
        referenceNumbers: Array.from(referenceset),
        dates: Array.from(datesset),
        ...(remark.current!.value && { remarks: remark.current!.value }),
      });

      if (filesubmit.status) {
        toast.success("File Updated Successfully");
        router.push(`/viewfile/${filesubmit.data?.id}`);
      } else {
        toast.error(filesubmit.message);
      }
    } else {
      let errorMessage = "";
      if (result.issues[0].input) {
        errorMessage = result.issues[0].message;
      } else {
        errorMessage = result.issues[0].path![0].key + " is required";
      }
      toast.error(errorMessage);
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
          <div className="flex gap-2 items-center  mt-4">
            <label htmlFor="year" className="w-60">
              Year :
            </label>
            <p>{filedata.year}</p>
          </div>
          <div className="flex gap-2 items-center mt-4">
            <label htmlFor="fileid" className="w-60">
              File Type :
            </label>
            <p>{filedata.type.name}</p>
          </div>
          <div className="flex gap-2 items-center mt-4">
            <label htmlFor="fileid" className="w-60">
              File No :
            </label>
            <Input
              placeholder="Enter file number"
              id="filenumber"
              name="filenumber"
              ref={file_no}
            />
          </div>

          <div className="flex gap-2 items-center mt-4">
            <label htmlFor="fileid" className="w-60">
              Village :
            </label>
            <Select
              value={village.toString()}
              onValueChange={(val) => {
                setVillage(parseInt(val));
              }}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select Village" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Village</SelectLabel>
                  {villages.map((val) => (
                    <SelectItem key={val.id} value={val.id.toString()}>
                      {val.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 items-center  mt-4">
            <label htmlFor="name" className="w-60">
              Applicant Name :
            </label>
            <Input
              placeholder="Enter applicant name"
              id="name"
              name="name"
              ref={applicant_name}
            />
          </div>
          <div className="flex gap-2 items-center  mt-4">
            <label htmlFor="survey" className="w-60">
              Survey Number :
            </label>
            <Input
              placeholder="Enter survey number"
              id="survey"
              name="survey"
              ref={survey}
            />
          </div>

          <div className="flex gap-2 items-start  mt-4">
            <label htmlFor="remark" className="w-60">
              Remarks :
            </label>
            <Textarea
              placeholder="Enter Details"
              id="remark"
              name="remark"
              className="h-24 resize-none"
              ref={remark}
            />
          </div>
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
                    {index + 1}. {val.file_ref}
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
                    {index + 1}. {val.survey_number}
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
                    {index + 1}. {val.dates}
                  </h1>
                ))}
              </div>
            ) : (
              <h1 className="text-center mt-2">No File Dates</h1>
            )}
          </Card>
        </div>
        <div className="mt-4"></div>
        <Separator />
        <div className="flex gap-4 mt-4 w-full flex-wrap">
          <InputCard title="Name" values={names} setvalue={setNames} />
          <InputCard
            title="Survey Numbers"
            values={surveyNumbers}
            setvalue={setSurveyNumbers}
          />
          <InputCard
            title="Reference Numbers"
            values={referenceNumbers}
            setvalue={setReferenceNumbers}
          />
          <InputCard title="Dates" values={dates} setvalue={setDates} />
        </div>
        <Button className="w-full mt-4" onClick={updatefile}>
          Submit
        </Button>
      </div>
    </>
  );
};

export default ViewFile;

interface InputCardProps {
  title: string;
  values: string[];
  setvalue: React.Dispatch<React.SetStateAction<string[]>>;
}
const InputCard = (props: InputCardProps) => {
  return (
    <Card className="p-2 min-w-60 flex-1">
      <div className="flex items-center">
        <h1 className="text-center text-xl font-medium grow">{props.title}</h1>
        <Fa6SolidCirclePlus
          className="text-xl cursor-pointer text-green-500"
          onClick={() => {
            // if (props.values.length > 10) {
            //   toast.error("You can add only 10 names");
            //   return;
            // }

            // if (props.values[props.values.length - 1] === "") {
            //   toast.error("Please fill the previous name");
            //   return;
            // }
            props.setvalue((val) => [...val, ""]);
          }}
        />
      </div>
      <div className="flex flex-col mt-4 gap-2">
        {props.values.map((val, index) => (
          <div key={index} className="flex gap-2 text-center items-center">
            <Input
              value={val}
              onChange={(e) => {
                const temp = [...props.values];

                if (props.title == "Name") {
                  temp[index] = capitalcase(e.target.value);
                } else {
                  temp[index] = e.target.value;
                }
                props.setvalue((val) => temp);
              }}
              placeholder={props.title}
            />
            <Fa6SolidCircleMinus
              className="text-2xl text-rose-500 cursor-pointer"
              onClick={() => {
                const temp = [...props.values];
                temp.splice(index, 1);
                props.setvalue((val) => temp);
              }}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};