"use server";

import { cookies } from "next/headers";
import ViewFile from "./viewfile";

const ViewFilePage = ({ params }: any) => {
  const fileid = params.id;

  const id = cookies().get("id")?.value;
  return <ViewFile id={parseInt(id!)} fileid={fileid} />;
};
export default ViewFilePage;
