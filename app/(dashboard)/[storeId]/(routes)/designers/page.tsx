import React from "react";
import prismaDb from "@/lib/prismadb";
import { format } from "date-fns";

import DesignerClient from "./components/DesignerClient";
import { DesignerColumn } from "./components/columns";

type Props = {
  params: { storeId: string };
};

export default async function Page({ params }: Props) {
  const designers = await prismaDb.designer.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedDesigners: DesignerColumn[] = designers.map(item => ({
    id: item.id,
    name: item.name,
    website: item.website,
    patreon: item.patreon,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-1 p-8 pt-6">
        <DesignerClient data={formattedDesigners} />
      </div>
    </div>
  );
}
