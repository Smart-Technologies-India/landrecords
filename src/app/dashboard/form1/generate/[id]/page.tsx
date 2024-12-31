"use client";
import getFrom1 from "@/actions/form1/getform1";
import {
  form1,
  form1_acquisition,
  form1_family,
  form1_land,
} from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formateDate } from "@/utils/methods";
import Link from "next/link";
import { Button as ShButton } from "@/components/ui/button";
import { Input } from "antd";
import { Input as ShInput } from "@/components/ui/input";
import { toast } from "react-toastify";
import uploadFile from "@/actions/upload";
import UpdateFrom1 from "@/actions/form1/updateform1";
import UpdateFrom1Gen from "@/actions/form1/updateform1gen";

const AddRecord = () => {
  const router = useRouter();
  const params = useParams();
  const id: number = parseInt(
    Array.isArray(params.id) ? params.id[0] : params.id
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [form1data, setForm1Data] = useState<
    form1 & {
      form1_acquisition: form1_acquisition[];
      form1_family: form1_family[];
      form1_land: form1_land[];
    }
  >();

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      const response = await getFrom1({
        id: id,
      });
      if (response.status && response.data) {
        setForm1Data(response.data);
        setRemark(response.data.remark ?? undefined);
        setActionTaken(response.data.action_taken);
      }
      setIsLoading(false);
    };
    init();
  }, [id]);
  function sumAreasFromForm(form1_land: any[]): string {
    let totalWhole = 0; // Total for the whole number part
    let totalDecimal = 0; // Total for the decimal part

    // Loop through the form1_land array and sum the areas
    form1_land.forEach((entry) => {
      const area = entry.area;
      const [, prefix, whole, decimal] =
        area.match(/^(\d+)-(\d{2})\.(\d{2})$/) || [];
      if (prefix && whole && decimal) {
        totalWhole += parseInt(prefix + whole, 10); // Add the whole part including the prefix
        totalDecimal += parseInt(decimal, 10); // Add the decimal part
      }
    });

    // Handle decimal overflow
    totalWhole += Math.floor(totalDecimal / 100);
    totalDecimal = totalDecimal % 100;

    // Extract the new prefix and whole parts
    const prefixPart = Math.floor(totalWhole / 100); // Determine the new prefix
    const wholePart = totalWhole % 100; // Remaining whole number part

    // Format the result with two digits
    const result = `${prefixPart}-${String(wholePart).padStart(
      2,
      "0"
    )}.${String(totalDecimal).padStart(2, "0")}`;
    return result;
  }

  const [isActionTaken, setActionTaken] = useState<boolean | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const cFile = useRef<HTMLInputElement>(null);

  const [remark, setRemark] = useState<string | undefined>(undefined);

  const longtext = (text: string, long: number): string => {
    if (text.length <= long) {
      return text;
    } else {
      return text.substring(0, long) + " ...";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const fileSize = selectedFile.size / (1024 * 1024);

      if (fileSize < 25) {
        if (
          selectedFile.type.startsWith("image/") ||
          selectedFile.type.startsWith("application/pdf")
        ) {
          setFile(selectedFile);
        } else {
          toast.error("Please select an image or pdf file.", {
            theme: "light",
          });
        }
      } else {
        toast.error("File size must be less than 5 MB.", { theme: "light" });
      }
    }
  };

  const addData = async () => {
    if (!form1data) return toast.error("There is no form exist");

    if (isActionTaken == null || isActionTaken == undefined)
      return toast.error("Enter Action.");
    if (remark == "" || remark == null || remark == undefined)
      return toast.error("Enter remark.");

    if (form1data!.form1_acquisition.length < 0)
      return toast.error("Add Acquisition.");

    if (isActionTaken == null) return toast.error("Select Action Taken.");

    let url: string | null = null;

    if (isActionTaken) {
      if (file == null) {
        return toast.error("Upload file.");
      } else {
        const formdata = new FormData();
        formdata.append("file", file);

        const response = await uploadFile(formdata);

        if (typeof response == "string") {
          url = response;
        } else {
          return toast.error("File Upload Faild.");
        }
      }
    }

    const response = await UpdateFrom1Gen({
      id: form1data.id,
      action: isActionTaken ? "YES" : "NO",
      action_taken: isActionTaken,
      url: url ?? undefined,
    });

    if (response.status) {
      toast.success("Form 1 Updated successfully");
      router.back();
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
    <div className="p-2 mt-2">
      <div className="bg-white p-2 shadow mt-2">
        <p className="text-xl font-medium text-center leading-6 mb-2">
          प्रशासन / Administration of <br /> संघ प्रदेश दादरा एवं नगर हवेली और
          दमन एवं दीव / <br />
          Dadra and Nager Haveli and Daman & Diu <br /> भूमि सुधार कार्यालय - 1
          / Land Reforms Office - 1 <br /> सिलवासा / Silvassa
        </p>
        <hr className="my-3" />
        <div className="flex gap-2 justify-between">
          <div className="grid place-items-center bg-gray-100 p-2 rounded flex-1">
            <p className="text-xs">Inward Number.</p>
            <p className="text-sm leading-4 font-semibold">
              {form1data && form1data.inward_number}
            </p>
          </div>
          <div className="grid place-items-center bg-gray-100 p-2 rounded flex-1">
            <p className="text-xs">Inward Date.</p>
            <p className="text-sm leading-4 font-semibold">
              {form1data &&
                form1data.date_of_inward &&
                formateDate(new Date(form1data.date_of_inward.toString()))}
            </p>
          </div>
          <div className="grid place-items-center bg-gray-100 p-2 rounded flex-1">
            <p className="text-xs">Holder Name</p>
            <p className="text-sm leading-4 font-semibold">
              {form1data && form1data.holder_name}
            </p>
          </div>
          <div className="grid place-items-center bg-gray-100 p-2 rounded flex-1">
            <p className="text-xs">Residence Place</p>
            <p className="text-sm leading-4 font-semibold">
              {form1data && form1data.residence_place}
            </p>
          </div>
          <div className="grid place-items-center bg-gray-100 p-2 rounded flex-1">
            <p className="text-xs">Celiling Applicable</p>
            <p className="text-sm leading-4 font-semibold">
              {form1data && form1data.celiling_applicable}
            </p>
          </div>
        </div>

        <p className="text-[#162e57] text-sm mt-2">
          Names of members of family and relationship to holder
        </p>
        <Table className="border mt-2">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="whitespace-nowrap w-10 border text-center p-1 h-8">
                No
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-96">
                Name
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8  w-64">
                Age
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-64">
                Relationship
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {form1data &&
              form1data.form1_family.map((val: form1_family, index: number) => (
                <TableRow key={index}>
                  <TableCell className="p-2 border text-left">
                    {index + 1}
                  </TableCell>
                  <TableCell className="p-2 border text-left">
                    {val.name}
                  </TableCell>
                  <TableCell className="p-2 border text-center">
                    {val.age}
                  </TableCell>
                  <TableCell className="p-2 border text-center">
                    {val.relationship}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <p className="text-[#162e57] text-sm mt-2">
          Details of land held before new acquisition
        </p>
        <Table className="border mt-2">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="whitespace-nowrap w-10 border text-center p-1 h-8">
                No
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-96">
                Village
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8  w-64">
                Survey Number
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-64">
                Area
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {form1data &&
              form1data.form1_land.map((val: form1_land, index: number) => (
                <TableRow key={index}>
                  <TableCell className="p-2 border text-left">
                    {index + 1}
                  </TableCell>
                  <TableCell className="p-2 border text-left">
                    {val.village}
                  </TableCell>
                  <TableCell className="p-2 border text-center">
                    {val.survey_no}
                  </TableCell>
                  <TableCell className="p-2 border text-center">
                    {val.area}
                  </TableCell>
                </TableRow>
              ))}
            {form1data && (
              <TableRow>
                <TableCell className="p-2 border text-left"></TableCell>
                <TableCell className="p-2 border text-left"></TableCell>
                <TableCell className="p-2 border text-center">Total</TableCell>
                <TableCell className="p-2 border text-center">
                  {sumAreasFromForm(form1data.form1_land)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <p className="text-[#162e57] text-sm mt-2">
          Details of land held before new acquisition
        </p>
        <Table className="border mt-2">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="whitespace-nowrap w-10 border text-center p-1 h-8">
                No
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-96">
                Village
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-23">
                Survey Number
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-32">
                Area
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-32">
                Type
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-32">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {form1data &&
              form1data.form1_acquisition.map(
                (val: form1_acquisition, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="p-2 border text-left">
                      {index + 1}
                    </TableCell>
                    <TableCell className="p-2 border text-left">
                      {val.village}
                    </TableCell>
                    <TableCell className="p-2 border text-center">
                      {val.survey_no}
                    </TableCell>
                    <TableCell className="p-2 border text-center">
                      {val.area}
                    </TableCell>
                    <TableCell className="p-2 border text-center">
                      {val.type}
                    </TableCell>
                    <TableCell className="p-2 border text-center">
                      {formateDate(val.date)}
                    </TableCell>
                  </TableRow>
                )
              )}
            {form1data && (
              <TableRow>
                <TableCell className="p-2 border text-left"></TableCell>
                <TableCell className="p-2 border text-center"></TableCell>
                <TableCell className="p-2 border text-center">Total</TableCell>
                <TableCell className="p-2 border text-center">
                  {sumAreasFromForm(form1data.form1_acquisition)}
                </TableCell>
                <TableCell className="p-2 border text-center"></TableCell>
                <TableCell className="p-2 border text-center"></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex gap-2 justify-between mt-2">
          <div className="grid place-items-center bg-gray-100 p-2 rounded flex-1">
            <p className="text-xs">Action</p>
            <p className="text-sm leading-4 font-semibold">
              {form1data && form1data.action}
            </p>
          </div>
          <div className="grid place-items-center bg-gray-100 p-2 rounded flex-1">
            <p className="text-xs">Remark</p>
            <p className="text-sm leading-3 font-semibold">
              {form1data && form1data.remark}
            </p>
          </div>
        </div>

        <div className="border rounded-md mt-10 p-3">
          <h1 className="text-center text-xl font-semibold">FORM 2</h1>
          <p className="text-center texxt-lg">(See Rule 6 (II))</p>
          <p className="text-left text-sm mt-4">
            Statement to be furnished under sub-section (2) of section 11 of the
            Dadra and Nagar Haveli Land Reforms Regulation, 1971.
          </p>
          <div className="mt-4"></div>

          <Table className="border mt-2">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="whitespace-nowrap border text-center p-1 h-8">
                  Action Taken
                </TableHead>
                <TableHead className="whitespace-nowrap border text-center p-1 h-8">
                  Remark
                </TableHead>

                {isActionTaken && (
                  <TableHead className="whitespace-nowrap border text-center p-1 h-8">
                    File Upload
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="p-2 border text-center">
                  <div className="flex gap-4 mt-1 items-center justify-center">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        value="yes"
                        checked={isActionTaken === true}
                        onChange={() => setActionTaken(true)}
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        value="no"
                        checked={isActionTaken === false}
                        onChange={() => setActionTaken(false)}
                      />
                      No
                    </label>
                  </div>
                </TableCell>
                <TableCell className="p-2 border text-center">
                  <Input.TextArea
                    value={remark}
                    name="remark"
                    onChange={(e) => {
                      setRemark(e.target.value);
                    }}
                    placeholder="Enter Remark"
                    required={true}
                    style={{ height: 80, resize: "none" }}
                  />
                </TableCell>
                {isActionTaken && (
                  <TableCell className="p-2 border text-center">
                    <div className="flex gap-4 flex-1 mt-2 items-center justify-center">
                      <p className="text-sm">
                        {file != null
                          ? longtext(file.name, 10)
                          : "No File Selected"}
                      </p>
                      <ShButton
                        onClick={() => cFile.current?.click()}
                        variant={"secondary"}
                        className="bg-gray-200 hover:bg-gray-300 h-8"
                      >
                        {file == null ? "Upload File" : "Change File"}
                      </ShButton>
                      {file != null && (
                        <Link
                          target="_blank"
                          href={URL.createObjectURL(file!)}
                          className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                        >
                          View File
                        </Link>
                      )}

                      {form1data && form1data.url && (
                        <Link
                          target="_blank"
                          href={form1data.url.replace("/public", "")}
                          className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                        >
                          View
                        </Link>
                      )}

                      <div className="hidden">
                        <ShInput
                          type="file"
                          ref={cFile}
                          accept="*/*"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="w-full flex gap-2 mt-2">
          <div className="grow"></div>
          <button
            type="submit"
            onClick={addData}
            className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecord;
