"use client";

import { useEffect } from "react";

import { useStoreModal } from "@/hooks/use-store-modal";

export default function SetupPage() {
  const isOpen = useStoreModal(s => s.isOpen);
  const onOpen = useStoreModal(s => s.onOpen);

  useEffect(() => {
    if (!isOpen) onOpen();
  }, [isOpen, onOpen]);

  return <div className="p-4">Root page</div>;
}
