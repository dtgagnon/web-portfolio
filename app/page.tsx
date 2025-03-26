'use client'

import { useState } from "react";
import Image from "next/image";
import ChatCard from "@/components/features/ChatCard";
import ContactInfo from "@/components/features/ContactInfo";
import ResumeCard from "@/components/features/resume/ResumeCard";
import AboutMe from "@/components/features/AboutMe";
import SocialMediaLinks from "@/components/features/SocialMediaLinks";
import NavLinks from "@/components/layout/header/NavLinks";

export default function Home() {
  return (
    <div className="flex flex-col justify-center min-h-screen max-w-[1920px] mx-auto p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex items-center justify-between px-4 py-2 bg-background">
        <div className="w-1/3 flex justify-start">
          <Image
            src="/images/derek-logo.jpg"
            alt="Logo"
            width={100}
            height={100}
            priority
          />
        </div>

        <div className="w-1/3 flex justify-center">
          {/* Center content can go here */}
        </div>

        <div className="w-1/3 flex justify-end">
          <NavLinks />
        </div>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center justify-items-center w-full">
        <div className="sm:col-span-1 w-full self-end">
          <div className="flex space-x-4 mb-4">
            <SocialMediaLinks />
            <ContactInfo />
          </div>
          <div className="border-b border-dotted border-gray-400 w-full mt-2" />
        </div>
        
        <div className="sm:col-span-1 flex justify-center">
          <Image
            className="rounded-full"
            src="/images/profile.jpg"
            alt="Picture of Derek Gagnon"
            width={200}
            height={200}
            priority
          />
        </div>
        
        <div className="sm:col-span-1 text-center sm:text-right font-[family-name:var(--font-geist-sans)] self-start">
          <AboutMe />
        </div>
      </main>

      <footer className="flex min-h-screen items-center justify-between w-full">
        <div className="flex justify-start">
          <p className="text-xs text-gray-500">© 2025 Derek Gagnon</p>
        </div>
        <div className="flex justify-center">
          <ChatCard content="" />
        </div>
        <div className="flex justify-end">
          <p className="text-xs text-gray-500">All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}