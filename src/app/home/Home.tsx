"use client";
import getFileType from "@/actions/getfiletype";
import getVillage from "@/actions/getvillage";
import fileSubmit from "@/actions/submitform";
import { Fa6SolidCircleMinus, Fa6SolidCirclePlus } from "@/components/icons";
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
import { Textarea, TextareaProps } from "@/components/ui/textarea";
import { ApiResponseType } from "@/models/response";
import { FileSchema } from "@/schemas/file";
import { file, file_type, user, village } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

import { default as MulSelect } from "react-select";
import { capitalcase } from "@/utils/methods";
import GetUser from "@/actions/user/getuser";
import logout from "@/actions/user/logout";

interface HomeProps {
  id: any;
  role: any;
}
const HomeForm = (props: HomeProps) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [userdata, setUserData] = useState<user | null>(null);
  const [villages, setVillages] = useState<village[]>([]);
  const [fileTypes, setFileTypes] = useState<file_type[]>([]);

  useEffect(() => {
    const init = async () => {
      if (props.role == "DEPARTMENT") {
        router.push("/dashboard");
      }
      setLoading(true);
      const response = await GetUser({ id: parseInt(props.id) });
      if (response.status) {
        setUserData((val) => response.data);
      } else {
        toast.error(response.message);
      }

      const villages_response = await getVillage({});
      if (villages_response.status) {
        setVillages(villages_response.data!);
      }

      const file_type_response = await getFileType({});
      if (file_type_response.status) {
        setFileTypes(file_type_response.data!);
      }
      setLoading(false);
    };
    init();
  }, [props.id, router, props.role]);

  const [year, setYear] = useState<string>("2000");

  const [fileType, setFileType] = useState<number>(0);
  const [village, setVillage] = useState<number>(0);

  const file_no = useRef<HTMLInputElement>(null);
  const applicant_name = useRef<HTMLInputElement>(null);
  const survey = useRef<HTMLInputElement>(null);
  const adhar = useRef<HTMLInputElement>(null);
  const remark = useRef<HTMLTextAreaElement>(null);
  const [names, setNames] = useState<string[]>([]);
  const [surveyNumbers, setSurveyNumbers] = useState<string[]>([]);
  const [referenceNumbers, setReferenceNumbers] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);

  const submit = async () => {
    const result = safeParse(FileSchema, {
      file_no: file_no.current!.value,
      applicant_name: applicant_name.current!.value,
      survey_number: survey.current!.value,
      year: parseInt(year),
      typeId: fileType,
      villageId: village,
      names: names,
      surveyNumbers: surveyNumbers,
      referenceNumbers: referenceNumbers,
      dates: dates,
    });

    if (result.success) {
      const nameset = new Set(names);
      const surveyset = new Set(surveyNumbers);
      const referenceset = new Set(referenceNumbers);
      const datesset = new Set(dates);

      const filesubmit: ApiResponseType<file | null> = await fileSubmit({
        user_id: parseInt(props.id),
        file_no: result.output.file_no,
        applicant_name: result.output.applicant_name,
        survey_number: result.output.survey_number,
        year: result.output.year,
        aadhar: adhar.current!.value,
        remarks: remark.current!.value,
        typeId: result.output.typeId,
        villageId: result.output.villageId,
        names: Array.from(nameset),
        surveyNumbers: Array.from(surveyset),
        referenceNumbers: Array.from(referenceset),
        dates: Array.from(datesset),
      });

      if (filesubmit.status) {
        toast.success("File Submitted Successfully");
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

  const logoutbtn = async () => {
    const response = await logout({});
    if (response.status) {
      router.push("/");
    } else {
      toast.error(response.message);
    }
  };

  type YearProps = {
    value: string;
    label: string;
  };
  const options: YearProps[] = Array.from({ length: 63 }, (_, i) => ({
    value: (i + 1960).toString(),
    label: (i + 1960).toString(),
  }));

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen p-2 mx-auto w-5/6">
      <Card>
        <CardHeader className="py-2 px-4 flex flex-row items-center">
          <h1 className="text-xl">{userdata?.username}</h1>
          <p className="text-2xl grow text-center">Land Records</p>
          <Button onClick={logoutbtn}>Logout</Button>
        </CardHeader>
      </Card>
      <Card className=" h-full p-2 mt-4 px-6">
        <h1 className="text-center text-2xl font-medium">File Details</h1>
        <div className="flex gap-2 items-center mt-4">
          <label htmlFor="fileid" className="w-60">
            File No :
          </label>
          <Input
            placeholder="Enter File No"
            id="fileno"
            name="fileno"
            ref={file_no}
          />
        </div>
        <div className="flex gap-2 items-center mt-4">
          <label htmlFor="fileid" className="w-60">
            File Type :
          </label>
          <Select
            onValueChange={(val) => {
              setFileType(parseInt(val));
            }}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select File Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>File Type</SelectLabel>
                {fileTypes.map((val) => (
                  <SelectItem key={val.id} value={val.id.toString()}>
                    {val.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-center mt-4">
          <label htmlFor="fileid" className="w-60">
            Village :
          </label>
          <Select
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
          <label htmlFor="applicant_name" className="w-60">
            Applicant Name :
          </label>
          <Input
            placeholder="Enter Applicant Name"
            id="applicant_name"
            name="applicant_name"
            ref={applicant_name}
          />
        </div>
        <div className="flex gap-2 items-center  mt-4">
          <label htmlFor="Enter Details" className="w-60">
            Survey Number :
          </label>
          <Input placeholder="survey" id="survey" name="survey" ref={survey} />
        </div>
        <div className="flex gap-2 items-center  mt-4">
          <label htmlFor="year" className="w-60">
            Year :
          </label>
          <MulSelect
            defaultValue={{ value: "2000", label: "2000" }}
            isMulti={false}
            options={options}
            className="w-full accent-slate-900"
            onChange={(val) => {
              if (!val) return;
              setYear(val.value);
            }}
          />
        </div>
        <div className="flex gap-2 items-center mt-4">
          <label htmlFor="adhar" className="w-60">
            Aadhar/Pan/GST :
          </label>
          <Input
            placeholder="Enter Details"
            id="adhar"
            name="adhar"
            ref={adhar}
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
      <Button className="w-full mt-4" onClick={submit}>
        Submit
      </Button>
    </div>
  );
};

export default HomeForm;

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

            if (props.values[props.values.length - 1] === "") {
              toast.error("Please fill the previous name");
              return;
            }
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
