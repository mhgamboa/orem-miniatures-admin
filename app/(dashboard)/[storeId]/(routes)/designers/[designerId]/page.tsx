import React from "react";
import prismaDb from "@/lib/prismadb";
import DesignerForm from "./components/DesignerForm";

export default async function ColorPage({ params }: { params: { designerId: string } }) {
  const color = await prismaDb.designer.findUnique({
    where: {
      id: params.designerId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DesignerForm initialData={color} />
      </div>
    </div>
  );
}
