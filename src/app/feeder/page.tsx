"use server";

import { cookies } from "next/headers";
import FeederPage from "./feederpage";

const SearchPage = () => {
  const id = cookies().get("id")?.value;
  const role = cookies().get("role")?.value;
  return <FeederPage id={id} role={role} />;
};
export default SearchPage;
