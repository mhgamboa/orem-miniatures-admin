import React from "react";
import { redirect } from "next/navigation";

import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import SettingsForm from "./components/SettingsForm";

type Props = {
  params: { storeId: string };
};

export default async function SettingsPage({ params }: Props) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const store = await prismaDb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) redirect("/");

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
}
