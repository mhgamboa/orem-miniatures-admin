import React from "react";
import prismaDb from "@/lib/prismadb";
import CategoryForm from "./components/CategoryForm";

export default async function CategoryPage({ params }: { params: { categoryId: string; storeId: string } }) {
  const category = await prismaDb.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  const billboard = await prismaDb.billboard.findMany({
    where: { storeId: params.storeId },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboard} />
      </div>
    </div>
  );
}
