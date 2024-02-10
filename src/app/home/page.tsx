"use server";

import { cookies } from "next/headers";
import HomeForm from "./Home";

const HomePage = () => {
  const id = cookies().get("id")?.value;
  const role = cookies().get("role")?.value;
  return <HomeForm id={id} role={role} />;
};
export default HomePage;
