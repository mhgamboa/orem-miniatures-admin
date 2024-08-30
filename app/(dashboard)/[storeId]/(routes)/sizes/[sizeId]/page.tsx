import React from "react";
import prismaDb from "@/lib/prismadb";
import SizeForm from "./components/SizeForm";

export default async function SizePage({ params }: { params: { sizeId: string } }) {
  const size = await prismaDb.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
}
