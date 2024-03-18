"use client";
import GetPdfFiles from "@/actions/files/getpdflist";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface filedata {
  id: number;
  name: string;
  path: string;
}

const PdfView = () => {
  const [isLoading, setLoading] = useState<boolean>(true);

  const [files, setFiles] = useState<filedata[]>([]);
  const id = 4;
  useEffect(() => {
    setLoading(true);
    const init = async () => {
      const response = await GetPdfFiles({ id: id });
      if (response.data) {
        setFiles(response.data);
      }
    };
    init();
    setLoading(false);
  }, []);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );
  return (
    <div className="p-6">
      <div className="bg-white shadow rounded-sm p-3 flex flex-col">
        {files.map((file: filedata, index: number) => {
          return (
            <Link
              key={index}
              href={`/files/${id}/${file.name}`}
              target="_blank"
              className="text-xs hover:bg-gray-100 rounded-sm p-1 cursor-pointer"
            >
              {index + 1}. {file.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
export default PdfView;
