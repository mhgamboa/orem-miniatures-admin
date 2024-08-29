"use client";
import { useOrigin } from "@/hooks/useOrigin";
import { useParams } from "next/navigation";
import React from "react";
import ApiAlert from "@/components/ui/ApiAlert";

type Props = {
  entityName: string;
  entityIdName: string;
};

export default function ApiList({ entityName, entityIdName }: Props) {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;
  return (
    <>
      <ApiAlert title="GET" variant="public" description={`${baseUrl}/${entityName}`} />
      <ApiAlert title="GET" variant="public" description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
      <ApiAlert title="POST" variant="admin" description={`${baseUrl}/${entityName}`} />
      <ApiAlert title="PATCH" variant="admin" description={`${baseUrl}/${entityName}`} />
      <ApiAlert title="DELETE" variant="admin" description={`${baseUrl}/${entityName}`} />
    </>
  );
}
