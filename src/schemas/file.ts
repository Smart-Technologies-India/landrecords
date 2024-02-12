import {
  Input,
  array,
  custom,
  forward,
  minLength,
  minValue,
  number,
  object,
  string,
} from "valibot";

const FileSchema = object(
  {
    file_no: string([minLength(1, "Please enter file number.")]),
    applicant_name: string([minLength(1, "Please enter applicant name.")]),
    survey_number: string([
      minLength(1, "Please enter your file survey number."),
    ]),
    year: number([minValue(1, "Please enter file year.")]),
    typeId: number([minValue(1, "Select file type.")]),
    villageId: number([minValue(1, "Select village.")]),
    names: array(string([minLength(1, "Please enter name.")])),
    surveyNumbers: array(string([minLength(1, "Please enter survey number.")])),
    referenceNumbers: array(
      string([minLength(1, "Please enter reference number.")])
    ),
    dates: array(string([minLength(1, "Please enter date.")])),
  },
  [
    forward(
      custom((input) => input.typeId != 0, "Select file type."),
      ["typeId"]
    ),
    forward(
      custom((input) => input.villageId != 0, "Select village."),
      ["villageId"]
    ),
  ]
);

type FileForm = Input<typeof FileSchema>;
export { FileSchema, type FileForm };
