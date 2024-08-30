import React from "react";
import prismaDb from "@/lib/prismadb";
import { format } from "date-fns";

import SizeClient from "./components/SizeClient";
import { SizeColumn } from "./components/columns";

type Props = {
  params: { storeId: string };
};

export default async function Page({ params }: Props) {
  const sizes = await prismaDb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map(item => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-1 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
}
