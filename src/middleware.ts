import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
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

    const role: string = request.cookies.get("role")!.value.toString();
    if (role == "ADMIN") {
      return NextResponse.redirect(new URL("/search", request.url));
    } else if (role == "USER") {
      return NextResponse.next();
    }
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
    }
  }

  return NextResponse.next();
}
