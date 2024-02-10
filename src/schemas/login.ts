import { isContainSpace } from "@/utils/methods";
import { Input, custom, minLength, object, string } from "valibot";

const LoginSchema = object({
  username: string([
    minLength(1, "Please enter your username."),
    custom(isContainSpace, "Username cannot contain space."),
  ]),
  password: string([
    minLength(1, "Please enter your password."),
    custom(isContainSpace, "Password cannot contain space."),
  ]),
});

type LoginForm = Input<typeof LoginSchema>;
export { LoginSchema, type LoginForm };
