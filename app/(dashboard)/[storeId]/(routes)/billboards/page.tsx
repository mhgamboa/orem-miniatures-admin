import React from "react";
import prismaDb from "@/lib/prismadb";
import { format } from "date-fns";

import BillboardClient from "./components/BillboardClient";
import { BillboardColumn } from "./components/columns";

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

  const formattedBillboards: BillboardColumn[] = billboards.map(billboard => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-1 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
}
