import React from "react";
import prismaDb from "@/lib/prismadb";
import { format } from "date-fns";

import { formatter } from "@/lib/utils";

import ProductClient from "./components/ProductClient";
import { ProductColumn } from "./components/columns";

type Props = {
  params: { storeId: string };
};

export default async function Page({ params }: Props) {
  const products = await prismaDb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      designer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map(product => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formatter.format(product.price.toNumber()),
    category: product.category?.name,
    size: product.size?.name,
    designer: product.designer?.name,
    createdAt: format(product.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-1 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
}
