/* eslint-disable react-hooks/exhaustive-deps */
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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import getFrom1 from "@/actions/form1/getform1";
import {
  form1,
  form1_acquisition,
  form1_family,
  form1_land,
} from "@prisma/client";
import {
  DeleteFrom1Acquisition,
  DeleteFrom1Family,
  DeleteFrom1Land,
} from "@/actions/form1/deleteforms";
import UpdateFrom1 from "@/actions/form1/updateform1";
import { FluentBinRecycle24Regular } from "../icons";
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

type EditFrom1ProviderProps = {
  form1_family: Form1FamilyType[];
  form1_land: Form1LandType[];
  form1_acquisition: Form1AcquisitionType[];
  id: number;
  form1_family_data: form1_family[];
  form1_land_data: form1_land[];
  form1_acquisition_data: form1_acquisition[];
};
export const EditFrom1Provider = (props: EditFrom1ProviderProps) => {
  const methods = useForm<Form1Form>({
    resolver: valibotResolver(Form1Schema),
  });

  return (
    <FormProvider {...methods}>
      <Form1Entry
        form1_family={props.form1_family}
        form1_land={props.form1_land}
        form1_acquisition={props.form1_acquisition}
        form1_acquisition_data={props.form1_acquisition_data}
        form1_family_data={props.form1_family_data}
        form1_land_data={props.form1_land_data}
        id={props.id}
      />
    </FormProvider>
  );
};

const Form1Entry = (props: EditFrom1ProviderProps) => {
  const id: number = parseInt(getCookie("id") ?? "0");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext<Form1Form>();

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
        id: props.id,
      });
      if (response.status && response.data) {
        setForm1Data(response.data);
        reset({
          remark: response.data.remark,
          action: response.data.action,
          sr_no: response.data.sr_no,
          holder_name: response.data.holder_name,
          celiling_applicable: response.data.celiling_applicable,
          residence_place: response.data.residence_place,
        });
      }

      setIsLoading(false);
    };
    init();
  }, [props.id]);

  const onSubmit = async (data: Form1Form) => {
    if (props.form1_family.length < 0 && props.form1_family_data.length < 0)
      return toast.error("Add Family and relationshiop to holder.");
    if (props.form1_land.length < 0 && props.form1_land_data.length < 0)
      return toast.error("Add Lands.");
    if (
      props.form1_acquisition.length < 0 &&
      props.form1_acquisition_data.length < 0
    )
      return toast.error("Add Acquisition.");

    const response = await UpdateFrom1({
      id: props.id,
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
      toast.success("Record 30 Updated successfully");
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
    <>
      <form onSubmit={handleSubmit(onSubmit, onFormError)}>
        <div className="flex gap-4 mt-1">
          <div className="flex-1">
            <TaxtInput<Form1Form>
              placeholder="Enter Sr Number"
              name="sr_no"
              required={true}
              title="Sr. No."
            />
          </div>
          <div className="flex-1">
            <TaxtInput<Form1Form>
              placeholder="Enter Name of the holder"
              name="holder_name"
              required={true}
              title="Name of holder"
            />
          </div>
        </div>
        <div className="flex gap-4 mt-1">
          <div className="flex-1">
            <TaxtInput<Form1Form>
              placeholder="Enter Place of residence"
              name="residence_place"
              required={true}
              title="Place of residence"
            />
          </div>
          <div className="flex-1">
            <TaxtInput<Form1Form>
              placeholder="Enter Ceiling applicable to holder/family"
              name="celiling_applicable"
              required={true}
              title="Ceiling applicable to holder/family"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-1">
          <div className="flex-1">
            <TaxtAreaInput<Form1Form>
              name="action"
              required={false}
              title="Action"
              placeholder="Action"
            />
          </div>
          <div className="flex-1">
            <TaxtAreaInput<Form1Form>
              name="remark"
              required={false}
              title="Remark"
              placeholder="Remark"
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
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer"
          >
            {isSubmitting ? "Loading...." : "Update"}
          </button>
        </div>
      </form>
    </>
  );
};

//////////////////////////////////////////////////////////////////

type EditFrom1FamilyProviderProps = {
  form1_family: Form1FamilyType[];
  setform1_family: Dispatch<SetStateAction<Form1FamilyType[]>>;
  form1_family_data: form1_family[];
  init: () => Promise<void>;
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
  form1_acquisition: Form1AcquisitionType[];
  setform1_acquisition: Dispatch<SetStateAction<Form1AcquisitionType[]>>;
  form1_acquisition_data: form1_acquisition[];
  init: () => Promise<void>;
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
        form1_acquisition={props.form1_acquisition}
        setform1_acquisition={props.setform1_acquisition}
        form1_acquisition_data={props.form1_acquisition_data}
        init={props.init}
      />
    </FormProvider>
  );
};

const Form1AcquisitionEntry = (props: EditFrom1AcquisitionProviderProps) => {
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
                Type
              </TableHead>
              <TableHead className="whitespace-nowrap border text-center p-1 h-8 w-64">
                Date
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
                  onlynumber={true}
                  numdes
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
