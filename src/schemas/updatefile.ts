import { InferInput, array, check, forward, minLength, minValue, number, object, optional, string, pipe } from "valibot"

const UpdateFileSchema = pipe(object({
    file_no: pipe(string(), minLength(1, "Please enter file number.")),
    applicant_name: pipe(string(), minLength(1, "Please enter applicant name.")),
    survey_number: pipe(string(), minLength(1, "Please enter your file survey number.") ,),
    villageId: pipe(number(), minValue(1, "Select village.")),
    names: optional(array(pipe(string(), minLength(1, "Please enter name.")))),
    surveyNumbers: optional(
      array(pipe(string(), minLength(1, "Please enter survey number.")))
    ),
    referenceNumbers: optional(
      array(pipe(string(), minLength(1, "Please enter reference number.")))
    ),
    dates: optional(array(pipe(string(), minLength(1, "Please enter date.")))),
  }), forward(
      check((input) => input.villageId != 0, "Select village."),
      ["villageId"]
    ) ,);

type UpdateFileForm = InferInput<typeof UpdateFileSchema>;
export { UpdateFileSchema, type UpdateFileForm };
