"use client";
import ASearchFile from "@/actions/dashboard/asearch";
import getFileType from "@/actions/getfiletype";
import getVillage from "@/actions/getvillage";
import { Fa6SolidXmark, FluentMdl2Search } from "@/components/icons";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
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
import { usePagination } from "@/hooks/usepagination";
import { ApiResponseType } from "@/models/response";
import { file, file_type, user, village } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const ASearch = () => {
  enum SearchType {
    VILLAGE_USER,
    VILLAGE_SURVAY,
    FILETYPE_VILLAGE,
    FILETYPE_USER,
    FILETEYPE_YEAR,
    VILLAGE_YEAR,
  }
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [villages, setVillages] = useState<village[]>([]);
  const [fileTypes, setFileTypes] = useState<file_type[]>([]);

  const [search, setSearch] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<any[]>([]);

  const pagination = usePagination(searchData);

  const [searchtype, setSearchType] = useState<SearchType>(
    SearchType.FILETEYPE_YEAR
  );

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

  const applicant_name = useRef<HTMLInputElement>(null);
  const survey = useRef<HTMLInputElement>(null);
  const year = useRef<HTMLInputElement>(null);

  const searchItems = async () => {
    if (searchtype === SearchType.VILLAGE_USER) {
      if (!village || village === 0) {
        toast.error("Village is required");
        return;
      }
      if (
        !applicant_name.current?.value ||
        applicant_name.current?.value === ""
      ) {
        toast.error("Applicant name is required");
        return;
      }

      const filesearch: ApiResponseType<file[] | null> = await ASearchFile({
        applicant_name: applicant_name.current?.value,
        villageId: village,
        searchtype: SearchType.VILLAGE_USER,
      });

      if (filesearch.status) {
        setSearchData(filesearch.data!);
        setSearch(true);
        toast.success("File search completed");
      } else {
        toast.error(filesearch.message);
      }
    } else if (searchtype === SearchType.VILLAGE_SURVAY) {
      if (!village || village === 0) {
        toast.error("Village is required");
        return;
      }

      if (!survey.current?.value || survey.current?.value === "") {
        toast.error("Survey number is required");
        return;
      }
      const filesearch: ApiResponseType<file[] | null> = await ASearchFile({
        survey_number: survey.current?.value,
        villageId: village,
        searchtype: SearchType.VILLAGE_SURVAY,
      });

      if (filesearch.status) {
        setSearchData(filesearch.data!);
        setSearch(true);
        toast.success("File search completed");
      } else {
        toast.error(filesearch.message);
      }
    } else if (searchtype === SearchType.FILETYPE_VILLAGE) {
      if (!village || village === 0) {
        toast.error("Village is required");
        return;
      }
      if (!fileType || fileType === 0) {
        toast.error("File Type is required");
        return;
      }
      const filesearch: ApiResponseType<file[] | null> = await ASearchFile({
        typeId: fileType,
        villageId: village,
        searchtype: SearchType.FILETYPE_VILLAGE,
      });

      if (filesearch.status) {
        setSearchData(filesearch.data!);
        setSearch(true);
        toast.success("File search completed");
      } else {
        toast.error(filesearch.message);
      }
    } else if (searchtype === SearchType.FILETEYPE_YEAR) {
      if (!year.current?.value || year.current?.value === "") {
        toast.error("Year is required");
        return;
      }

      if (!fileType || fileType === 0) {
        toast.error("File Type is required");
        return;
      }

      const filesearch: ApiResponseType<file[] | null> = await ASearchFile({
        year: year.current?.value,
        typeId: fileType,
        searchtype: SearchType.FILETEYPE_YEAR,
      });
      if (filesearch.status) {
        setSearchData(filesearch.data!);
        setSearch(true);
        toast.success("File search completed");
      } else {
        toast.error(filesearch.message);
      }
    } else if (searchtype === SearchType.FILETYPE_USER) {
      if (
        !applicant_name.current?.value ||
        applicant_name.current?.value === ""
      ) {
        toast.error("Applicant name is required");
        return;
      }
      if (!fileType || fileType === 0) {
        toast.error("File Type is required");
        return;
      }

      const filesearch: ApiResponseType<file[] | null> = await ASearchFile({
        applicant_name: applicant_name.current?.value,
        typeId: fileType,
        searchtype: SearchType.FILETYPE_USER,
      });

      if (filesearch.status) {
        setSearchData(filesearch.data!);
        setSearch(true);
        toast.success("File search completed");
      } else {
        toast.error(filesearch.message);
      }
    } else if (searchtype === SearchType.VILLAGE_YEAR) {
      if (!year.current?.value || year.current?.value === "") {
        toast.error("Year is required");
        return;
      }
      if (!village || village === 0) {
        toast.error("Village is required");
        return;
      }

      const filesearch: ApiResponseType<file[] | null> = await ASearchFile({
        year: year.current?.value,
        villageId: village,
        searchtype: SearchType.VILLAGE_YEAR,
      });

      if (filesearch.status) {
        setSearchData(filesearch.data!);
        setSearch(true);
        toast.success("File search completed");
      } else {
        toast.error(filesearch.message);
      }
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
    <div className="min-h-screen p-6 mx-auto bg-white">
      <h1 className="text-center text-2xl font-medium">Search File Details</h1>

      {!search && (
        <div className=" h-full p-2 w-4/6 mx-auto  px-10">
          <div className="flex gap-2 items-center mt-4">
            <label htmlFor="fileid" className="w-40 text-right">
              Select Criteria:
            </label>
            <div className="w-full">
              <Select
                onValueChange={(val) => {
                  if (val == SearchType.FILETEYPE_YEAR.toString()) {
                    setSearchType(SearchType.FILETEYPE_YEAR);
                  }
                  if (val == SearchType.VILLAGE_USER.toString()) {
                    setSearchType(SearchType.VILLAGE_USER);
                  }
                  if (val == SearchType.VILLAGE_SURVAY.toString()) {
                    setSearchType(SearchType.VILLAGE_SURVAY);
                  }
                  if (val == SearchType.FILETYPE_VILLAGE.toString()) {
                    setSearchType(SearchType.FILETYPE_VILLAGE);
                  }
                  if (val == SearchType.FILETYPE_USER.toString()) {
                    setSearchType(SearchType.FILETYPE_USER);
                  }
                  if (val == SearchType.VILLAGE_YEAR.toString()) {
                    setSearchType(SearchType.VILLAGE_YEAR);
                  }
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="File Type/Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Search Type</SelectLabel>
                    <SelectItem value={SearchType.FILETEYPE_YEAR.toString()}>
                      File Type/Year
                    </SelectItem>
                    <SelectItem value={SearchType.VILLAGE_USER.toString()}>
                      Village/User
                    </SelectItem>
                    <SelectItem value={SearchType.VILLAGE_SURVAY.toString()}>
                      Village/Survey
                    </SelectItem>
                    <SelectItem value={SearchType.FILETYPE_VILLAGE.toString()}>
                      File Type/Village
                    </SelectItem>
                    <SelectItem value={SearchType.FILETYPE_USER.toString()}>
                      File Type/User
                    </SelectItem>
                    <SelectItem value={SearchType.VILLAGE_YEAR.toString()}>
                      Village/Year
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {searchtype === SearchType.FILETYPE_VILLAGE ||
          searchtype == SearchType.FILETEYPE_YEAR ||
          searchtype == SearchType.FILETYPE_USER ? (
            <div className="flex gap-2 items-center mt-4">
              <label htmlFor="fileid" className="w-40 text-right">
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
          ) : (
            <></>
          )}

          {searchtype === SearchType.VILLAGE_SURVAY ||
          searchtype == SearchType.VILLAGE_USER ||
          searchtype == SearchType.FILETYPE_VILLAGE ||
          searchtype == SearchType.VILLAGE_YEAR ? (
            <div className="flex gap-2 items-center mt-4">
              <label htmlFor="fileid" className="w-40 text-right">
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
          ) : (
            <></>
          )}
          {searchtype === SearchType.VILLAGE_SURVAY && (
            <div className="flex gap-2 items-center  mt-4">
              <label htmlFor="survey" className="w-40 text-right">
                Survey Number :
              </label>
              <Input
                placeholder="survey"
                id="survey"
                name="survey"
                ref={survey}
              />
            </div>
          )}

          {searchtype === SearchType.VILLAGE_USER ||
          searchtype === SearchType.FILETYPE_USER ? (
            <div className="flex gap-2 items-center  mt-4">
              <label htmlFor="name" className="w-40 text-right">
                Applicant Name :
              </label>
              <Input
                placeholder="Enter Applicant Name"
                id="applicant_name"
                name="applicant_name"
                ref={applicant_name}
              />
            </div>
          ) : (
            <></>
          )}

          {searchtype === SearchType.FILETEYPE_YEAR ||
          searchtype == SearchType.VILLAGE_YEAR ? (
            <div className="flex gap-2 items-center  mt-4">
              <label htmlFor="year" className="w-40 text-right">
                Year :
              </label>
              <Input
                placeholder="Select Year"
                id="year"
                name="year"
                ref={year}
              />
            </div>
          ) : (
            <></>
          )}

          <div className="flex">
            <div className="grow"></div>
            <Button
              className="mt-4 bg-[#172e57] hover:bg-[#21437d]  w-40"
              onClick={searchItems}
            >
              Search
            </Button>
          </div>
        </div>
      )}

      {search && (
        <div className="mt-6">
          <CardHeader className="py-2 px-4 flex flex-row items-center gap-2">
            <h1 className="text-xl">Search Result</h1>
            <div className="grow"></div>

            <div className="flex gap-2 items-center bg-gray-100 rounded-md pl-2">
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
            <button
              onClick={() => setSearch(false)}
              className="text-white bg-rose-500 rounded h-8 px-2"
            >
              Clear Search
            </button>
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
                        <TableCell className="font-medium">
                          {val.file_id}
                        </TableCell>
                        <TableCell>{val.applicant_name}</TableCell>
                        <TableCell>{val.survey_number}</TableCell>
                        <TableCell>{val.year}</TableCell>
                        <TableCell>{val.type.name}</TableCell>
                        <TableCell>{val.village.name}</TableCell>
                        <TableCell>
                          <Link
                            target="_blank"
                            className="py-1 px-4 bg-[#172f57] text-white text-lg rounded-md"
                            href={`/dashboard/viewfile/${val.file_location}`}
                          >
                            View
                          </Link>
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
                      <TableCell className="font-medium">
                        {val.file_id}
                      </TableCell>
                      <TableCell>{val.applicant_name}</TableCell>
                      <TableCell>{val.survey_number}</TableCell>
                      <TableCell>{val.year}</TableCell>
                      <TableCell>{val.type.name}</TableCell>
                      <TableCell>{val.village.name}</TableCell>
                      <TableCell>
                        <Link
                          target="_blank"
                          className="py-1 px-4 bg-[#172f57] text-white text-lg rounded-md"
                          href={`/dashboard/viewfile/${val.file_location}`}
                        >
                          View
                        </Link>
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
        </div>
      )}
    </div>
  );
};
export default ASearch;
