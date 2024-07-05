/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import getFileType from "@/actions/getfiletype";
import getVillage from "@/actions/getvillage";
import fileSearch from "@/actions/searchfile";
import GetUser from "@/actions/user/getuser";
import logout from "@/actions/user/logout";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ApiResponseType } from "@/models/response";

import { file, file_type, user, village } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface HomeProps {
  id: any;
  role: any;
}
const SearchAdmin = (props: HomeProps) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [userdata, setUserData] = useState<user | null>(null);
  const [villages, setVillages] = useState<village[]>([]);
  const [fileTypes, setFileTypes] = useState<file_type[]>([]);

  const [isSearch, setSearch] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<file[] | null>(null);

  const init = async () => {
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

  useEffect(() => {
    init();
  }, []);

  const [fileType, setFileType] = useState<number>(0);
  const [village, setVillage] = useState<number>(0);

  const file_no = useRef<HTMLInputElement>(null);
  const applicant_name = useRef<HTMLInputElement>(null);
  const survey = useRef<HTMLInputElement>(null);
  const year = useRef<HTMLInputElement>(null);
  const adhar = useRef<HTMLInputElement>(null);
  const fileref = useRef<HTMLInputElement>(null);
  const dates = useRef<HTMLInputElement>(null);
  const remark = useRef<HTMLTextAreaElement>(null);

  const search = async () => {
    const filesearch: ApiResponseType<file[] | null> = await fileSearch({
      file_no: file_no.current?.value,
      applicant_name: applicant_name.current?.value,
      survey_number: survey.current?.value,
      year: year.current?.value,
      aadhar: adhar.current?.value,
      remarks: remark.current?.value,
      typeId: fileType,
      villageId: village,
    });

    if (filesearch.status) {
      setSearchData(filesearch.data);
      setSearch(true);
      toast.success("File search completed");
    } else {
      toast.error(filesearch.message);
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
        <h1 className="text-center text-2xl font-medium">
          Search File Details
        </h1>
        <div className="flex gap-2 items-center mt-4">
          <label htmlFor="file_no" className="w-60">
            File No :
          </label>
          <Input
            placeholder="Enter File No"
            id="file_no"
            name="file_no"
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
          <label htmlFor="name" className="w-60">
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
          <label htmlFor="survey" className="w-60">
            Survey Number :
          </label>
          <Input placeholder="survey" id="survey" name="survey" ref={survey} />
        </div>
        <div className="flex gap-2 items-center  mt-4">
          <label htmlFor="year" className="w-60">
            Year :
          </label>
          <Input placeholder="year" id="year" name="year" ref={year} />
        </div>
        <div className="flex gap-2 items-center mt-4">
          <label htmlFor="adhar" className="w-60">
            Aadhar/Pan/GST :
          </label>
          <Input
            placeholder="xxxx-xxxx-3453"
            id="adhar"
            name="adhar"
            ref={adhar}
          />
        </div>
        <div className="flex gap-2 items-center mt-4">
          <label htmlFor="fileref" className="w-60">
            File ref :
          </label>
          <Input
            placeholder="File Reference Number"
            id="fileref"
            name="fileref"
            ref={fileref}
          />
        </div>
        <div className="flex gap-2 items-center mt-4">
          <label htmlFor="dates" className="w-60">
            Date :
          </label>
          <Input
            placeholder="Ex: 12-23-2024"
            id="dates"
            name="dates"
            ref={dates}
          />
        </div>
        <div className="flex gap-2 items-start  mt-4">
          <label htmlFor="remark" className="w-60">
            Remarks :
          </label>
          <Textarea
            placeholder="Remark"
            id="remark"
            name="remark"
            className="h-24 resize-none"
            ref={remark}
          />
        </div>
      </Card>

      <Button className="w-full mt-4" onClick={search}>
        Search
      </Button>
      <Card className="mt-6">
        <CardHeader className="py-2 px-4 flex flex-row items-center">
          <h1 className="text-xl">Search Result</h1>
          <div className="grow"></div>
          <p>Found: {searchData?.length}</p>
        </CardHeader>
        {isSearch && searchData && searchData.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">File Id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Survey Number</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>File Type</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchData.map((val: any) => (
                  <TableRow key={val.id}>
                    <TableCell className="font-medium">{val.id}</TableCell>
                    <TableCell>{val.applicant_name}</TableCell>
                    <TableCell>{val.survey_number}</TableCell>
                    <TableCell>{val.year}</TableCell>
                    <TableCell>{val.type.name}</TableCell>
                    <TableCell>{val.village.name}</TableCell>
                    <TableCell className="flex">
                      <Button
                        onClick={() => router.push(`/viewfile/${val.id}`)}
                      >
                        View
                      </Button>
                      <div className="w-4"></div>
                      <Button
                        onClick={() => router.push(`/editfile/${val.id}`)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center">
            <p>No data found</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SearchAdmin;
