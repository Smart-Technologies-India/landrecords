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

const UpdateFileSchema = object(
  {
    file_no: string([minLength(1, "Please enter file number.")]),
    applicant_name: string([minLength(1, "Please enter applicant name.")]),
    survey_number: string([
      minLength(1, "Please enter your file survey number."),
    ]),
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
      custom((input) => input.villageId != 0, "Select village."),
      ["villageId"]
    ),
  ]
);

type UpdateFileForm = Input<typeof UpdateFileSchema>;
export { UpdateFileSchema, type UpdateFileForm };
