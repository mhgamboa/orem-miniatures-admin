import React from "react";
import prismaDb from "@/lib/prismadb";

import BillboardClient from "./components/BillboardClient";

type Props = {
  params: { storeId: string };
};

export default async function Page({ params }: Props) {
  const billboards = await prismaDb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-1 p-8 pt-6">
        <BillboardClient data={billboards} />
      </div>
    </div>
  );
}
