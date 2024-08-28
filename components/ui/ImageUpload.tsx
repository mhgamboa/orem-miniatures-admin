"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";

type Props = {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
};

export default function ImageUpload({ disabled, onChange, onRemove, value }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) return null;
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map(url => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button variant="destructive" size="icon">
                <Trash className="h-4 w-4" type="button" onClick={() => onRemove(url)} />
              </Button>
            </div>
            <Image fill className="object-cover" src={url} alt="Image" />
          </div>
        ))}
      </div>
      <CldUploadWidget onSuccess={onUpload} uploadPreset="lcptybcd">
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button type="button" onClick={onClick} disabled={disabled} variant="secondary">
              <ImagePlus className="h-4 w-4 mr-2" type="button" /> Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
