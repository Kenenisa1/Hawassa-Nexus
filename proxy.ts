import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
});

export default auth; 

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};