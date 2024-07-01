"use client";
import { useBeforeunload } from "react-beforeunload";
import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { deleteCookie } from "cookies-next";

// export const metadata: Metadata = {
//   title: "Land Records",
//   description: "Land Records entry and management system",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // function to check for inactivity and log out
  const checkForInactivity = () => {
    const expireTime = window.localStorage.getItem("expireTime");

    if (expireTime && parseInt(expireTime) < Date.now()) {
      logoutAction();
    }
  };

  // funtion to update expire time
  const updateExpireTime = () => {
    // 1 hour time
    const expireTime = Date.now() + 1800000;

    // 10 sec time
    // const expireTime = Date.now() + 10000;

    window.localStorage.setItem("expireTime", expireTime.toString());
  };

  // use effect to set interval to check for inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      checkForInactivity();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // useBeforeunload(() => {
  //   logoutAction();
  // });

  // update expire time on any user activity
  useEffect(() => {
    updateExpireTime();
    const events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
    ];

    events.forEach((event) => {
      window.addEventListener(event, updateExpireTime);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateExpireTime);
      });
    };
  }, []);

  // logout function

  const logoutAction = () => {
    deleteCookie("id");
    window.location.pathname = "/";
  };

  return (
    <html lang="en">
      <head>
        <title>Land Records</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Land Records entry and management system"
        />
      </head>
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
