"use client"

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react"

function Header() {
  const route = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="h-16 m-auto flex justify-between sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2 px-4">
      <div className="">
        <Image src="/image/logo.jpg" width={50} height={50} alt="logo" />
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Navigation Menu */}
      <ul className={`
        md:flex md:gap-4 md:items-center md:w-full md:justify-end text-red-700
        absolute md:relative top-16 md:top-0 left-0 md:left-auto
        w-full md:w-auto bg-white md:bg-transparent
        flex-col md:flex-row items-center
        py-4 md:py-0 space-y-4 md:space-y-0
        border-b md:border-0
        ${isMenuOpen ? 'flex' : 'hidden'}
      `}>
        <li className="hover:text-red-400">
          <Link href={"/"}>Home</Link>
        </li>
        <li className="hover:text-red-400">
          <Link href={"/pages/about"}>About</Link>
        </li>
        <li className="hover:text-red-400">
          <Link href={"/pages/forum"}>Forum</Link>
        </li>
        <li className="hover:text-red-400">
          <Link href={"/pages/contacts"}>Contacts</Link>
        </li>
        <li>
          <Button
            variant="destructive"
            className="rounded-full"
            onClick={() => route.push("/user")}
          >
            Get started
          </Button>
        </li>
      </ul>
    </header>
  );
}

export default Header;
