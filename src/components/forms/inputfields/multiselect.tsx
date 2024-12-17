"use clinet";

import { Label } from "@/components/ui/label";
import { OptionValue } from "@/models/main";
import { Select } from "antd";
import { useState } from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { TaxtInput } from "./textinput";
import { never } from "valibot";
import { MaterialSymbolsCloseSmall } from "@/components/icons";

type MultiSelectProps<T extends FieldValues> = {
  name: Path<T>;
  options: OptionValue[];
  title?: string;
  placeholder: string;
  required: boolean;
  disable?: boolean;
  isOther?: boolean;
};

export function MultiSelect<T extends FieldValues>(props: MultiSelectProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[props.name as keyof typeof errors];
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field }) => (
        <>
          {props.title && (
            <Label htmlFor={props.name} className="text-sm font-normal">
              {props.title}
              {props.required && <span className="text-rose-500">*</span>}
            </Label>
          )}

          {isOtherSelected && props.isOther == true ? (
            <div className="flex items-center">
              <TaxtInput<T>
                name={props.name}
                required={true}
                placeholder={props.placeholder}
              />
              <MaterialSymbolsCloseSmall
                className=" cursor-pointer text-xl border rounded-md ml-1 h-8 w-8"
                onClick={() => {
                  setIsOtherSelected(false);
                  field.onChange(null);
                }}
              />
            </div>
          ) : (
            <Select
              disabled={props.disable ?? false}
              showSearch={true}
              status={error ? "error" : undefined}
              className="w-full"
              onChange={(value: string) => {
                if (value.toLowerCase() === "other") {
                  field.onChange(null);
                  setIsOtherSelected(true);
                } else {
                  field.onChange(value);
                }
              }}
              options={props.options}
              value={field.value ?? undefined}
              placeholder={props.placeholder}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          )}

          {/* <Select
            disabled={props.disable ?? false}
            showSearch={true}
            status={error ? "error" : undefined}
            className="w-full"
            onChange={(value: string) => {
              field.onChange(value);
              setIsOtherSelected(value.toLowerCase() === "other");
            }}
            options={props.options}
            value={field.value ?? undefined}
            placeholder={props.placeholder}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
          {isOtherSelected && props.isOther && (
            <div className="mt-2">
              <TaxtInput<T>
                name={props.name}
                required={true}
                placeholder={props.placeholder}
              />
            </div>
          )} */}
          {error && (
            <p className="text-xs text-red-500">{error.message?.toString()}</p>
          )}
        </>
      )}
    />
  );
}
