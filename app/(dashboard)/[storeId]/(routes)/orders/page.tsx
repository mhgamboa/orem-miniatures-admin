import React from "react";
import prismaDb from "@/lib/prismadb";
import { format } from "date-fns";

import OrderClient from "./components/OrderClient";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

type Props = {
  params: { storeId: string };
};

export default async function Page({ params }: Props) {
  const orders = await prismaDb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedorders: OrderColumn[] = orders.map(order => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    products: order.orderItems.map(orderItem => orderItem.product.name).join(", "),
    totalPrice: formatter.format(order.orderItems.reduce((acc, orderItem) => acc + Number(orderItem.product.price), 0)),
    isPaid: order.isPaid,
    createdAt: format(order.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-1 p-8 pt-6">
        <OrderClient data={formattedorders} />
      </div>
    </div>
  );
}
