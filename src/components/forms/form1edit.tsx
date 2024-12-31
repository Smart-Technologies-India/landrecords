/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { TaxtInput } from "./inputfields/textinput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { formateDate, onFormError } from "@/utils/methods";
import { getCookie } from "cookies-next";
import {
  Form1AcquisitionForm,
  Form1AcquisitionSchema,
  Form1FamilyForm,
  Form1FamilySchema,
  Form1LandForm,
  Form1LandSchema,
} from "@/schemas/form1";
import { toast } from "react-toastify";
import { DateSelect } from "./inputfields/dateselect";
import { useRouter } from "next/navigation";
import getFrom1 from "@/actions/form1/getform1";
import {
  form1,
  form1_acquisition,
  form1_family,
  form1_land,
  village,
} from "@prisma/client";
import {
  DeleteFrom1Acquisition,
  DeleteFrom1Family,
  DeleteFrom1Land,
} from "@/actions/form1/deleteforms";
import UpdateFrom1 from "@/actions/form1/updateform1";
import { FluentBinRecycle24Regular } from "../icons";
import { Button, DatePicker, Input, Select } from "antd";
import { Label } from "../ui/label";
import dayjs from "dayjs";
import { MultiSelect } from "./inputfields/multiselect";
import { OptionValue } from "@/models/main";
import getVillage from "@/actions/getvillage";
import Link from "next/link";
import { Input as ShInput } from "@/components/ui/input";
import { Button as ShButton } from "@/components/ui/button";
import uploadFile from "@/actions/upload";

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
  date: Date;
  remark?: string;
}

interface DataType {
  inward: string;
  inward_date: Date | null;
  name: string;
  place: string;
  ceiling: string;
  remark: string;
  // action: string;
}

type EditFrom1ProviderProps = {
  data: DataType;
  setData: Dispatch<SetStateAction<DataType>>;
};
export const EditFrom1Provider = (props: EditFrom1ProviderProps) => {
  return (
    <>
      <div className="flex gap-4 mt-1">
        <div className="flex-1">
          <div className="w-full flex flex-wrap">
            <Label htmlFor={"inward_number"} className="text-sm font-normal">
              Inward Number
              <span className="text-rose-500">*</span>
            </Label>
          </div>
          <Input
            value={props.data.inward}
            name="inward_number"
            onChange={(e) => {
              props.setData({ ...props.data, inward: e.target.value });
            }}
            placeholder="Enter Inward Number"
            required={true}
          />
        </div>
        <div className="flex-1">
          <div className="w-full flex flex-wrap">
            <Label htmlFor={"inward_number"} className="text-sm font-normal">
              Date of Inward
              <span className="text-rose-500">*</span>
            </Label>
          </div>
          <DatePicker
            onChange={(value: dayjs.Dayjs) => {
              props.setData({
                ...props.data,
                inward_date: value ? value.toDate() : null,
              });
            }}
            value={dayjs(props.data.inward_date)}
            className="w-full"
            placeholder="Select Date of Inward"
            format={"DD/MM/YYYY"}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-1">
        <div className="flex-1">
          <div className="w-full flex flex-wrap">
            <Label htmlFor={"name"} className="text-sm font-normal">
              1. Name of holder
              <span className="text-rose-500">*</span>
            </Label>
          </div>
          <Input
            value={props.data.name}
            name="name"
            onChange={(e) => {
              props.setData({ ...props.data, name: e.target.value });
            }}
            placeholder="Enter Name of the holder"
            required={true}
          />
        </div>
        <div className="flex-1">
          <div className="w-full flex flex-wrap">
            <Label htmlFor={"residence_place"} className="text-sm font-normal">
              2. Place of residence
              <span className="text-rose-500">*</span>
            </Label>
          </div>
          <Input
            value={props.data.place}
            name="residence_place"
            onChange={(e) => {
              props.setData({ ...props.data, place: e.target.value });
            }}
            placeholder="Enter Place of residence"
            required={true}
          />
        </div>
      </div>
    </>
  );
};

// const Form1Entry = (props: EditFrom1ProviderProps) => {
//   const id: number = parseInt(getCookie("id") ?? "0");
//   const router = useRouter();

//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const {
//     reset,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = useFormContext<Form1Form>();

