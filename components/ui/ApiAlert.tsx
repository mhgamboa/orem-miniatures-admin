"use client";
import React from "react";

type Props = {
  title: string;
  description: string;
  variant: "public" | "admin";
};

const textMap: Record<Props["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<Props["variant"], string> = {
  public: "secondary",
  admin: "destructive",
};

export default function ApiAlert() {
  return <div>ApiAlert</div>;
}
