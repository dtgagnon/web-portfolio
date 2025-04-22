'use client'

import Image from "next/image";
import ChatCard from "@/components/organisms/chat/ChatCard";
import ContactInfo from "@/components/molecules/ContactInfo";
import AboutMe from "@/components/organisms/About";
import SocialLinks from "@/components/molecules/SocialLinks";
import NavLink from "@/components/molecules/NavLink";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen min-w-[860px] max-w-[1920px] mx-auto gap-6 p-4 pt-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex items-center justify-between px-4 py-2">
        <div className="flex w-1/3 justify-start relative group">
          <Image
            src="/images/derek-logo.jpg"
            alt="Logo"
            width={80}
            height={80}
            priority
            className="transition-opacity duration-300 ease-in-out z-10 group-hover:opacity-0"
          />
          <Image
            src="/images/logo-ani-0.jpeg" 
            alt="Logo Hover"
            width={80}
            height={80}
            priority
            className="absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
          />
        </div>

        <div className="flex w-1/3 justify-center">
          {/* Center content can go here */}
        </div>

        <div className="flex w-1/3 justify-end">
          <div className="flex space-x-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/projects">Projects</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>
        </div>
      </header>

      <main className="flex mx-10 my-110 items-center justify-center">
        <div className="flex flex-col w-full items-center self-end">
          <div className="flex space-x-8 mb-4">
            <SocialLinks />
            <ContactInfo name="Derek Gagnon" email="gagnon.derek@protonmail.com" />
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