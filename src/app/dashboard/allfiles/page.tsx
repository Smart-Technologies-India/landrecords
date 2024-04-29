"use client";
import GetAllFiles from "@/actions/files/getallfiles";
import {
  Fa6SolidXmark,
  FluentMdl2Search,
} from "@/components/icons";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePagination } from "@/hooks/usepagination";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const AllFiles = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const searchRef = useRef<HTMLInputElement>(null);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const [files, setFiles] = useState<any[]>([]);

  const [searchresult, setSearchresult] = useState<any[]>([]);

  const pagination = usePagination(files);

  const paginationsearch = usePagination(searchresult);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const response = await GetAllFiles({});
      if (response.status) {
        setFiles(response.data!);
      }

      setLoading(false);
    };
    init();
  }, []);

  const searchchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current) {
      if (searchRef.current.value.length > 0) {
        setIsSearch(true);

        setSearchresult(
          files.filter(
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
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-100">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen px-6 mx-auto">
      <Card className="mt-4">
        <CardHeader className="py-2 px-4 flex flex-row items-center gap-2">
          <h1 className="text-xl">All Files</h1>
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
                            router.push(`/dashboard/viewfile/${val.file_location}`)
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
        ) : pagination.paginatedItems.length > 0 ? (
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
                          router.push(`/dashboard/viewfile/${val.file_location}`)
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
export default AllFiles;
