import Navbar from "@/components/Navbar";
import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type props = { children: React.ReactNode; params: { storeId: string } };

export default async function DashboardLayout({ children, params }: props) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const store = await prismaDb.store.findFirst({ where: { id: params.storeId, userId } });

  if (!store) redirect("/");

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
