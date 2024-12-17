import {
  InferInput,
  minLength,
  nullable,
  object,
  string,
  pipe,
  nullish,
  regex,
} from "valibot";

const Form1FamilySchema = object({
  name: pipe(string("Please enter Name."), minLength(1, "Please enter Name.")),
  age: pipe(string("Enter the age."), minLength(1, "Enter the age.")),
  relationship: pipe(
    string("Please enter relationship."),
    minLength(1, "Please enter relationship.")
  ),
});

type Form1FamilyForm = InferInput<typeof Form1FamilySchema>;
export { Form1FamilySchema, type Form1FamilyForm };

const Form1LandSchema = object({
  village: pipe(
    string("Please enter village."),
    minLength(1, "Please enter village.")
  ),
  survey_no: pipe(
    string("Please enter survey no."),
    minLength(1, "Please enter survey no.")
  ),
  area: pipe(
    string("Please enter area."),
    minLength(1, "Please enter area."),
    regex(/^0-\d{2}\.\d{2}$/, "Enter valid formate or area ex:- 0-12.34")
  ),
  remark: nullish(string()),
});

type Form1LandForm = InferInput<typeof Form1LandSchema>;
export { Form1LandSchema, type Form1LandForm };

const Form1AcquisitionSchema = object({
  village: pipe(
    string("Please enter village."),
    minLength(1, "Please enter village.")
  ),
  survey_no: pipe(
    string("Please enter survey no."),
    minLength(1, "Please enter survey no.")
  ),
  area: pipe(
    string("Please enter area."),
    minLength(1, "Please enter area."),
    regex(/^0-\d{2}\.\d{2}$/, "Enter valid formate or area ex:- 0-12.34")
  ),
  type: pipe(string("Please enter type."), minLength(1, "Please enter type.")),
  date: pipe(string("Please enter data."), minLength(1, "Please enter data.")),
  remark: nullish(string()),
});

type Form1AcquisitionForm = InferInput<typeof Form1AcquisitionSchema>;
export { Form1AcquisitionSchema, type Form1AcquisitionForm };

const Form1Schema = object({
  inward_number: pipe(
    string("Please enter survey no."),
    minLength(1, "Please enter survey no.")
  ),
  date_of_inward: pipe(
    string("Select Date off inward."),
    minLength(1, "Select Date off inward.")
  ),
  holder_name: pipe(
    string("Please enter Holder name."),
    minLength(1, "Please enter Holder name.")
  ),
  residence_place: pipe(
    string("Please enter residence Place."),
    minLength(1, "Please enter residence Place.")
  ),
  // celiling_applicable: pipe(
  //   string("Please enter celiling applicable."),
  //   minLength(1, "Please enter celiling applicable.")
  // ),
  action: nullish(string()),
  remark: nullish(string()),
});

type Form1Form = InferInput<typeof Form1Schema>;
export { Form1Schema, type Form1Form };
