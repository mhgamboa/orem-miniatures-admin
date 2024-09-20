"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Designer } from "@prisma/client";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Trash } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/AlertModal";

type Props = {
  initialData: Designer | null;
};

const formSchema = z.object({
  name: z.string().min(1),
  website: z.string().nullable(),
  patreon: z.string().nullable(),
});

type DesignerFormValues = z.infer<typeof formSchema>;

export default function DesignerForm({ initialData }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit Designers" : "Add Designers";
  const description = initialData ? "Edit a designer" : "Add a new designer";
  const toastMessage = initialData ? "Designers updated" : "Designers created";
  const action = initialData ? "Save Changes" : "Create Designers";

  const form = useForm<DesignerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "", patreon: "", website: "" },
  });

  const onSubmit = async (data: DesignerFormValues) => {
    try {
      setLoading(true);
      const { patreon, website } = data;
      const formattedData = {
        ...data,
        patreon: patreon === "" ? null : patreon,
        website: website === "" ? null : website,
      };
      initialData
        ? await axios.patch(`/api/${params.storeId}/designers/${params.designerId}`, formattedData)
        : await axios.post(`/api/${params.storeId}/designers`, formattedData);

      router.push(`/${params.storeId}/designers`);
      router.refresh();
      toast.success(toastMessage, { position: "top-center" });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/designers/${params.designerId}`);
      router.push(`/${params.storeId}/designers`);
      router.refresh();
      toast.success("Designer deleted", { position: "top-center" });
    } catch (error) {
      toast.error("Make sure you removed all products using this designer first");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete()}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button disabled={loading} variant="destructive" onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Designer Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Website"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="patreon"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Patreon</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Patreon"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      {/* <Separator /> */}
      {/* <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/stores/${params.storeId}`} variant="public" /> */}
    </>
  );
}
