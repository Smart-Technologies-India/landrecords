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
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { formateDate, onFormError } from "@/utils/methods";
import { getCookie } from "cookies-next";
import {
  Form1AcquisitionForm,
  Form1AcquisitionSchema,
  Form1FamilyForm,
  Form1FamilySchema,
  Form1Form,
  Form1LandForm,
  Form1LandSchema,
  Form1Schema,
} from "@/schemas/form1";
import { toast } from "react-toastify";
import { DateSelect } from "./inputfields/dateselect";
import AddFrom1 from "@/actions/form1/addform1";
import { useRouter } from "next/navigation";
import { village } from "@prisma/client";
import getVillage from "@/actions/getvillage";
import { MultiSelect } from "./inputfields/multiselect";
import { OptionValue } from "@/models/main";
import { DatePicker, Input, InputRef, Select } from "antd";
import { Label } from "../ui/label";
import dayjs from "dayjs";
import { propagateServerField } from "next/dist/server/lib/render-server";
import { Router } from "lucide-react";
import { Input as ShInput } from "@/components/ui/input";
import Link from "next/link";
import { Button as ShButton } from "@/components/ui/button";
import uploadFile from "@/actions/upload";

interface DataType {
  inward: string;
  inward_date: Date | null;
  name: string;
  place: string;
  ceiling: string;
  remark: string;
  action: string;
}
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

type AddFrom1ProviderProps = {
  data: DataType;
  setData: Dispatch<SetStateAction<DataType>>;
  file: File | null;
};

export const AddFrom1Provider = (props: AddFrom1ProviderProps) => {
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
            className="w-full"
            placeholder="Select Date of Inward"
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

const Form1Entry = (props: AddFrom1ProviderProps) => {
  const id: number = parseInt(getCookie("id") ?? "0");
  const router = useRouter();

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext<Form1Form>();

  return (
    <>
      {/* <form onSubmit={handleSubmit(onSubmit, onFormError)}> */}
      <div className="flex gap-4 mt-1">
        <div className="flex-1">
          <TaxtInput<Form1Form>
            placeholder="Enter Inward Number"
            name="inward_number"
            required={true}
            title="Inward Number"
          />
        </div>
        <div className="flex-1">
          <DateSelect<Form1Form>
            placeholder="Select Date of Inward"
            name="date_of_inward"
            required={true}
            title="Date of Inward"
          />
        </div>
      </div>
      <div className="flex gap-4 mt-1">
        <div className="flex-1">
          <TaxtInput<Form1Form>
            placeholder="Enter Name of the holder"
            name="holder_name"
            required={true}
            title="1. Name of holder"
          />
        </div>
        <div className="flex-1">
          <TaxtInput<Form1Form>
            placeholder="Enter Place of residence"
            name="residence_place"
            required={true}
            title="2. Place of residence"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-1">
        {/* <div className="flex-1">
            <TaxtInput<Form1Form>
              placeholder="Enter Sr Number"
              name="sr_no"
              required={true}
              title="1. Sr. No."
            />
          </div> */}

        {/* <div className="flex-1">
            <TaxtInput<Form1Form>
              placeholder="Enter Ceiling applicable to holder/family"
              name="celiling_applicable"
              required={true}
              title="4. Ceiling applicable to holder/family"
            />
          </div> */}
      </div>

      {/* </form> */}
    </>
  );
};

//////////////////////////////////////////////////////////////////

type AddFrom1FamilyProviderProps = {
  form1_family: Form1FamilyType[];
  setform1_family: Dispatch<SetStateAction<Form1FamilyType[]>>;
  data: DataType;
  setData: Dispatch<SetStateAction<DataType>>;
};

export const AddFrom1FamilyProvide = (props: AddFrom1FamilyProviderProps) => {
  const methods = useForm<Form1FamilyForm>({
    resolver: valibotResolver(Form1FamilySchema),
  });

  return (
    <FormProvider {...methods}>
      <Form1FamilyEntry
        form1_family={props.form1_family}
        setform1_family={props.setform1_family}
        data={props.data}
        setData={props.setData}
      />
    </FormProvider>
  );
};

const Form1FamilyEntry = (props: AddFrom1FamilyProviderProps) => {
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
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-40">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
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
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeForm1FamilyData(index);
                    }}
                    disabled={isSubmitting}
                    className="py-1 rounded-md bg-rose-500 px-4 text-sm text-white cursor-pointer"
                  >
                    {isSubmitting ? "Loading...." : "Delete"}
                  </button>
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

type AddFrom1LandProviderProps = {
  form1_land: Form1LandType[];
  setform1_land: Dispatch<SetStateAction<Form1LandType[]>>;
};

export const AddFrom1LandProvide = (props: AddFrom1LandProviderProps) => {
  const methods = useForm<Form1LandForm>({
    resolver: valibotResolver(Form1LandSchema),
  });

  return (
    <FormProvider {...methods}>
      <Form1LandEntry
        form1_land={props.form1_land}
        setform1_land={props.setform1_land}
      />
    </FormProvider>
  );
};

