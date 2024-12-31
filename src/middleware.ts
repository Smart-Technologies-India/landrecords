import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const idCookie = request.cookies.get("id");
  const id: string | undefined = idCookie?.value.toString();

  const roleCookie = request.cookies.get("role");
  const role: string | undefined = roleCookie?.value.toString();

  const roletopage = (role: Role): string => {
    switch (role) {
      case Role.ADMIN:
        return "/search";
      case Role.DEPARTMENT:
        return "/dashboard";
      case Role.FEEDER:
        return "/feeder";
      case Role.LDC:
        return "/dashboard";
      case Role.SUPTD:
        return "/dashboard";
      case Role.SYSTEM:
        return "/system";
      case Role.USER:
        return "/home";
      default:
        return "/home";
    }
  };

  if (request.nextUrl.pathname.startsWith("/dashboard/form1/download")) {
    return NextResponse.next();
  }

  request.nextUrl.pathname.startsWith("/dashboard/cform");

  if (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register")
  ) {
    if (
      request.cookies.get("id") == undefined ||
      request.cookies.get("id") == null
    ) {
      return NextResponse.next();
    }
    if (
      request.cookies.get("role") == undefined ||
      request.cookies.get("role") == null
    ) {
      return NextResponse.next();
    }

    if (parseInt(request.cookies.get("id")!.value) > 0) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/home")) {
    if (
      request.cookies.get("id") == undefined ||
      request.cookies.get("id") == null
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (
      request.cookies.get("role") == null ||
      request.cookies.get("role") == undefined
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/search")) {
    if (
      request.cookies.get("id") == undefined ||
      request.cookies.get("id") == null
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      request.cookies.get("role") == null ||
      request.cookies.get("role") == undefined
    )
      return NextResponse.redirect(new URL("/home", request.url));

    const role: string = request.cookies.get("role")!.value.toString();
    if (role == "ADMIN") {
      return NextResponse.next();
    } else if (role == "USER") {
      return NextResponse.redirect(new URL("/home", request.url));
    } else if (["DEPARTMENT", "LDC", "SUPTD"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/feeder")) {
    if (
      request.cookies.get("id") == undefined ||
      request.cookies.get("id") == null
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      request.cookies.get("role") == null ||
      request.cookies.get("role") == undefined
    )
      return NextResponse.redirect(new URL("/home", request.url));

    const role: string = request.cookies.get("role")!.value.toString();
    if (role == "FEEDER") {
      return NextResponse.next();
    } else if (role == "USER") {
      return NextResponse.redirect(new URL("/home", request.url));
    } else if (["DEPARTMENT", "LDC", "SUPTD"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (
      request.cookies.get("id") == undefined ||
      request.cookies.get("id") == null
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      request.cookies.get("role") == null ||
      request.cookies.get("role") == undefined
    )
      return NextResponse.redirect(new URL("/home", request.url));

    const role: string = request.cookies.get("role")!.value.toString();
    if (role == "FEEDER") {
      return NextResponse.redirect(new URL("/feeder", request.url));
    } else if (role == "USER") {
      return NextResponse.redirect(new URL("/home", request.url));
    } else if (["DEPARTMENT", "LDC", "SUPTD"].includes(role)) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}
