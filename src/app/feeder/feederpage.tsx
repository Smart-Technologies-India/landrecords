/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import getFileType from "@/actions/getfiletype";
import getVillage from "@/actions/getvillage";
import fileSearch from "@/actions/searchfile";
import GetUser from "@/actions/user/getuser";
import logout from "@/actions/user/logout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { ApiResponseType } from "@/models/response";
import { useWindowSize } from "@uidotdev/usehooks";

import {
  file,
  file_type,
  physical_file_location,
  user,
  village,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import GetCupboardNumber from "@/actions/location/getcupboardnumber";
import GetAllCupboardNumber from "@/actions/location/getallcupboardnumber";
import addLocation from "@/actions/location/addlocation";

interface FeederPageProps {
  id: any;
  role: any;
}
const FeederPage = (props: FeederPageProps) => {
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(true);

  const [userdata, setUserData] = useState<user | null>(null);

  const [filetolocation, setFileToLocation] = useState<boolean>(true);

  const init = async () => {
    setLoading(true);
    const response = await GetUser({ id: parseInt(props.id) });
    if (response.status) {
      setUserData((val) => response.data);
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
          <div className="w-4"></div>
          <Button onClick={() => setFileToLocation(!filetolocation)}>
            {filetolocation ? "File To Location" : "Location To File"}
          </Button>
        </CardHeader>
      </Card>
      {filetolocation ? (
        <FileToLocation userid={userdata?.id!} />
      ) : (
        <LocationToFile userid={userdata?.id!} />
      )}
    </div>
  );
};

export default FeederPage;

const FileToLocation = (props: { userid: number }) => {
  const windowwidth = useWindowSize();

  const [userBox, setuserBox] = useState(false);

  const [villages, setVillages] = useState<village[]>([]);
  const [fileTypes, setFileTypes] = useState<file_type[]>([]);

  const [isSearch, setSearch] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<file[] | null>(null);
  const [fileType, setFileType] = useState<number>(0);
  const [village, setVillage] = useState<number>(0);

  const [fileid, setFileid] = useState<number>(0);

  const file_no = useRef<HTMLInputElement>(null);
  const old_file_no = useRef<HTMLInputElement>(null);
  const applicant_name = useRef<HTMLInputElement>(null);
  const survey = useRef<HTMLInputElement>(null);

  const init = async () => {
    const villages_response = await getVillage({});
    if (villages_response.status) {
      setVillages(villages_response.data!);
    }

    const file_type_response = await getFileType({});
    if (file_type_response.status) {
      setFileTypes(file_type_response.data!);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const search = async () => {
    const filesearch: ApiResponseType<file[] | null> = await fileSearch({
      file_id: file_no.current?.value,
      file_no: old_file_no.current?.value,
      applicant_name: applicant_name.current?.value,
      survey_number: survey.current?.value,
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

  return (
    <>
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
          <label htmlFor="old_file_no" className="w-60">
            Old File No :
          </label>
          <Input
            placeholder="Enter Old File No"
            id="old_file_no"
            name="old_file_no"
            ref={old_file_no}
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
                  <TableHead className="w-[100px]">File No</TableHead>
                  <TableHead className="w-[100px]">Old File No</TableHead>
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
                    <TableCell className="font-medium">{val.file_id}</TableCell>
                    <TableCell className="font-medium">{val.file_no}</TableCell>
                    <TableCell>{val.applicant_name}</TableCell>
                    <TableCell>{val.survey_number}</TableCell>
                    <TableCell>{val.year}</TableCell>
                    <TableCell>{val.type.name}</TableCell>
                    <TableCell>{val.village.name}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          setFileid(val.id);
                          setuserBox(true);
                        }}
                      >
                        Add Location
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
      {windowwidth.width! > 768 ? (
        <Dialog open={userBox} onOpenChange={setuserBox}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Location</DialogTitle>
            </DialogHeader>
            <LocationBox
              setUserBox={setuserBox}
              id={fileid}
              userid={props.userid}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={userBox} onOpenChange={setuserBox}>
          <DrawerTrigger asChild></DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Add Location</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <LocationBox
                setUserBox={setuserBox}
                id={fileid}
                userid={props.userid}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
      {/* popup end here */}
    </>
  );
};

interface LocationBoxProps {
  id: number;
  setUserBox: (val: boolean) => void;
  userid: number;
}
const LocationBox = (props: LocationBoxProps) => {
  const [locationId, setLocationid] = useState<number>(0);
  const [cupboardnumber, setcupboardnumber] = useState<string | null>(null);
  const [shelfnumber, setshelfnumber] = useState<string | null>(null);
  const [shelf_location, setShelfLocation] = useState<string | null>(null);

  const addlocation = async () => {
    if (cupboardnumber === null || shelfnumber === null) {
      toast.error("Please select location");
      return;
    }

    const response = await addLocation({
      fileid: props.id,
      locationid: locationId,
      userid: props.userid,
    });

    if (response.status) {
      toast.success("Location added successfully");
      props.setUserBox(false);
    } else {
      toast.error(response.message);
    }
    props.setUserBox(false);
  };

  const [cupboard_number, setCupboardNumber] = useState<
    physical_file_location[]
  >([]);
  const [shelf_number, setShelfNumber] = useState<physical_file_location[]>([]);

  useEffect(() => {
    console.log(props);
    const init = async () => {
      const file_location = await GetCupboardNumber({});
      if (file_location.status) {
        setCupboardNumber(file_location.data!);
      }
    };
    init();
  }, []);

  return (
    <>
      <div className="mt-4">
        <label>Cupboard Number</label>
        <Select
          onValueChange={async (val) => {
            if (val === null) return;
            setcupboardnumber(val);
            setshelfnumber(null);
            setShelfLocation(null);

            const alllocation = await GetAllCupboardNumber({});

            if (alllocation.status) {
              const shelf_number = alllocation.data?.filter(
                (value) => value.cupboard_numer?.toString() == val.toString()
              );
              setShelfNumber(shelf_number!);
            }
          }}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Select Cupboard Number" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Cupboard Number</SelectLabel>

              {cupboard_number.map((val) => (
                <SelectItem key={val.id} value={val.cupboard_numer!.toString()}>
                  {val.cupboard_numer}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {cupboardnumber !== null && (
        <div className="mt-4">
          <label>Shelf Number</label>
          <Select
            onValueChange={async (val) => {
              if (val === null) return;
              setshelfnumber(val);
              const shelf_location = shelf_number.filter(
                (value) =>
                  value.shelf_number?.toString() == val.toString() &&
                  value.cupboard_numer?.toString() == cupboardnumber
              );
              setShelfLocation(shelf_location[0].shelf_location);
              setLocationid(shelf_location[0].id);
            }}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select Shelf Number" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Shelf Number</SelectLabel>
                {cupboard_number.map((val) => (
                  <SelectItem
                    key={val.id}
                    value={val.cupboard_numer!.toString()}
                  >
                    {val.cupboard_numer}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      {shelf_location && (
        <div>
          <p className="text-lg font-medium">
            Shelf Location: {shelf_location}
          </p>
        </div>
      )}
      {locationId !== 0 && (
        <Button
          onClick={addlocation}
          className="w-full mt-4 text-center font-semibold text-white bg-black rounded-md block py-2 "
        >
          Add
        </Button>
      )}
    </>
  );
};

const LocationToFile = (props: { userid: number }) => {
  const [locationId, setLocationid] = useState<number>(0);
  const [cupboardnumber, setcupboardnumber] = useState<string | null>(null);
  const [shelfnumber, setshelfnumber] = useState<string | null>(null);
  const [shelf_location, setShelfLocation] = useState<string | null>(null);

  const [conform, setConform] = useState<boolean>(false);

  const addlocation = async () => {
    if (cupboardnumber === null || shelfnumber === null) {
      toast.error("Please select location");
      return;
    }

    setConform(true);
  };

  const [cupboard_number, setCupboardNumber] = useState<
    physical_file_location[]
  >([]);

  const [shelf_number, setShelfNumber] = useState<physical_file_location[]>([]);

  useEffect(() => {
    const init = async () => {
      const file_location = await GetCupboardNumber({});
      if (file_location.status) {
        setCupboardNumber(file_location.data!);
      }
    };
    init();
  }, []);

  const [villages, setVillages] = useState<village[]>([]);
  const [fileTypes, setFileTypes] = useState<file_type[]>([]);

  const [isSearch, setSearch] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<file[] | null>(null);
  const [fileType, setFileType] = useState<number>(0);
  const [village, setVillage] = useState<number>(0);

  const file_no = useRef<HTMLInputElement>(null);
  const old_file_no = useRef<HTMLInputElement>(null);
  const applicant_name = useRef<HTMLInputElement>(null);
  const survey = useRef<HTMLInputElement>(null);

  const init = async () => {
    const villages_response = await getVillage({});
    if (villages_response.status) {
      setVillages(villages_response.data!);
    }

    const file_type_response = await getFileType({});
    if (file_type_response.status) {
      setFileTypes(file_type_response.data!);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const search = async () => {
    const filesearch: ApiResponseType<file[] | null> = await fileSearch({
      file_id: file_no.current?.value,
      file_no: old_file_no.current?.value,
      applicant_name: applicant_name.current?.value,
      survey_number: survey.current?.value,
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

  return (
    <>
      <Card className=" h-full p-2 mt-4 px-6">
        <h1 className="text-center text-2xl font-medium">
          Search location Details
        </h1>
        <div className="mt-4">
          <label>Cupboard Number</label>
          <Select
            disabled={conform}
            onValueChange={async (val) => {
              if (val === null) return;
              setcupboardnumber(val);
              setshelfnumber(null);
              setShelfLocation(null);

              const alllocation = await GetAllCupboardNumber({});

              if (alllocation.status) {
                const shelf_number = alllocation.data?.filter(
                  (value) => value.cupboard_numer?.toString() == val.toString()
                );
                setShelfNumber(shelf_number!);
              }
            }}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select Cupboard Number" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Cupboard Number</SelectLabel>

                {cupboard_number.map((val) => (
                  <SelectItem
                    key={val.id}
                    value={val.cupboard_numer!.toString()}
                  >
                    {val.cupboard_numer}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {cupboardnumber !== null && (
          <div className="mt-4">
            <label>Shelf Number</label>
            <Select
              disabled={conform}
              onValueChange={async (val) => {
                if (val === null) return;
                setshelfnumber(val);
                const shelf_location = shelf_number.filter(
                  (value) =>
                    value.shelf_number?.toString() == val.toString() &&
                    value.cupboard_numer?.toString() == cupboardnumber
                );
                setShelfLocation(shelf_location[0].shelf_location);
                setLocationid(shelf_location[0].id);
              }}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select Shelf Number" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Shelf Number</SelectLabel>
                  {cupboard_number.map((val) => (
                    <SelectItem
                      key={val.id}
                      value={val.cupboard_numer!.toString()}
                    >
                      {val.cupboard_numer}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {shelf_location && (
          <div>
            <p className="text-lg font-medium">
              Shelf Location: {shelf_location}
            </p>
          </div>
        )}
        {locationId !== 0 && (
          <>
            {!conform && (
              <Button
                onClick={addlocation}
                className="w-full mt-4 text-center font-semibold text-white bg-black rounded-md block py-2 "
              >
                Confirm
              </Button>
            )}
          </>
        )}
      </Card>

      {conform && (
        <>
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
              <label htmlFor="old_file_no" className="w-60">
                Old File No :
              </label>
              <Input
                placeholder="Enter Old File No"
                id="old_file_no"
                name="old_file_no"
                ref={old_file_no}
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
              <Input
                placeholder="survey"
                id="survey"
                name="survey"
                ref={survey}
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
                      <TableHead className="w-[100px]">File No</TableHead>
                      <TableHead className="w-[100px]">Old File No</TableHead>
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
                        <TableCell className="font-medium">
                          {val.file_id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {val.file_no}
                        </TableCell>
                        <TableCell>{val.applicant_name}</TableCell>
                        <TableCell>{val.survey_number}</TableCell>
                        <TableCell>{val.year}</TableCell>
                        <TableCell>{val.type.name}</TableCell>
                        <TableCell>{val.village.name}</TableCell>
                        <TableCell>
                          <Button
                            onClick={async () => {
                              const response = await addLocation({
                                fileid: val.id,
                                locationid: locationId,
                                userid: props.userid,
                              });

                              if (response.status) {
                                toast.success("Location added successfully");
                              } else {
                                toast.error(response.message);
                              }
                            }}
                          >
                            Add Location
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
        </>
      )}
    </>
  );
};
