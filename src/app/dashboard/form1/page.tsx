"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";

import {
  AntDesignPlusCircleOutlined,
  Fa6SolidXmark,
  FluentMdl2Search,
} from "@/components/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRouter } from "next/navigation";
import { usePagination } from "@/hooks/usepagination";
import Pagination from "@/components/pagination";
import Link from "next/link";
import getAllFrom1 from "@/actions/form1/getallfrom1";
import {
  form1,
  form1_acquisition,
  form1_family,
  form1_land,
  user,
} from "@prisma/client";
import { getCookie } from "cookies-next";
import GetUser from "@/actions/user/getuser";

const CreateAccountPage = () => {
  const router = useRouter();
  const id: number = parseInt(getCookie("id") ?? "0");
  const [userdata, setUpser] = useState<user>();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [allaccount, setAllAccount] = useState<
    Array<
      form1 & {
        form1_acquisition: form1_acquisition[];
        form1_family: form1_family[];
        form1_land: form1_land[];
      }
    >
  >([]);

  const [filterAccount, setFilterAccount] = useState<any[]>([]);

  // search and filter start from here

  const searchRef = useRef<HTMLInputElement>(null);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const [searchresult, setSearchresult] = useState<any[]>([]);

  const pagination = usePagination(filterAccount);

  const paginationsearch = usePagination(searchresult);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      const accountinfo = await getAllFrom1({});

      if (accountinfo.status) {
        setAllAccount(accountinfo.data!);
        setFilterAccount(accountinfo.data ?? []);
      } else {
        toast.error(accountinfo.message);
      }
      const userrespone = await GetUser({ id: id });
      if (userrespone.status) {
        setUpser(userrespone.data!);
      }
      setIsLoading(false);
    };

    init();
  }, [id]);

  const searchchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current) {
      if (searchRef.current.value.length > 0) {
        setIsSearch(true);

        setSearchresult(
          filterAccount.filter(
            (account: any) =>
              (account.holder_name !== null ? account.holder_name : "")
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              (account.residence_place !== null ? account.residence_place : "")
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              (account.celiling_applicable !== null
                ? account.celiling_applicable
                : ""
              )
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
    <div className="p-6">
      <div className="flex gap-2 items-center">
        <h1 className="text-[#162f57] text-2xl font-semibold">Form-1</h1>
        <div className="grow"></div>
        {["LDC", "SUPTD"].includes(userdata?.role!) && (
          <Link
            href={"/dashboard/form1/add"}
            className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm flex items-center gap-2  font-medium py-2"
          >
            <AntDesignPlusCircleOutlined className="text-white text-xl" />
            <p>Add</p>
          </Link>
        )}

        <div className="flex items-center bg-white rounded-md pl-2">
          <FluentMdl2Search />
          <input
            ref={searchRef}
            type="text"
            onChange={searchchange}
            className="bg-transparent outline-none focus:outline-none py-1 px-4"
            placeholder="Enter Search Text.."
          />
          {isSearch && (
            <button
              onClick={clearsearch}
              className=" p-2 text-black bg-white rounded-r"
            >
              <Fa6SolidXmark></Fa6SolidXmark>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-2 mt-4 shadow rounded">
        {filterAccount.length > 0 ? (
          <>
            <Table className="mt-2">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="w-[100px] p-2">InWard Number</TableHead>
                  <TableHead className="p-2">Holder Name</TableHead>
                  <TableHead className="p-2">Residence Place</TableHead>
                  <TableHead className="p-2">Celiling</TableHead>
                  <TableHead className="p-2">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(isSearch
                  ? paginationsearch.paginatedItems
                  : pagination.paginatedItems
                ).map((val: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium p-2">
                      {val.inward_number}
                    </TableCell>
                    <TableCell className="p-2">{val.holder_name}</TableCell>
                    <TableCell className="p-2">{val.residence_place}</TableCell>
                    <TableCell className="p-2">
                      {val.celiling_applicable}
                    </TableCell>
                    <TableCell className="flex gap-2 p-2">
                      {["LDC", "SUPTD"].includes(userdata?.role!) && (
                        <Button
                          onClick={() => {
                            router.push(`/dashboard/form1/view/${val.id}`);
                          }}
                          className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm flex items-center gap-2  font-medium py-2"
                        >
                          View
                        </Button>
                      )}

                      {["SUPTD"].includes(userdata?.role!) && !val.action_taken && (
                        <Button
                          onClick={() => {
                            router.push(`/dashboard/form1/generate/${val.id}`);
                          }}
                          className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm flex items-center gap-2  font-medium py-2"
                        >
                          Generate
                        </Button>
                      )}

                      {val.action_taken && (
                        <Button
                          onClick={() => {
                            router.push(`/dashboard/form1/download/${val.id}`);
                          }}
                          className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm flex items-center gap-2  font-medium py-2"
                        >
                          Download
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <>
            <div className="w-full grid place-items-center text-xl text-gray-600">
              No Forms Found.
            </div>
          </>
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
    </div>
  );
};
export default CreateAccountPage;
