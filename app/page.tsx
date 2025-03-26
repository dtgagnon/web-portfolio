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
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen max-w-[1920px] mx-auto gap-6 p-4 pb-5 font-[family-name:var(--font-geist-sans)]">
      <header className="flex items-center justify-between px-4 py-2 bg-background">
        <div className="flex w-1/3 justify-start">
          <Image
            src="/images/derek-logo.jpg"
            alt="Logo"
            width={100}
            height={100}
            priority
          />
        </div>

        <div className="flex w-1/3 justify-center">
          {/* Center content can go here */}
        </div>

        <div className="flex w-1/3 justify-end">
          <NavLinks />
        </div>
      </header>

      <main className="flex items-center justify-center">
        <div className="flex-col w-full items-center self-end">
          <div className="flex space-x-8 mb-4">
            <SocialMediaLinks />
            <ContactInfo />
          </div>
          <div className="border-b border-dotted border-gray-400 w-full mt-2" />
        </div>
        
        <div className="flex w-full min-h-[200px] justify-center items-center">
          <Image
            className="rounded-full"
            src="/images/profile.jpg"
            alt="Picture of Derek Gagnon"
            width={200}
            height={200}
            priority
          />
        </div>
        
        <div className="flex-col w-full text-center sm:text-right font-[family-name:var(--font-geist-sans)] self-start">
          <AboutMe />
          <div className="border-b border-dotted border-gray-400 w-full mt-2" />
        </div>
      </main>

      <footer className="flex items-center justify-between">
        <div className="flex w-1/3 justify-start">
          <p className="text-xs text-gray-500">© 2025 Derek Gagnon</p>
        </div>
        <div className="flex w-1/3 justify-center">
          <ChatCard content="" />
        </div>
        <div className="flex w-1/3 justify-end">
          <p className="text-xs text-gray-500">All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}