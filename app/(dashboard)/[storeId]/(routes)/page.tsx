import React from "react";

type Props = {
  params: { storeId: string };
};

export default function DashboardPage({ params }: Props) {
  return <div>Active Store: {params.storeId}</div>;
}
