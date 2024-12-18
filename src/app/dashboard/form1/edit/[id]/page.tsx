/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import getFrom1 from "@/actions/form1/getform1";

import {
  EditFrom1AcquisitionProvide,
  EditFrom1FamilyProvide,
  EditFrom1LandProvide,
  EditFrom1Provider,
} from "@/components/forms/form1edit";
import {
  form1,
  form1_acquisition,
  form1_family,
  form1_land,
} from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const AddRecord = () => {
  const params = useParams();
  const id: number = parseInt(
    Array.isArray(params.id) ? params.id[0] : params.id
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  interface Form1FamilyType {
    name: string;
    age: number;
    relationship: string;
  }

  interface Form1LandType {
    village: string;
    survey_no: string;
    area: string;
    remark?: string;
  }
  interface Form1AcquisitionType {
    village: string;
    survey_no: string;
    area: string;
    type: string;
    remark?: string;
    date: Date;
  }
  const [form1_family, setform1_family] = useState<Form1FamilyType[]>([]);
  const [form1_land, setform1_land] = useState<Form1LandType[]>([]);
  const [form1_acquisition, setform1_acquisition] = useState<
    Form1AcquisitionType[]
  >([]);

  const [form1data, setForm1Data] = useState<
    form1 & {
      form1_acquisition: form1_acquisition[];
      form1_family: form1_family[];
      form1_land: form1_land[];
    }
  >();
  interface DataType {
    inward: string;
    inward_date: Date | null;
    name: string;
    place: string;
    ceiling: string;
    remark: string;
  }

  const [data, setData] = useState<DataType>({
    ceiling: "",
    inward: "",
    inward_date: null,
    name: "",
    place: "",
    remark: "",
  });

  const init = async () => {
    const response = await getFrom1({
      id: id,
    });
    if (response.status && response.data) {
      setForm1Data(response.data);
      setData({
        remark: response.data.remark ?? "",
        ceiling: response.data.celiling_applicable ?? "",
        inward: response.data.inward_number ?? "",
        name: response.data.holder_name ?? "",
        place: response.data.residence_place ?? "",
        inward_date: data.inward_date,
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      const response = await getFrom1({
        id: id,
      });
      if (response.status && response.data) {
        setForm1Data(response.data);
        setData({
          remark: response.data.remark ?? "",
          ceiling: response.data.celiling_applicable ?? "",
          inward: response.data.inward_number ?? "",
          name: response.data.holder_name ?? "",
          place: response.data.residence_place ?? "",
          inward_date: new Date(response.data.date_of_inward!),
        });
      }
      setIsLoading(false);
    };
    init();
  }, []);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-2 mt-2">
      <div className="bg-white p-2 shadow mt-2">
        <h1 className="text-center text-xl font-semibold">FORM 1</h1>
        <p className="text-center texxt-lg">(See Rule 6 (I))</p>
        <p className="text-left text-sm mt-4">
          Statement to be furnished under sub-section (2) of section 11 of the
          Dadra and Nagar Haveli Land Reforms Regulation, 1971.
        </p>
        <div className="mt-4"></div>
        <EditFrom1Provider data={data} setData={setData} />
        <EditFrom1FamilyProvide
          form1_family={form1_family}
          setform1_family={setform1_family}
          form1_family_data={form1data ? form1data.form1_family : []}
          init={init}
          data={data}
          setData={setData}
        />
        <EditFrom1LandProvide
          form1_land={form1_land}
          setform1_land={setform1_land}
          form1_land_data={form1data ? form1data.form1_land : []}
          init={init}
        />
        <EditFrom1AcquisitionProvide
          id={id}
          form1_family={form1_family}
          form1_land={form1_land}
          form1_acquisition={form1_acquisition}
          form1_family_data={form1data ? form1data.form1_family : []}
          form1_land_data={form1data ? form1data.form1_land : []}
          form1_acquisition_data={form1data ? form1data.form1_acquisition : []}
          setform1_acquisition={setform1_acquisition}
          init={init}
          data={data}
          setData={setData}
        />
      </div>
    </div>
  );
};

export default AddRecord;
