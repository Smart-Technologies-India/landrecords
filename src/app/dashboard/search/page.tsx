"use client";
import getFileType from "@/actions/getfiletype";
import getVillage from "@/actions/getvillage";
import fileSearch from "@/actions/searchfile";
import { Fa6SolidXmark, FluentMdl2Search } from "@/components/icons";
import Pagination from "@/components/pagination";
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
import { usePagination } from "@/hooks/usepagination";
import { ApiResponseType } from "@/models/response";
import { file, file_type, user, village } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Search = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [villages, setVillages] = useState<village[]>([]);
  const [fileTypes, setFileTypes] = useState<file_type[]>([]);

  const [search, setSearch] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<any[]>([]);

  const pagination = usePagination(searchData);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

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
  }, []);

  const [fileType, setFileType] = useState<number>(0);
  const [village, setVillage] = useState<number>(0);

  const file_no = useRef<HTMLInputElement>(null);
  const applicant_name = useRef<HTMLInputElement>(null);
  const survey = useRef<HTMLInputElement>(null);
  const year = useRef<HTMLInputElement>(null);
  const fileref = useRef<HTMLInputElement>(null);
  const remark = useRef<HTMLTextAreaElement>(null);

  const searchItems = async () => {
    const filesearch: ApiResponseType<file[] | null> = await fileSearch({
      file_no: file_no.current?.value,
      applicant_name: applicant_name.current?.value,
      survey_number: survey.current?.value,
      year: year.current?.value,
      remarks: remark.current?.value,
      typeId: fileType,
      villageId: village,
    });

    if (filesearch.status) {
      setSearchData(filesearch.data!);
      setSearch(true);
      toast.success("File search completed");
    } else {
      toast.error(filesearch.message);
    }
  };

  // ---------------search section----------------

  const searchRef = useRef<HTMLInputElement>(null);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const [searchresult, setSearchresult] = useState<any[]>([]);

  const paginationsearch = usePagination(searchresult);

  const searchchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current) {
      if (searchRef.current.value.length > 0) {
        setIsSearch(true);

        setSearchresult(
          searchData.filter(
            (property) =>
              property.applicant_name
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.survey_number
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.year
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.type.name
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.village.name
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                )
          )
        );
      } else {
        setIsSearch(false);
      }
    }
  };

  const clearsearch = async () => {
    setIsSearch((val) => false);
    searchRef.current!.value = "";
  };

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen p-6 mx-auto">
      <Card className=" h-full p-2 mt-4 px-6">
        <h1 className="text-center text-2xl font-medium">
          Search File Details
        </h1>

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
          <label htmlFor="survey" className="w-60">
            Survey Number :
          </label>
          <Input placeholder="survey" id="survey" name="survey" ref={survey} />
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
          <label htmlFor="year" className="w-60">
            Year :
          </label>
          <Input placeholder="year" id="year" name="year" ref={year} />
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

        <Button className="w-full mt-4" onClick={searchItems}>
          Search
        </Button>
      </Card>
      <Card className="mt-6">
        <CardHeader className="py-2 px-4 flex flex-row items-center">
          <h1 className="text-xl">Search Result</h1>
          <div className="grow"></div>

          <div className="flex items-center bg-gray-100 rounded-md pl-2">
            <FluentMdl2Search />
            <input
              ref={searchRef}
              type="text"
              onChange={searchchange}
              className="bg-transparent outline-none focus:outline-none py-1 px-4"
              placeholder="Enter Search Text.."
            />
            {isSearch && (
              <button onClick={clearsearch} className=" p-2 text-black">
                <Fa6SolidXmark></Fa6SolidXmark>
              </button>
            )}
          </div>
        </CardHeader>
        {isSearch ? (
          paginationsearch.paginatedItems.length > 0 ? (
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
                  {paginationsearch.paginatedItems.map((val: any) => (
                    <TableRow key={val.id}>
                      <TableCell className="font-medium">{val.id}</TableCell>
                      <TableCell>{val.applicant_name}</TableCell>
                      <TableCell>{val.survey_number}</TableCell>
                      <TableCell>{val.year}</TableCell>
                      <TableCell>{val.type.name}</TableCell>
                      <TableCell>{val.village.name}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() =>
                            router.push(`/dashboard/viewfile/${val.id}`)
                          }
                        >
                          View
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
          )
        ) : search && searchData.length > 0 ? (
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
                {pagination.paginatedItems.map((val: any) => (
                  <TableRow key={val.id}>
                    <TableCell className="font-medium">{val.id}</TableCell>
                    <TableCell>{val.applicant_name}</TableCell>
                    <TableCell>{val.survey_number}</TableCell>
                    <TableCell>{val.year}</TableCell>
                    <TableCell>{val.type.name}</TableCell>
                    <TableCell>{val.village.name}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          router.push(`/dashboard/viewfile/${val.id}`)
                        }
                      >
                        View
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

        {isSearch
          ? paginationsearch.paginatedItems.length > 0 && (
              <div className="p-4">
                <Pagination
                  ChangePerPage={paginationsearch.ChangePerPage}
                  activePage={paginationsearch.activePage}
                  changeActivePage={paginationsearch.changeActivePage}
                  firstPage={paginationsearch.firstPage}
                  getMaxPage={paginationsearch.getMaxPage}
                  getTotalItemsLength={paginationsearch.getTotalItemsLength}
                  goToPage={paginationsearch.goToPage}
                  itemPerPage={paginationsearch.itemPerPage}
                  lastPage={paginationsearch.lastPage}
                  nextPage={paginationsearch.nextPage}
                  paginatedItems={paginationsearch.paginatedItems}
                  prevPage={paginationsearch.prevPage}
                  totalPages={paginationsearch.totalPages}
                ></Pagination>
              </div>
            )
          : pagination.paginatedItems.length > 0 && (
              <div className="p-4">
                <Pagination
                  ChangePerPage={pagination.ChangePerPage}
                  activePage={pagination.activePage}
                  changeActivePage={pagination.changeActivePage}
                  firstPage={pagination.firstPage}
                  getMaxPage={pagination.getMaxPage}
                  getTotalItemsLength={pagination.getTotalItemsLength}
                  goToPage={pagination.goToPage}
                  itemPerPage={pagination.itemPerPage}
                  lastPage={pagination.lastPage}
                  nextPage={pagination.nextPage}
                  paginatedItems={pagination.paginatedItems}
                  prevPage={pagination.prevPage}
                  totalPages={pagination.totalPages}
                ></Pagination>
              </div>
            )}
      </Card>
    </div>
  );
};
export default Search;
