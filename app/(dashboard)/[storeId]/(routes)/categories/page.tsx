import React from "react";
import prismaDb from "@/lib/prismadb";
import { format } from "date-fns";

import CategoryClient from "./components/CategoryClient";
import { CategoryColumn } from "./components/columns";

type Props = {
  params: { storeId: string };
};

export default async function Page({ params }: Props) {
  const categories = await prismaDb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map(item => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-1 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
}