//   const [form1data, setForm1Data] = useState<
//     form1 & {
//       form1_acquisition: form1_acquisition[];
//       form1_family: form1_family[];
//       form1_land: form1_land[];
//       data: DataType;
//       setData: Dispatch<SetStateAction<DataType>>;
//     }
//   >();

//   useEffect(() => {
//     const init = async () => {
//       setIsLoading(true);
//       const response = await getFrom1({
//         id: props.id,
//       });
//       if (response.status && response.data) {
//         setForm1Data(response.data);
//         reset({
//           remark: response.data.remark,
//           action: response.data.action,
//           sr_no: response.data.sr_no,
//           holder_name: response.data.holder_name,
//           celiling_applicable: response.data.celiling_applicable,
//           residence_place: response.data.residence_place,
//         });
//       }

//       setIsLoading(false);
//     };
//     init();
//   }, [props.id]);

//   const onSubmit = async (data: Form1Form) => {
//     if (props.form1_family.length < 0 && props.form1_family_data.length < 0)
//       return toast.error("Add Family and relationshiop to holder.");
//     if (props.form1_land.length < 0 && props.form1_land_data.length < 0)
//       return toast.error("Add Lands.");
//     if (
//       props.form1_acquisition.length < 0 &&
//       props.form1_acquisition_data.length < 0
//     )
//       return toast.error("Add Acquisition.");

//     const response = await UpdateFrom1({
//       id: props.id,
//       form1_acquisition: props.form1_acquisition,
//       form1_family: props.form1_family,
//       form1_land: props.form1_land,
//       holder_name: data.holder_name,
//       celiling_applicable: data.celiling_applicable,
//       residence_place: data.residence_place,
//       remark: data.remark ?? "",
//       sr_no: data.sr_no,
//       action: data.action ?? "",
//     });

//     if (response.status) {
//       toast.success("Record 30 Updated successfully");
//       router.back();
//     } else {
//       toast.error(response.message);
//     }
//   };

//   if (isLoading)
//     return (
//       <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
//         Loading...
//       </div>
//     );
//   return (
//     <>
//       <form onSubmit={handleSubmit(onSubmit, onFormError)}>
//         <div className="flex gap-4 mt-1">
//           <div className="flex-1">
//             <TaxtInput<Form1Form>
//               placeholder="Enter Sr Number"
//               name="sr_no"
//               required={true}
//               title="Sr. No."
//             />
//           </div>
//           <div className="flex-1">
//             <TaxtInput<Form1Form>
//               placeholder="Enter Name of the holder"
//               name="holder_name"
//               required={true}
//               title="Name of holder"
//             />
//           </div>
//         </div>
//         <div className="flex gap-4 mt-1">
//           <div className="flex-1">
//             <TaxtInput<Form1Form>
//               placeholder="Enter Place of residence"
//               name="residence_place"
//               required={true}
//               title="Place of residence"
//             />
//           </div>
//           <div className="flex-1">
//             <TaxtInput<Form1Form>
//               placeholder="Enter Ceiling applicable to holder/family"
//               name="celiling_applicable"
//               required={true}
//               title="Ceiling applicable to holder/family"
//             />
//           </div>
//         </div>

//         <div className="flex gap-4 mt-1">
//           <div className="flex-1">
//             <TaxtAreaInput<Form1Form>
//               name="action"
//               required={false}
//               title="Action"
//               placeholder="Action"
//             />
//           </div>
//           <div className="flex-1">
//             <TaxtAreaInput<Form1Form>
//               name="remark"
//               required={false}
//               title="Remark"
//               placeholder="Remark"
//             />
//           </div>
//         </div>

//         <div className="w-full flex gap-2 mt-2">
//           <div className="grow"></div>

//           <input
//             type="reset"
//             onClick={(e) => {
//               e.preventDefault();
//               reset({});
//             }}
//             value={"Reset"}
//             className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer"
//           />
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer"
//           >
//             {isSubmitting ? "Loading...." : "Update"}
//           </button>
//         </div>
//       </form>
//     </>
//   );
// };

//////////////////////////////////////////////////////////////////

type EditFrom1FamilyProviderProps = {
  form1_family: Form1FamilyType[];
  setform1_family: Dispatch<SetStateAction<Form1FamilyType[]>>;
  form1_family_data: form1_family[];
  init: () => Promise<void>;
  data: DataType;
  setData: Dispatch<SetStateAction<DataType>>;
};

