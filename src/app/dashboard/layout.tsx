"use client";
import Navbar from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { Role, user } from "@prisma/client";
import GetUser from "@/actions/user/getuser";
import { useSearchParams } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userdata, setUpser] = useState<user>();
  const [isLoading, setLoading] = useState<boolean>(true);

  const [isbluck, setBluck] = useState<boolean>(
    searchParams.get("sidebar") == "no" ? true : false
  );

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const id: number = parseInt(getCookie("id") ?? "0");

      const userrespone = await GetUser({ id: id });
      if (userrespone.status) {
        setUpser(userrespone.data!);
      }
      setLoading(false);
    };
    init();
  }, []);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-[#f5f6f8] relative">
      {!isbluck && (
        <Sidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          role={userdata?.role as Role}
        />
      )}

      <div
        // className="relative p-0 md:pl-52"
        className={`relative p-0 ${
          !isbluck ? "md:pl-52" : ""
        }  min-h-screen flex flex-col`}
      >
        {!isbluck && (
          <Navbar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            name={userdata?.username ?? ""}
            role={userdata?.role.toString() ?? ""}
            isbluck={isbluck}
          ></Navbar>
        )}

        {children}
      </div>
    </div>
  );
}
