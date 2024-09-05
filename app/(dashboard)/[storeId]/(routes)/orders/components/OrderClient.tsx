"use client";
import React from "react";

import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/Heading";

import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/DataTable";

type Props = {
  data: OrderColumn[];
};

export default function OrderClient({ data }: Props) {
  return (
    <>
      <Heading title={`Orders ${data.length}`} description="Manage orders for your store" />
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
}
