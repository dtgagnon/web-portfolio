import Image from "next/image";
import ChatCard from "@/components/ChatCard";
import ContactInfo from "@/components/ContactInfo";
import AboutMe from "@/components/AboutMe";
import SocialMediaLinks from "@/components/SocialMediaLinks";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex items-center justify-between px-4 py-2 bg-background w-full">
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
          <nav>
            <ul className="flex gap-4 font-[family-name:var(--font-geist-sans)]">
              <li><a href="#about" className="hover:underline">About</a></li>
              <li><a href="#projects" className="hover:underline">Projects</a></li>
              <li><a href="#resume" className="hover:underline">Resume</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-3 gap-8 row-start-2 items-center justify-items-center w-full">
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
            width={180}
            height={180}
            priority
          />
        </div>
        
        <div className="sm:col-span-1 text-center sm:text-right font-[family-name:var(--font-geist-sans)] self-start">
          <AboutMe />
        </div>
      </main>

      <footer className="row-start-3 grid grid-cols-3 w-full">
        <div className="flex justify-start">
          <p className="text-xs text-gray-500">© 2025 Derek Gagnon</p>
        </div>
        <div className="flex justify-center">
          <ChatCard />
        </div>
        <div className="flex justify-end">
          <p className="text-xs text-gray-500">All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
