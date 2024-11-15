"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { TaxtInput } from "./inputfields/textinput";
import { TaxtAreaInput } from "./inputfields/textareainput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dispatch, SetStateAction, useState } from "react";
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
  form1_family: Form1FamilyType[];
  form1_land: Form1LandType[];
  form1_acquisition: Form1AcquisitionType[];
};
export const AddFrom1Provider = (props: AddFrom1ProviderProps) => {
  const methods = useForm<Form1Form>({
    resolver: valibotResolver(Form1Schema),
  });

  return (
    <FormProvider {...methods}>
      <Form1Entry
        form1_family={props.form1_family}
        form1_land={props.form1_land}
        form1_acquisition={props.form1_acquisition}
      />
    </FormProvider>
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

  const onSubmit = async (data: Form1Form) => {
    if (props.form1_family.length <= 0)
      return toast.error("Add Family and relationshiop to holder.");
    if (props.form1_land.length <= 0) return toast.error("Add Details of land held new Acquisition.");
    if (props.form1_acquisition.length <= 0)
      return toast.error("Add Details of new Acquisition.");

    const response = await AddFrom1({
      form1_acquisition: props.form1_acquisition,
      form1_family: props.form1_family,
      form1_land: props.form1_land,
      holder_name: data.holder_name,
      celiling_applicable: data.celiling_applicable,
      residence_place: data.residence_place,
      remark: data.remark ?? "",
      sr_no: data.sr_no,
      action: data.action ?? "",
    });

    if (response.status) {
      toast.success("Record 30 added successfully");
      router.back();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onFormError)}>
        <div className="flex gap-4 mt-1">
          <div className="flex-1">
            <TaxtInput<Form1Form>
              placeholder="Enter Sr Number"
              name="sr_no"
              required={true}
              title="1. Sr. No."
            />
          </div>
          <div className="flex-1">
            <TaxtInput<Form1Form>
              placeholder="Enter Name of the holder"
              name="holder_name"
              required={true}
              title="1. Name of holder"
            />
          </div>
        </div>
        <div className="flex gap-4 mt-1">
          <div className="flex-1">
            <TaxtInput<Form1Form>
              placeholder="Enter Place of residence"
              name="residence_place"
              required={true}
              title="3. Place of residence"
            />
          </div>
          <div className="flex-1">
            <TaxtInput<Form1Form>
              placeholder="Enter Ceiling applicable to holder/family"
              name="celiling_applicable"
              required={true}
              title="4. Ceiling applicable to holder/family"
            />
          </div>
        </div>
        <div className="w-full flex gap-2 mt-2">
          <div className="grow"></div>

          <input
            type="reset"
            onClick={(e) => {
              e.preventDefault();
              reset({});
            }}
            value={"Reset"}
            className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer"
          />
          <input
            type="submit"
            disabled={isSubmitting}
            className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer"
            value={isSubmitting ? "Loading...." : "Submit"}
          />
        </div>
      </form>
    </>
  );
};

//////////////////////////////////////////////////////////////////

type AddFrom1FamilyProviderProps = {
  form1_family: Form1FamilyType[];
  setform1_family: Dispatch<SetStateAction<Form1FamilyType[]>>;
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onFormError)}>
        <p className="text-[#162e57] text-sm mt-2">
          Names of members of family and relationship to holder
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
                <TaxtInput<Form1FamilyForm>
                  name="relationship"
                  required={true}
                  placeholder="Enter Relationship"
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

        <div className="w-full flex gap-2 mt-2">
          <div className="grow"></div>
        </div>
      </form>
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onFormError)}>
        <p className="text-[#162e57] text-sm mt-2">
          Details of land held before new acquisition
        </p>
        <Table className="border mt-2">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="whitespace-nowrap w-10 border text-center p-1 h-8">
                No
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8  min-w-80">
                Village
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8  w-64">
                Survey Number
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
                <TaxtInput<Form1LandForm>
                  name="village"
                  required={true}
                  placeholder="Enter Village"
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
  form1_acquisition: Form1AcquisitionType[];
  setform1_acquisition: Dispatch<SetStateAction<Form1AcquisitionType[]>>;
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
        form1_acquisition={props.form1_acquisition}
        setform1_acquisition={props.setform1_acquisition}
      />
    </FormProvider>
  );
};

const Form1AcquisitionEntry = (props: AddFrom1AcquisitionProviderProps) => {
  const id: number = parseInt(getCookie("id") ?? "0");

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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onFormError)}>
        <p className="text-[#162e57] text-sm mt-2">
          Details of new acquisition
        </p>
        <Table className="border mt-2">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="whitespace-nowrap w-10 border text-center p-1 h-8">
                No
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8  min-w-80">
                Village
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8  w-64">
                Survey Number
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-64">
                Area
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-64">
                Type
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-64">
                Date
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
                <TaxtInput<Form1AcquisitionForm>
                  name="village"
                  required={true}
                  placeholder="Enter Village"
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
                  name="area"
                  required={true}
                  placeholder="Enter Area"
                />
              </TableCell>
              <TableCell className="p-2 border text-center">
                <TaxtInput<Form1AcquisitionForm>
                  name="type"
                  required={true}
                  placeholder="Enter Type"
                />
              </TableCell>
              <TableCell className="p-2 border text-center">
                <DateSelect<Form1AcquisitionForm>
                  name="date"
                  required={true}
                  placeholder="Enter Area"
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
          </TableBody>
        </Table>

        <div className="w-full flex gap-2 mt-2">
          <div className="grow"></div>
        </div>
      </form>
    </>
  );
};
