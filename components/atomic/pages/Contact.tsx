import React from 'react';
import { MainLayout, SectionLayout } from '@/components/atomic/templates';
import { ContactForm } from '@/components/atomic/organisms';
import { SocialLinks } from '@/components/atomic/molecules';

export default function Contact() {
  return (
    <MainLayout>
      <SectionLayout
        title="Get in Touch"
        subtitle="I'd love to hear from you about projects, collaborations, or just to say hello"
        centered
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Feel free to reach out to me directly or through the contact form.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Email</h4>
              <a 
                href="mailto:gagnon.derek@protonmail.com" 
                className="text-[#7cbddb] hover:underline"
              >
                gagnon.derek@protonmail.com
              </a>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Connect with me</h4>
              <SocialLinks direction="row" />
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Location</h4>
              <p className="text-gray-600 dark:text-gray-400">Boston, Massachusetts</p>
            </div>
          </div>
          
          {/* Contact form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </SectionLayout>
    </MainLayout>
  );
}