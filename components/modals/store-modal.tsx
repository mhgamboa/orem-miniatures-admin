"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export default function StoreModal() {
  const isOpen = useStoreModal(s => s.isOpen);
  const onClose = useStoreModal(s => s.onClose);

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: { name: "" } });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const res = await axios.post("/api/stores", value);
      window.location.assign(`/${res.data.id}`);
    } catch (error) {
      toast.error("Something went wrong", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Create store" description="Description" isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="E-Commerce" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button disabled={loading} type="submit">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
