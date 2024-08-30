"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/Heading";
import ApiList from "@/components/ui/ApiList";

import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/DataTable";

type Props = {
  data: ColorColumn[];
};

export default function ColorClient({ data }: Props) {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Colors ${data.length}`} description="Manage colors for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API calls for Colors" />
      <Separator />
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
}