export const EditFrom1FamilyProvide = (props: EditFrom1FamilyProviderProps) => {
  const methods = useForm<Form1FamilyForm>({
    resolver: valibotResolver(Form1FamilySchema),
  });

  return (
    <FormProvider {...methods}>
      <Form1FamilyEntry
        form1_family={props.form1_family}
        setform1_family={props.setform1_family}
        form1_family_data={props.form1_family_data}
        init={props.init}
        data={props.data}
        setData={props.setData}
      />
    </FormProvider>
  );
};

const Form1FamilyEntry = (props: EditFrom1FamilyProviderProps) => {
  const id: number = parseInt(getCookie("id") ?? "0");

  const {
    reset,
    handleSubmit,
    watch,
    getValues,
    formState: { isSubmitting },
  } = useFormContext<Form1FamilyForm>();

  const onSubmit = async (data: Form1FamilyForm) => {
    addForm1FamilyData({
      age: parseInt(data.age),
      name: data.name,
      relationship: data.relationship,
    });
    reset({});
  };

  // Add a new return data entry
  const addForm1FamilyData = (data: Form1FamilyType) => {
    props.setform1_family((prevData) => [...prevData, data]); // Append new data to the existing array
  };

  // Remove a return data entry by index
  const removeForm1FamilyData = (index: number) => {
    props.setform1_family((prevData) => prevData.filter((_, i) => i !== index)); // Remove data at the specified index
  };

  const delete_family = async (id: number) => {
    const response = await DeleteFrom1Family({
      id: id,
    });
    if (response.status && response.data) {
      props.init();
    } else {
      toast.error(response.message);
    }
  };
  const relation: OptionValue[] = [
    {
      label: "Mother",
      value: "Mother",
    },
    {
      label: "Father",
      value: "Father",
    },
    {
      label: "Son",
      value: "Son",
    },
    {
      label: "Daughter",
      value: "Daughter",
    },
    {
      label: "Husband",
      value: "Husband",
    },
    {
      label: "Wife",
      value: "Wife",
    },
    {
      label: "Other",
      value: "Other",
    },
  ];

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onFormError)}>
        <p className="text-[#162e57] text-sm mt-2">
          3. Names of members of family and relationship to holder
        </p>
        <Table className="border mt-2">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="whitespace-nowrap w-10 border text-center p-1 h-8">
                No
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8  min-w-80">
                Name
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8  w-64">
                Age
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-64">
                Relationship
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.form1_family_data.map((val: form1_family, index: number) => (
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
                <TableCell className="p-2 border text-center">
                  <FluentBinRecycle24Regular
                    onClick={(e) => {
                      e.preventDefault();
                      delete_family(val.id);
                    }}
                    className="rounded-md text-2xl text-rose-500 cursor-pointer text-center"
                  />
                </TableCell>
              </TableRow>
            ))}
            {props.form1_family.map((val: Form1FamilyType, index: number) => (
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
                <TableCell className="p-2 border text-center">
                  <FluentBinRecycle24Regular
                    onClick={(e) => {
                      e.preventDefault();
                      removeForm1FamilyData(index);
                    }}
                    className="rounded-md text-2xl text-rose-500 cursor-pointer text-center"
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="p-2 border text-center"></TableCell>
              <TableCell className="p-2 border text-center">
                <TaxtInput<Form1FamilyForm>
                  name="name"
                  required={true}
                  placeholder="Enter Name"
                />
              </TableCell>
              <TableCell className="p-2 border text-center">
                <TaxtInput<Form1FamilyForm>
                  name="age"
                  required={true}
                  placeholder="Enter Age"
                  onlynumber={true}
                  numdes
                />
              </TableCell>
              <TableCell className="p-2 border text-center">
                <MultiSelect<Form1FamilyForm>
                  name="relationship"
                  required={true}
                  placeholder="Enter Relationship"
                  options={relation}
                  isOther={true}
                />
              </TableCell>
              <TableCell className="p-2 border text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer"
                >
                  {isSubmitting ? "Loading...." : "Add"}
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </form>
      <div className="w-full mt-2">
        <div className="w-full flex flex-wrap">
          <Label htmlFor={"ceiling"} className="text-sm font-normal">
            4. Ceiling applicable to holder/family
            <span className="text-rose-500">*</span>
          </Label>
        </div>
        <Select
          showSearch={true}
          className="w-full"
          onChange={(value: string) => {
            props.setData({ ...props.data, ceiling: value });
          }}
          options={[
            {
              label: "YES",
              value: "YES",
            },
            {
              label: "NO",
              value: "NO",
            },
          ]}
          value={props.data.ceiling}
          placeholder="Enter Ceiling applicable to holder/family"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
      </div>
    </>
  );
};

/////////////////////////////////////////////////////

type EditFrom1LandProviderProps = {
  form1_land: Form1LandType[];
  setform1_land: Dispatch<SetStateAction<Form1LandType[]>>;
  form1_land_data: form1_land[];
  init: () => Promise<void>;
};

export const EditFrom1LandProvide = (props: EditFrom1LandProviderProps) => {
  const methods = useForm<Form1LandForm>({
    resolver: valibotResolver(Form1LandSchema),
  });

  return (
    <FormProvider {...methods}>
      <Form1LandEntry
        form1_land={props.form1_land}
        setform1_land={props.setform1_land}
        form1_land_data={props.form1_land_data}
        init={props.init}
      />
    </FormProvider>
  );
};

const Form1LandEntry = (props: EditFrom1LandProviderProps) => {
  const id: number = parseInt(getCookie("id") ?? "0");

  const {
    reset,
    handleSubmit,
    watch,
    getValues,
    formState: { isSubmitting },
  } = useFormContext<Form1LandForm>();

  const onSubmit = async (data: Form1LandForm) => {
    addForm1LandData({
      area: data.area,
      survey_no: data.survey_no,
      village: data.village,
      remark: data.remark ?? "",
    });
    reset({});
  };

  // Add a new return data entry
  const addForm1LandData = (data: Form1LandType) => {
    props.setform1_land((prevData) => [...prevData, data]); // Append new data to the existing array
  };

  // Remove a return data entry by index
  const removeForm1LandData = (index: number) => {
    props.setform1_land((prevData) => prevData.filter((_, i) => i !== index)); // Remove data at the specified index
  };

  const delete_land = async (id: number) => {
    const response = await DeleteFrom1Land({
      id: id,
    });
    if (response.status && response.data) {
      props.init();
    } else {
      toast.error(response.message);
    }
  };

  const [isLoading, setLoading] = useState<boolean>(true);

  const [villages, setVillages] = useState<village[]>([]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const villages_response = await getVillage({});
      if (villages_response.status) {
        setVillages(villages_response.data!);
      }

      setLoading(false);
    };
    init();
  }, []);

  function sumAreasFromForm(form1_land: any[], form1_land_data: any[]): string {
    let totalWhole = 0; // Total for the whole number part
    let totalDecimal = 0; // Total for the decimal part

    // Combine the areas from form1_land and form1_land_data
    const combinedAreas = [...form1_land, ...form1_land_data];

    // Loop through the combined array and sum the areas
    combinedAreas.forEach((entry) => {
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onFormError)}>
        <p className="text-[#162e57] text-sm mt-2">
          5. Details of land held before new acquisition
        </p>
        <Table className="border mt-2">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="whitespace-nowrap w-10 border text-center p-1 h-8">
                No
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8  min-w-80">
                Name of Village
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8  w-64">
                Survey Number/Sub-Division
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-64">
                Area
              </TableHead>

              <TableHead className="whitespace-nowrap border text-center p-1 h-8">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.form1_land.map((val: Form1LandType, index: number) => (
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
                  <FluentBinRecycle24Regular
                    onClick={(e) => {
                      e.preventDefault();
                      removeForm1LandData(index);
                    }}
                    className="rounded-md text-2xl text-rose-500 cursor-pointer text-center"
                  />
                </TableCell>
              </TableRow>
            ))}
            {props.form1_land_data.map((val: form1_land, index: number) => (
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
                  <FluentBinRecycle24Regular
                    onClick={(e) => {
                      e.preventDefault();
                      delete_land(val.id);
                    }}
                    className="rounded-md text-2xl text-rose-500 cursor-pointer text-center"
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="p-2 border text-center"></TableCell>
              <TableCell className="p-2 border text-center">
                <MultiSelect<Form1LandForm>
                  name="village"
                  required={true}
                  placeholder="Enter Village"
                  options={villages.map((val: village) => ({
                    label: val.name,
                    value: val.name,
                  }))}
                />
              </TableCell>
              <TableCell className="p-2 border text-center">
                <TaxtInput<Form1LandForm>
                  name="survey_no"
                  required={true}
                  placeholder="Enter Survey No"
                  onlynumber={true}
                  numdes
                />
              </TableCell>
              <TableCell className="p-2 border text-center">
                <TaxtInput<Form1LandForm>
                  name="area"
                  required={true}
                  placeholder="Enter Area"
                />
              </TableCell>

              <TableCell className="p-2 border text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer"
                >
                  {isSubmitting ? "Loading...." : "Add"}
                </button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="p-2 border text-left"></TableCell>
              <TableCell className="p-2 border text-left"></TableCell>
              <TableCell className="p-2 border text-center">Total</TableCell>
              <TableCell className="p-2 border text-center">
                {sumAreasFromForm(props.form1_land, props.form1_land_data)}
              </TableCell>
              <TableCell className="p-2 border text-center"></TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="w-full flex gap-2 mt-2">
          <div className="grow"></div>
        </div>
      </form>
    </>
  );
};

////////////////////////////////////////////////////

type EditFrom1AcquisitionProviderProps = {
  id: number;
  form1_family: Form1FamilyType[];
  form1_land: Form1LandType[];
  form1_acquisition: Form1AcquisitionType[];
  form1_family_data: form1_family[];
  form1_land_data: form1_land[];
  form1_acquisition_data: form1_acquisition[];
  setform1_acquisition: Dispatch<SetStateAction<Form1AcquisitionType[]>>;
  init: () => Promise<void>;
  data: DataType;
  setData: Dispatch<SetStateAction<DataType>>;
};

export const EditFrom1AcquisitionProvide = (
  props: EditFrom1AcquisitionProviderProps
) => {
  const methods = useForm<Form1AcquisitionForm>({
    resolver: valibotResolver(Form1AcquisitionSchema),
  });

  return (
    <FormProvider {...methods}>
      <Form1AcquisitionEntry
        id={props.id}
        form1_family={props.form1_family}
        form1_land={props.form1_land}
        form1_acquisition={props.form1_acquisition}
        form1_acquisition_data={props.form1_acquisition_data}
        form1_family_data={props.form1_family_data}
        form1_land_data={props.form1_land_data}
        setform1_acquisition={props.setform1_acquisition}
        init={props.init}
        data={props.data}
        setData={props.setData}
      />
    </FormProvider>
  );
};

const Form1AcquisitionEntry = (props: EditFrom1AcquisitionProviderProps) => {
  const id: number = parseInt(getCookie("id") ?? "0");
  const router = useRouter();
  const {
    reset,
    handleSubmit,
    watch,
    getValues,
    formState: { isSubmitting },
  } = useFormContext<Form1AcquisitionForm>();

  const onSubmit = async (data: Form1AcquisitionForm) => {
    addForm1AcquisitionData({
      area: data.area,
      survey_no: data.survey_no,
      village: data.village,
      type: data.type,
      date: new Date(data.date),
      remark: data.remark ?? "",
    });
    reset({});
  };

  // Add a new return data entry
  const addForm1AcquisitionData = (data: Form1AcquisitionType) => {
    props.setform1_acquisition((prevData) => [...prevData, data]); // Append new data to the existing array
  };

  // Remove a return data entry by index
  const removeForm1AcquisitionData = (index: number) => {
    props.setform1_acquisition((prevData) =>
      prevData.filter((_, i) => i !== index)
    ); // Remove data at the specified index
  };

  const delete_acquisition = async (id: number) => {
    const response = await DeleteFrom1Acquisition({
      id: id,
    });
    if (response.status && response.data) {
      props.init();
    } else {
      toast.error(response.message);
    }
  };

  const [isLoading, setLoading] = useState<boolean>(true);

  const [villages, setVillages] = useState<village[]>([]);

  const [form1data, setForm1Data] = useState<
    form1 & {
      form1_acquisition: form1_acquisition[];
      form1_family: form1_family[];
      form1_land: form1_land[];
    }
  >();

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const villages_response = await getVillage({});
      if (villages_response.status) {
        setVillages(villages_response.data!);
      }

      const response = await getFrom1({
        id: props.id,
      });
      if (response.status && response.data) {
        setForm1Data(response.data);

        setActionTaken(response.data.action_taken ?? false);
      }

      setLoading(false);
    };
    init();
  }, [props.id]);

  const addData = async () => {
    console.log(props.data);
    if (
      props.data.inward == "" ||
      props.data.inward == null ||
      props.data.inward == undefined
    )
      return toast.error("Enter Inward Number.");

    if (props.data.inward_date == null || props.data.inward_date == undefined)
      return toast.error("Select Inward Date.");

    if (
      props.data.name == "" ||
      props.data.name == null ||
      props.data.name == undefined
    )
      return toast.error("Enter Name of holder.");

    if (
      props.data.place == "" ||
      props.data.place == null ||
      props.data.place == undefined
    )
      return toast.error("Enter Place of residence.");

    if (props.form1_family.length < 0 && props.form1_family_data.length < 0)
      return toast.error("Add Family and relationshiop to holder.");
    if (
      props.data.ceiling == "" ||
      props.data.ceiling == null ||
      props.data.ceiling == undefined
    )
      return toast.error("Enter Ceiling applicable to holder/family.");

    // if (
    //   props.data.action == "" ||
    //   props.data.action == null ||
    //   props.data.action == undefined
    // )
    //   return toast.error("Enter Action.");
    if (
      props.data.remark == "" ||
      props.data.remark == null ||
      props.data.remark == undefined
    )
      return toast.error("Enter remark.");

    if (props.form1_land.length < 0 && props.form1_land_data.length < 0)
      return toast.error("Add Lands.");
    if (
      props.form1_acquisition.length < 0 &&
      props.form1_acquisition_data.length < 0
    )
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

    const response = await UpdateFrom1({
      id: props.id,
      form1_acquisition: props.form1_acquisition,
      form1_family: props.form1_family,
      form1_land: props.form1_land,
      holder_name: props.data.name,
      celiling_applicable: props.data.ceiling,
      residence_place: props.data.place,
      remark: props.data.remark,
      date_of_inward: props.data.inward_date.toISOString(),
      inward_number: props.data.inward,
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
  const [isActionTaken, setActionTaken] = useState<boolean | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const cFile = useRef<HTMLInputElement>(null);

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
  function sumAreasFromForm(form1_land: any[], form1_land_data: any[]): string {
    let totalWhole = 0; // Total for the whole number part
    let totalDecimal = 0; // Total for the decimal part

    // Combine the areas from form1_land and form1_land_data
    const combinedAreas = [...form1_land, ...form1_land_data];

    // Loop through the combined array and sum the areas
    combinedAreas.forEach((entry) => {
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onFormError)}>
        <p className="text-[#162e57] text-sm mt-2">
          6. Details of new acquisition
        </p>
        <Table className="border mt-2">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="whitespace-nowrap w-10 border text-center p-1 h-8">
                No
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-64">
                Date of acquisition
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-64">
                Area of land
                <br />
                acquired
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8  min-w-80">
                Village in which
                <br />
                land is situated
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8  w-64">
                Survey Number
                <br />
                Sub-divistion
              </TableHead>

              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-64">
                Nature of acquisition.
                <br />
                i.e. whether by sale,
                <br />
                gift, inheritance etc.
              </TableHead>

              <TableHead className="whitespace-nowrap border text-center p-1 h-8">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.form1_acquisition_data.map(
              (val: form1_acquisition, index: number) => (
                <TableRow key={index}>
                  <TableCell className="p-2 border text-left">
                    {index + 1}
                  </TableCell>
                  <TableCell className="p-2 border text-center">
                    {formateDate(val.date)}
                  </TableCell>
                  <TableCell className="p-2 border text-center">
                    {val.area}
                  </TableCell>

                  <TableCell className="p-2 border text-left">
                    {val.village}
                  </TableCell>
                  <TableCell className="p-2 border text-center">
                    {val.survey_no}
                  </TableCell>

                  <TableCell className="p-2 border text-center">
                    {val.type}
                  </TableCell>

                  <TableCell className="p-2 border text-center">
                    <FluentBinRecycle24Regular
                      onClick={(e) => {
                        e.preventDefault();
                        delete_acquisition(val.id);
                      }}
                      className="rounded-md text-2xl text-rose-500 cursor-pointer text-center"
                    />
                  </TableCell>
                </TableRow>
              )
            )}
            {props.form1_acquisition.map(
              (val: Form1AcquisitionType, index: number) => (
                <TableRow key={index}>
                  <TableCell className="p-2 border text-left">
                    {index + 1}
                  </TableCell>
                  <TableCell className="p-2 border text-center">
                    {formateDate(val.date)}
                  </TableCell>
                  <TableCell className="p-2 border text-center">
                    {val.area}
                  </TableCell>
                  <TableCell className="p-2 border text-left">
                    {val.village}
                  </TableCell>
                  <TableCell className="p-2 border text-center">
                    {val.survey_no}
                  </TableCell>

                  <TableCell className="p-2 border text-center">
                    {val.type}
                  </TableCell>

                  <TableCell className="p-2 border text-center">
                    <FluentBinRecycle24Regular
                      onClick={(e) => {
                        e.preventDefault();
                        removeForm1AcquisitionData(index);
                      }}
                      className="rounded-md text-2xl text-rose-500 cursor-pointer text-center"
                    />
                  </TableCell>
                </TableRow>
              )
            )}
            <TableRow>
              <TableCell className="p-2 border text-center"></TableCell>
              <TableCell className="p-2 border text-center">
                <DateSelect<Form1AcquisitionForm>
                  name="date"
                  required={true}
                  placeholder="Select Date"
                />
              </TableCell>
              <TableCell className="p-2 border text-center">
                <TaxtInput<Form1AcquisitionForm>
                  name="area"
                  required={true}
                  placeholder="Enter Area"
                />
              </TableCell>
              <TableCell className="p-2 border text-center">
                <MultiSelect<Form1LandForm>
                  name="village"
                  required={true}
                  placeholder="Enter Village"
                  options={villages.map((val: village) => ({
                    label: val.name,
                    value: val.name,
                  }))}
                />
              </TableCell>
              <TableCell className="p-2 border text-center">
                <TaxtInput<Form1AcquisitionForm>
                  name="survey_no"
                  required={true}
                  placeholder="Enter Survey No"
                  onlynumber={true}
                  numdes
                />
              </TableCell>

              <TableCell className="p-2 border text-center">
                <TaxtInput<Form1AcquisitionForm>
                  name="type"
                  required={true}
                  placeholder="Enter Nature"
                />
              </TableCell>

              <TableCell className="p-2 border text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer"
                >
                  {isSubmitting ? "Loading...." : "Add"}
                </button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="p-2 border text-left"></TableCell>
              <TableCell className="p-2 border text-center">Total</TableCell>
              <TableCell className="p-2 border text-center">
                {sumAreasFromForm(
                  props.form1_acquisition_data,
                  props.form1_acquisition
                )}
              </TableCell>
              <TableCell className="p-2 border text-center"></TableCell>
              <TableCell className="p-2 border text-center"></TableCell>
              <TableCell className="p-2 border text-center"></TableCell>
              <TableCell className="p-2 border text-center"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </form>
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
                  value={props.data.remark}
                  name="remark"
                  onChange={(e) => {
                    props.setData({ ...props.data, remark: e.target.value });
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
                        href={form1data.url}
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

        {/* <div className="flex gap-4 mt-1">
          <div className="flex-1">
            <Label className="text-sm font-normal">
              Action Taken
              <span className="text-rose-500">*</span>
            </Label>
            <div className="flex gap-4 mt-1 items-center">
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
          </div>
          <div className="flex-1">
            <div className="w-full flex flex-wrap">
              <Label htmlFor={"remark"} className="text-sm font-normal">
                Remark
                <span className="text-rose-500">*</span>
              </Label>
            </div>
            <Input.TextArea
              value={props.data.remark}
              name="remark"
              onChange={(e) => {
                props.setData({ ...props.data, remark: e.target.value });
              }}
              placeholder="Enter Remark"
              required={true}
              style={{ height: 80, resize: "none" }}
            />
          </div>
          <div className="flex-1">
            {isActionTaken && (
              <>
                <Label className="text-sm font-normal">Upload File</Label>
                <div className="flex gap-4 flex-1 mt-2 items-center bg-gray-100 px-2 py-2 rounded-sm">
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

                  <div className="hidden">
                    <ShInput
                      type="file"
                      ref={cFile}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div> */}
      </div>

      <div className="flex gap-4 mt-1">
        <div className="flex-1"></div>

        <div className="w-full flex gap-2 mt-2">
          <div className="grow"></div>
          <button
            type="submit"
            onClick={addData}
            disabled={isSubmitting}
            className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer"
          >
            {isSubmitting ? "Loading...." : "Submit"}
          </button>
        </div>
      </div>
    </>
  );
};
