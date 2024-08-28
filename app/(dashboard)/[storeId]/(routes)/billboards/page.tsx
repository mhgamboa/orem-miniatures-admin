import React from "react";
import BillboardClient from "./components/BillboardClient";

export default function Page() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-1 p-8 pt-6">
        <BillboardClient />
      </div>
    </div>
  );
}
