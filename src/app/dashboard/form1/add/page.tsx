"use client";
import {
  AddFrom1AcquisitionProvide,
  AddFrom1FamilyProvide,
  AddFrom1LandProvide,
  AddFrom1Provider,
} from "@/components/forms/form1";
import { InputRef } from "antd";
import { useRef, useState } from "react";

const AddRecord = () => {
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

  interface DataType {
    inward: string;
    inward_date: Date | null;
    name: string;
    place: string;
    ceiling: string;
    remark: string;
    action: string;
  }

  const [data, setData] = useState<DataType>({
    action: "",
    ceiling: "",
    inward: "",
    inward_date: null,
    name: "",
    place: "",
    remark: "",
  });

  const [file, setFile] = useState<File | null>(null);

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
        <AddFrom1Provider data={data} setData={setData} file={file} />
        <AddFrom1FamilyProvide
          form1_family={form1_family}
          setform1_family={setform1_family}
          data={data}
          setData={setData}
        />
        <AddFrom1LandProvide
          form1_land={form1_land}
          setform1_land={setform1_land}
        />
        <AddFrom1AcquisitionProvide
          form1_family={form1_family}
          form1_land={form1_land}
          form1_acquisition={form1_acquisition}
          setform1_acquisition={setform1_acquisition}
          data={data}
          setData={setData}
          file={file}
          setFile={setFile}
        />
      </div>
    </div>
  );
};

export default AddRecord;
