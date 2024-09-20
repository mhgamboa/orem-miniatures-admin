"use client";

import { ColumnDef } from "@tanstack/react-table";

import CellAction from "./CellAction";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DesignerColumn = {
  id: string;
  name: string;
  website: string;
  patreon: string | null;
  createdAt: string;
};

export const columns: ColumnDef<DesignerColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "website",
    header: "Website",
  },
  { accessorKey: "patreon", header: "Patreon" },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
