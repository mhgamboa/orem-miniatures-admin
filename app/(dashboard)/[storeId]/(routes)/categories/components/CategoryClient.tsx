"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/Heading";
import ApiList from "@/components/ui/ApiList";

import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/DataTable";

type Props = {
  data: CategoryColumn[];
};

export default function CategoryClient({ data }: Props) {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Categories ${data.length}`} description="Manage Categories for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API calls for Categories" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
}
