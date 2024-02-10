"use server";

import { cookies } from "next/headers";
import SearchAdmin from "./serach";

const SearchPage = () => {
  const id = cookies().get("id")?.value;
  const role = cookies().get("role")?.value;
  return <SearchAdmin id={id} role={role} />;
};
export default SearchPage;
