import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function layout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const store = await prismaDb.store.findFirst({ where: { userId } });

  if (store) redirect(`/${store.id}`);
  return <>{children}</>;
}
