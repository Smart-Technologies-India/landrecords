import { InferInput, array, check, forward, minLength, minValue, number, object, string, pipe } from "valibot"

const FileSchema = pipe(object({
    file_no: pipe(string(), minLength(1, "Please enter file number.")),
    applicant_name: pipe(string(), minLength(1, "Please enter applicant name.")),
    survey_number: pipe(string(), minLength(1, "Please enter your file survey number.") ,),
    year: pipe(number(), minValue(1, "Please enter file year.")),
    typeId: pipe(number(), minValue(1, "Select file type.")),
    villageId: pipe(number(), minValue(1, "Select village.")),
    names: array(pipe(string(), minLength(1, "Please enter name."))),
    surveyNumbers: array(pipe(string(), minLength(1, "Please enter survey number."))),
    referenceNumbers: array(
      pipe(string(), minLength(1, "Please enter reference number."))
    ),
    dates: array(pipe(string(), minLength(1, "Please enter date."))),
  }), forward(
      check((input) => input.typeId != 0, "Select file type."),
      ["typeId"]
    ) , forward(
      check((input) => input.villageId != 0, "Select village."),
      ["villageId"]
    ) ,);

type FileForm = InferInput<typeof FileSchema>;
export { FileSchema, type FileForm };
