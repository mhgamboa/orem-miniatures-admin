"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Product, Image, Category, Size, Designer } from "@prisma/client";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Trash } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/AlertModal";
import ImageUpload from "@/components/ui/ImageUpload";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  initialData: Product | null;
  categories: Category[];
  sizes: Size[];
  designers: Designer[];
};

// interface Props {
//   initialData:
//     | (Product & {
//         images: Image[];
//       })
//     | null;
// }

const formSchema = z.object({
  name: z.string().min(1),
  images: z
    .object({
      url: z.string().min(1),
    })
    .array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  designerId: z.string().min(1),
  isFeatured: z.boolean(),
  isArchived: z.boolean(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export default function ProductForm({ initialData, categories, sizes, designers }: Props) {
  console.log("product form");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit Product" : "Add Product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const toastMessage = initialData ? "Product updated" : "Product created";
  const action = initialData ? "Save Changes" : "Create Product";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData, price: parseFloat(String(initialData.price)) }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          sizeId: "",
          designerId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      console.log(data);
      initialData
        ? await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
        : await axios.post(`/api/${params.storeId}/products`, data);
      // Rewriitten wiothout axios
      // const response = await fetch(`/api/${params.storeId}/products/${params.productId}`, {
      //   method: initialData ? "PATCH" : "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });
      // const data = await response.json();

      router.push(`/${params.storeId}/products`);
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.push(`/${params.storeId}/products`);
      router.refresh();
      toast.success("Product deleted", { position: "top-center" });
    } catch (error) {
      toast.error("Something went wrong");
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
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map(image => image.url)}
                      disabled={loading}
                      onChange={url => field.onChange([...field.value, { url }])}
                      onRemove={url =>
                        field.onChange([...field.value.filter(current => current.url !== url)])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Product Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} placeholder="Select a size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizes.map(size => (
                          <SelectItem key={size.id} value={size.id}>
                            {size.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="designerId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Designer</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} placeholder="Select a designer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {designers.map(designer => (
                          <SelectItem key={designer.id} value={designer.id}>
                            {designer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>This product will appear on the homepage</FormDescription>
                    </div>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Archived</FormLabel>
                      <FormDescription>
                        This product will not appear anywhere in the store
                      </FormDescription>
                    </div>
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
