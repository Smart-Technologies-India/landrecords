/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const TestPage = () => {
  type CupboardLocation = {
    [key: string]: {
      width: string;
      height: string;
    };
  };

  const cupboard_locaton: CupboardLocation = {
    "1": {
      width: "17px",
      height: "178px",
    },
    "2": {
      width: "35px",
      height: "178px",
    },
    "3": {
      width: "54px",
      height: "178px",
    },
    "4": {
      width: "72px",
      height: "178px",
    },

    "5": {
      width: "90px",
      height: "178px",
    },
    "6": {
      width: "108px",
      height: "178px",
    },
    "7": {
      width: "127px",
      height: "178px",
    },
    "8": {
      width: "145px",
      height: "178px",
    },
    "9": {
      width: "167px",
      height: "178px",
    },
    "10": {
      width: "185px",
      height: "178px",
    },
    "11": {
      width: "195px",
      height: "8px",
    },
    "12": {
      width: "218px",
      height: "8px",
    },
    "13": {
      width: "240px",
      height: "8px",
    },
    "14": {
      width: "89px",
      height: "147px",
    },
    "15": {
      width: "106px",
      height: "147px",
    },
    "16": {
      width: "145px",
      height: "44px",
    },
    "17": {
      width: "145px",
      height: "65px",
    },
    "18": {
      width: "145px",
      height: "84px",
    },
    "19": {
      width: "145px",
      height: "104px",
    },
    "20": {
      width: "145px",
      height: "126px",
    },
    "21": {
      width: "145px",
      height: "147px",
    },
    "22": {
      width: "16px",
      height: "178px",
    },
    "23": {
      width: "202px",
      height: "147px",
    },
    "24": {
      width: "221px",
      height: "182px",
    },
    "25": {
      width: "240px",
      height: "182px",
    },
  };

  const self_locaton: CupboardLocation = {
    A: {
      width: "299px",
      height: "29px",
    },
    B: {
      width: "328px",
      height: "29px",
    },
    C: {
      width: "356px",
      height: "29px",
    },
    D: {
      width: "299px",
      height: "62px",
    },
    E: {
      width: "328px",
      height: "62px",
    },
    F: {
      width: "356px",
      height: "62px",
    },
    G: {
      width: "299px",
      height: "95px",
    },
    H: {
      width: "328px",
      height: "95px",
    },
    I: {
      width: "356px",
      height: "95px",
    },
    J: {
      width: "299px",
      height: "128px",
    },
    K: {
      width: "328px",
      height: "128px",
    },
    L: {
      height: "128px",
      width: "356px",
    },
    M: {
      width: "299px",
      height: "160px",
    },
    N: {
      width: "328px",
      height: "160px",
    },
    O: {
      width: "356px",
      height: "160px",
    },
  };

  interface CUPBoardLocation {
    height: string;
    width: string;
  }

  const [isData, setIsData] = useState<boolean>(false);

  const [cupboardLocation, setCupboardLocaton] = useState<CUPBoardLocation>({
    width: "0px",
    height: "0px",
  });
  const [selfLocation, setSelfLocaton] = useState<CUPBoardLocation>({
    width: "0px",
    height: "0px",
  });

  const SetLocation = (cupboard: string, self: string) => {
    const location_cupboard = cupboard_locaton[cupboard];
    if (location) {
      setCupboardLocaton(location_cupboard);
      setIsData(true);
    } else {
      setIsData(false);
    }
    const location_slef = self_locaton[self];
    if (location) {
      setSelfLocaton(location_slef);
      setIsData(true);
    } else {
      setIsData(false);
    }
  };

  useEffect(() => {
    SetLocation("25", "M");
  }, []);

  return (
    <>
      <div className="grid place-content-center w-full">
        <div className="relative h-[190px] w-[380px]">
          <Image
            alt="place"
            src={"/place.jpg"}
            fill={true}
            className="w-full h-full object-cover"
          ></Image>
          {isData && (
            <>
              <div
                style={{
                  top: cupboardLocation.height,
                  left: cupboardLocation.width,
                }}
                className={`rounded-full h-[6px] w-[6px] bg-rose-500 absolute`}
              ></div>
              <div
                style={{
                  top: selfLocation.height,
                  left: selfLocation.width,
                }}
                className={`rounded-full absolute`}
              >
                <p className="text-rose-500 text-[0.4rem] text-center leading-[0.4rem]">
                  Your <br /> File is <br /> Here
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TestPage;
