"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";

export default function StoreModal() {
  const isOpen = useStoreModal(s => s.isOpen);
  const onClose = useStoreModal(s => s.onClose);
  return (
    <Modal title="Create store" description="Description" isOpen={isOpen} onClose={onClose}>
      Future Create Store Form
    </Modal>
  );
}
