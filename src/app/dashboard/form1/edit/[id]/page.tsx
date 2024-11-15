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

  const init = async () => {
    const response = await getFrom1({
      id: id,
    });
    if (response.status && response.data) {
      setForm1Data(response.data);
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
      }
      setIsLoading(false);
    };
    init();
  }, [id]);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-2 mt-2">
      <div className="bg-white p-2 shadow mt-2">
        <EditFrom1Provider
          form1_family={form1_family}
          form1_land={form1_land}
          form1_acquisition={form1_acquisition}
          form1_family_data={form1data ? form1data.form1_family : []}
          form1_land_data={form1data ? form1data.form1_land : []}
          form1_acquisition_data={form1data ? form1data.form1_acquisition : []}
          id={id}
        />
        <EditFrom1FamilyProvide
          form1_family={form1_family}
          setform1_family={setform1_family}
          form1_family_data={form1data ? form1data.form1_family : []}
          init={init}
        />
        <EditFrom1LandProvide
          form1_land={form1_land}
          setform1_land={setform1_land}
          form1_land_data={form1data ? form1data.form1_land : []}
          init={init}
        />
        <EditFrom1AcquisitionProvide
          form1_acquisition={form1_acquisition}
          setform1_acquisition={setform1_acquisition}
          form1_acquisition_data={form1data ? form1data.form1_acquisition : []}
          init={init}
        />
      </div>
    </div>
  );
};

export default AddRecord;
