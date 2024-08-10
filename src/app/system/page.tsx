"use client";
import GetUser from "@/actions/user/getuser";
import { MaterialSymbolsLightCalendarMonthOutline } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { user } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Counter from "@/actions/counter/counter";
import DateCounter from "@/actions/counter/datecounter";
import { getCookie } from "cookies-next";
import logout from "@/actions/user/logout";

interface AdminProps {}

export default function SystemPage(props: AdminProps) {
  const id: number = parseInt(getCookie("id") ?? "0");

  const [isLoading, setLoading] = useState<boolean>(true);
  const [userdata, setUserData] = useState<user | null>(null);

  const router = useRouter();

  const [date, setDate] = useState<Date>();
  const [dateBox, setDateBox] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<number | null>(null);

  const [data, setData] = useState<any[]>([]);

  const [dateSearch, setDateSearch] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const response = await GetUser({ id: id });
      if (response.status) {
        setUserData((val) => response.data);
      } else {
        toast.error(response.message);
      }

      const countrespone = await Counter({});
      if (countrespone.status && countrespone.data) {
        setData(countrespone.data);
      }

      setLoading(false);
    };

    init();
  }, []);

  const datesearch = async (date: string) => {
    setLoading(true);
    const response = await DateCounter({
      date: date,
    });
    if (response.status && response.data) {
      setDateSearch(response.data);
    }
    setLoading(false);
  };

  const logoutbtn = async () => {
    const response = await logout({});
    if (response.status) {
      router.push("/");
    } else {
      toast.error(response.message);
    }
  };

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <>
      <div className="min-h-screen p-2 mx-auto w-5/6">
        <Card>
          <CardHeader className="py-2 px-4 flex flex-row items-center">
            <h1 className="text-xl">{userdata?.username}</h1>
            <p className="text-2xl grow text-center">Land Records</p>
            <Button onClick={logoutbtn}>Logout</Button>
          </CardHeader>
        </Card>
        <Card className="mx-auto mt-6 p-4">
          <div className="flex items-center my-2">
            <h1>Dashboard</h1>
            <div className="grow"></div>
            <Popover open={dateBox} onOpenChange={setDateBox}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <MaterialSymbolsLightCalendarMonthOutline className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(e: Date | undefined) => {
                    if (!e) return;
                    setDate(new Date(e));
                    setDateBox(false);

                    datesearch(
                      new Date(
                        e.getFullYear(),
                        e.getMonth(),
                        e.getDate()
                      ).toLocaleDateString()
                    );
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="w-4"></div>
            {date != null || date != undefined ? (
              <>
                <Button onClick={() => setDate(undefined)}>Clear Search</Button>
              </>
            ) : null}
          </div>

          {date == null || date == undefined ? (
            <>
              <div className="flex items-center gap-3 flex-wrap">
                {data.map((val: any, index: number) => (
                  <p
                    key={index}
                    className={`border border-black rounded-sm py-1 px-2 ${
                      val.id == currentUser ? " bg-black text-white" : ""
                    }`}
                    role="button"
                    onClick={() => {
                      setCurrentUser(val.id);
                    }}
                  >
                    {val.name} - [{val.role}]
                  </p>
                ))}
              </div>
              <Separator className="my-4" />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Date</TableHead>
                    <TableHead>File Count</TableHead>
                    <TableHead>Page Count</TableHead>
                    <TableHead>Name Count</TableHead>
                    <TableHead>Ref Count</TableHead>
                    <TableHead>Survey Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUser != null &&
                    data
                      .find((user) => user.id == currentUser)
                      .data.map((val: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {val.date}
                          </TableCell>
                          <TableCell>{val.filecount}</TableCell>
                          <TableCell>{val.pagecount}</TableCell>
                          <TableCell>{val.namecount}</TableCell>
                          <TableCell>{val.refcount}</TableCell>
                          <TableCell>{val.surveycount}</TableCell>
                        </TableRow>
                      ))}
                  {/* {[1, 2, 3, 4, 5, 6, 7].map((invoice: number) => (
                    <TableRow key={invoice}>
                      <TableCell className="font-medium">12/05/2023</TableCell>
                      <TableCell>{23}</TableCell>
                      <TableCell>{123}</TableCell>
                      <TableCell className="text-right">{52}</TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">User</TableHead>
                    <TableHead>File Count</TableHead>
                    <TableHead>Page Count</TableHead>
                    <TableHead>Name Count</TableHead>
                    <TableHead>Ref Count</TableHead>
                    <TableHead>Survey Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dateSearch.map((val: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {val.name} - [{val.role}]
                      </TableCell>
                      <TableCell>{val.filecount}</TableCell>
                      <TableCell>{val.pagecount}</TableCell>
                      <TableCell>{val.namecount}</TableCell>
                      <TableCell>{val.refcount}</TableCell>
                      <TableCell>{val.surveycount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </Card>
      </div>
    </>
  );
}
