import { UserButton } from "@clerk/nextjs";
import React from "react";
import MainNav from "@/components/MainNav";

export default function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div>This will be a store switcher</div>
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton />
        </div>
      </div>
    </div>
  );
}
