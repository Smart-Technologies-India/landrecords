"use client";
import {
    AddFrom1AcquisitionProvide,
  AddFrom1FamilyProvide,
  AddFrom1LandProvide,
  AddFrom1Provider,
} from "@/components/forms/form1";
import { useState } from "react";

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

  return (
    <div className="p-2 mt-2">
      <div className="bg-white p-2 shadow mt-2">
        <AddFrom1Provider
          form1_family={form1_family}
          form1_land={form1_land}
          form1_acquisition={form1_acquisition}
        />
        <AddFrom1FamilyProvide
          form1_family={form1_family}
          setform1_family={setform1_family}
        />
        <AddFrom1LandProvide
          form1_land={form1_land}
          setform1_land={setform1_land}
        />
        <AddFrom1AcquisitionProvide
          form1_acquisition={form1_acquisition}
          setform1_acquisition={setform1_acquisition}
        />
      </div>
    </div>
  );
};

export default AddRecord;
