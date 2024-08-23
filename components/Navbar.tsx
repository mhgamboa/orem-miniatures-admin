import React from "react";

import MainNav from "@/components/MainNav";
import StoreSwitcher from "@/components/StoreSwitcher";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismaDb from "@/lib/prismadb";

export default async function Navbar() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const stores = await prismaDb.store.findMany({
    where: {
      userId: userId,
    },
  });
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton />
        </div>
      </div>
    </div>
  );
}
