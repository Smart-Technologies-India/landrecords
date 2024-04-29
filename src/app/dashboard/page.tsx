"use client";
import DashBoardCount from "@/actions/dashboard/count";
import { useEffect, useState } from "react";
import { Chart, ArcElement } from "chart.js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Carbon3dCurveAutoVessels,
  CarbonAlignBoxTopCenter,
  CircumHome,
  MaterialSymbolsBook5,
} from "@/components/icons";
import VillagesFile from "@/actions/dashboard/villagefile";
import { Separator } from "@radix-ui/react-dropdown-menu";
Chart.register(ArcElement);
const Dashboard = () => {
  const doughnutoption: any = {
    responsive: true,
    plugins: {
      datalabels: {
        anchor: "center",
        align: "center",
        color: "#ffffff",
        font: {
          size: 20,
        },
        formatter: function (value: any) {
          return value;
        },
      },
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const dynamicColors = (numColors: any) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const color = `rgba(${r}, ${g}, ${b}, 0.75)`;
      colors.push(color);
    }
    return colors;
  };

  const doughnutdata: any = {
    labels: ["Officer 1", "Officer 2", "Officer 3", "Officer 4", "Officer 5"],
    datasets: [
      {
        data: [300, 50, 100, 40, 120],
        backgroundColor: dynamicColors(5),
        // borderColor: officerDataColors,
        // borderWidth: 1,
      },
    ],
  };

  const [isLoading, setLoading] = useState<boolean>(true);
  const [count, setCount] = useState<any>({});
  const [villageFile, setVillageFile] = useState<any>([]);
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const response = await DashBoardCount({});
      if (response.status) {
        setCount(response.data!);
      }
      const villagesfile = await VillagesFile({});
      if (villagesfile.status) {
        setVillageFile(villagesfile.data!);
      }
      setLoading(false);
    };
    init();
  }, []);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-100">
        Loading...
      </div>
    );
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:grid-row-3">
        <div className="bg-white rounded">
          <h1 className="text-sm text-gray-500 p-1 px-2">Village</h1>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="flex gap-2 items-center px-2">
            <div className="grid place-items-start my-2">
              <p className="text-xl text-gray-600">{count.village}</p>
              <span className="text-xs text-gray-400">Total village Count</span>
            </div>
            <div className="grow"></div>
            <div>
              <div className="rounded-full p-2 bg-blue-500">
                <CircumHome className="text-xl text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded">
          <h1 className="text-sm text-gray-500 p-1 px-2">File Type</h1>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="flex gap-2 items-center px-2">
            <div className="grid place-items-start my-2">
              <p className="text-xl text-gray-600">{count.type}</p>
              <span className="text-xs text-gray-400">
                Total File Type Count
              </span>
            </div>
            <div className="grow"></div>
            <div>
              <div className="rounded-full p-2 bg-rose-500">
                <Carbon3dCurveAutoVessels className="text-xl text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded">
          <h1 className="text-sm text-gray-500 p-1 px-2">Files</h1>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="flex gap-2 items-center px-2">
            <div className="grid place-items-start my-2">
              <p className="text-xl text-gray-600">{count.file}</p>
              <span className="text-xs text-gray-400">Total Files Count</span>
            </div>
            <div className="grow"></div>
            <div>
              <div className="rounded-full p-2 bg-orange-500">
                <MaterialSymbolsBook5 className="text-xl text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded">
          <h1 className="text-sm text-gray-500 p-1 px-2">Total Pages</h1>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="flex gap-2 items-center px-2">
            <div className="grid place-items-start my-2">
              <p className="text-xl text-gray-600">{count.page}</p>
              <span className="text-xs text-gray-400">Total Page Count</span>
            </div>
            <div className="grow"></div>
            <div>
              <div className="rounded-full p-2 bg-emerald-500">
                <CarbonAlignBoxTopCenter className="text-xl text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-4 mt-4">
        <div className="flex-1 bg-white p-2 rounded col-span-4"></div>
        <div className="flex-1 bg-white p-2 rounded col-span-2 max-h-[360px] overflow-y-scroll">
          <h3 className="text-lg">Villages & File Count</h3>
          <div className="w-full h-[1px] bg-gray-200 mt-1"></div>
          <Table className="relative">
            <TableHeader className="">
              <TableRow>
                <TableHead className="w-[100px] p-1 h-8">Id</TableHead>
                <TableHead className="p-1 w-40 h-8">Name</TableHead>
                <TableHead className="w-28 text-right bg p-1 h-8">
                  File-count
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {villageFile.map((village: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium p-1">{index + 1}</TableCell>
                  <TableCell className="p-1">{village.name}</TableCell>
                  <TableCell className="p-1 text-right">
                    {village.filecount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* <div className="p-4 bg-white rounded mt-4 ">
        <div className="flex-1 bg-white p-2">
          <h1 className="text-gray-800 text-sm font-semibold">
            Officer Wise Files
          </h1>
          <Separator />
          <div className="mx-auto grid place-items-center h-60 w-80">
            <Doughnut data={doughnutdata} options={doughnutoption} />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
