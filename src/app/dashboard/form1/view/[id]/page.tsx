"use client";
import getFrom1 from "@/actions/form1/getform1";
import {
  form1,
  form1_acquisition,
  form1_family,
  form1_land,
} from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formateDate } from "@/utils/methods";

const AddRecord = () => {
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
      const [, whole, decimal] = area.match(/^0-(\d{2})\.(\d{2})$/) || [];
      if (whole && decimal) {
        totalWhole += parseInt(whole, 10); // Add the whole part
        totalDecimal += parseInt(decimal, 10); // Add the decimal part
      }
    });

    // Handle decimal overflow
    totalWhole += Math.floor(totalDecimal / 100);
    totalDecimal = totalDecimal % 100;

    // Format the result with two digits
    const result = `0-${String(totalWhole).padStart(2, "0")}.${String(
      totalDecimal
    ).padStart(2, "0")}`;
    return result;
  }

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );
  return (
    <div className="p-2 mt-2">
      <div className="bg-white p-2 shadow mt-2">
        <p className="text-xl font-medium leading-6 mb-2">Form-1</p>
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
                <TableCell className="p-2 border text-center">Total</TableCell>
                <TableCell className="p-2 border text-center">
                  {sumAreasFromForm(form1data.form1_acquisition)}
                </TableCell>
                <TableCell className="p-2 border text-center"></TableCell>
                <TableCell className="p-2 border text-center"></TableCell>
                <TableCell className="p-2 border text-center"></TableCell>
                <TableCell className="p-2 border text-center"></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="w-full flex gap-2 mt-2">
          <div className="grow"></div>
        </div>
      </div>
    </div>
  );
};

export default AddRecord;