const Form1LandEntry = (props: AddFrom1LandProviderProps) => {
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
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-64">
                Remark
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-40">
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
                  {val.remark}
                </TableCell>
                <TableCell className="p-2 border text-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeForm1LandData(index);
                    }}
                    disabled={isSubmitting}
                    className="py-1 rounded-md bg-rose-500 px-4 text-sm text-white cursor-pointer"
                  >
                    {isSubmitting ? "Loading...." : "Delete"}
                  </button>
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
                <TaxtInput<Form1LandForm>
                  name="remark"
                  required={false}
                  placeholder="Enter Remark"
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
                {sumAreasFromForm(props.form1_land)}
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

type AddFrom1AcquisitionProviderProps = {
  form1_family: Form1FamilyType[];
  form1_land: Form1LandType[];
  form1_acquisition: Form1AcquisitionType[];
  setform1_acquisition: Dispatch<SetStateAction<Form1AcquisitionType[]>>;
  data: DataType;
  setData: Dispatch<SetStateAction<DataType>>;
  setFile: Dispatch<SetStateAction<File | null>>;
  file: File | null;
};

export const AddFrom1AcquisitionProvide = (
  props: AddFrom1AcquisitionProviderProps
) => {
  const methods = useForm<Form1AcquisitionForm>({
    resolver: valibotResolver(Form1AcquisitionSchema),
  });

  return (
    <FormProvider {...methods}>
      <Form1AcquisitionEntry
        form1_family={props.form1_family}
        form1_land={props.form1_land}
        form1_acquisition={props.form1_acquisition}
        setform1_acquisition={props.setform1_acquisition}
        data={props.data}
        setData={props.setData}
        file={props.file}
        setFile={props.setFile}
      />
    </FormProvider>
  );
};

const Form1AcquisitionEntry = (props: AddFrom1AcquisitionProviderProps) => {
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

  const addData = async () => {
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

    if (props.form1_family.length <= 0)
      return toast.error("Add Family and relationshiop to holder.");

    if (
      props.data.ceiling == "" ||
      props.data.ceiling == null ||
      props.data.ceiling == undefined
    )
      return toast.error("Enter Ceiling applicable to holder/family.");

    if (props.form1_land.length <= 0)
      return toast.error("Add Details of land held new Acquisition.");
    if (props.form1_acquisition.length <= 0)
      return toast.error("Add Details of new Acquisition.");

    const formdata = new FormData();
    formdata.append("file", props.file!);

    const upload_response = await uploadFile(formdata);

    let url: string | null = null;

    if (typeof upload_response == "string") {
      url = upload_response;
    }

    const response = await AddFrom1({
      form1_acquisition: props.form1_acquisition,
      form1_family: props.form1_family,
      form1_land: props.form1_land,
      holder_name: props.data.name,
      celiling_applicable: props.data.ceiling,
      residence_place: props.data.place,
      remark: "",
      date_of_inward: props.data.inward_date.toISOString(),
      inward_number: props.data.inward,
      action: "",
      file: url ?? undefined,
    });

    if (response.status) {
      toast.success("Record 30 added successfully");
      router.back();
    } else {
      toast.error(response.message);
    }
  };

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
          props.setFile(selectedFile);
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

              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-64">
                Remark
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-40">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
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
                    {val.remark}
                  </TableCell>
                  <TableCell className="p-2 border text-center">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeForm1AcquisitionData(index);
                      }}
                      disabled={isSubmitting}
                      className="py-1 rounded-md bg-rose-500 px-4 text-sm text-white cursor-pointer"
                    >
                      {isSubmitting ? "Loading...." : "Delete"}
                    </button>
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
                <TaxtInput<Form1AcquisitionForm>
                  name="remark"
                  required={false}
                  placeholder="Enter Remark"
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
                {sumAreasFromForm(props.form1_acquisition)}
              </TableCell>
              <TableCell className="p-2 border text-center"></TableCell>
              <TableCell className="p-2 border text-center"></TableCell>
              <TableCell className="p-2 border text-center"></TableCell>
              <TableCell className="p-2 border text-center"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </form>
      <div className="w-full flex gap-2 mt-2">
        <div className="grow"></div>
        <div className="flex gap-4 items-center justify-center">
          <p className="text-sm">
            {props.file != null
              ? longtext(props.file.name, 10)
              : "No File Selected"}
          </p>
          <ShButton
            onClick={() => cFile.current?.click()}
            variant={"secondary"}
            className="bg-gray-200 hover:bg-gray-300 h-8"
          >
            {props.file == null ? "Upload File" : "Change File"}
          </ShButton>
          {props.file != null && (
            <Link
              target="_blank"
              href={URL.createObjectURL(props.file!)}
              className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
            >
              View File
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
        <button
          type="submit"
          onClick={addData}
          disabled={isSubmitting}
          className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer"
        >
          {isSubmitting ? "Loading...." : "Submit"}
        </button>
      </div>
    </>
  );
};
