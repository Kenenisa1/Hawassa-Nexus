import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getToken } from "next-auth/jwt";

export const metadata = {
  title: "Hawassa Nexus Admin",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") ?? "";
  const token = await getToken({
    req: {
      headers: {
        cookie: cookieHeader,
      },
    } as unknown as import("next/server").NextRequest,
    secret: process.env.AUTH_SECRET,
  });

  if (!token?.sub) {
    redirect("/login");
  }

  if ((token as { role?: string })?.role !== "admin") {
    redirect("/");
  }

  return <>{children}</>;
}
