"use client";
import React from "react";
import { Copy, Server } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description: string;
  variant?: "public" | "admin";
};

const textMap: Record<NonNullable<Props["variant"]>, string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<NonNullable<Props["variant"]>, BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export default function ApiAlert({ title, description, variant = "public" }: Props) {
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("Copied to clipboard", { position: "top-center" });
  };
  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}

        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-mono font-semibold">{description}</code>
        <Button variant="outline" size="icon" onClick={onCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
