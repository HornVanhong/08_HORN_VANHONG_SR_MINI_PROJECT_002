import { NextResponse } from "next/server";
import {auth} from "@/auth";
export default async function proxy(req) {
  console.log(req);
  const session = await auth();
  console.log("session in proxy :", session);
  if (!session || session.user.error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/shop/:path*","/manage-products/:path*","/orders/:path*", "/cart/:path*",],
};
