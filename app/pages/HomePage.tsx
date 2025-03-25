import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>My Portfolio | Home</title>
        <meta name="description" content="Welcome to my professional portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <section className="mb-10">
          <h1 className="text-4xl font-bold mb-4">Welcome to My Portfolio</h1>
          <p className="text-lg text-gray-700">
            I'm a passionate developer building innovative solutions.
          </p>
        </section>

        <div className="flex mb-6 border-b">
          <button
            className={`px-4 py-2 mr-2 ${activeTab === 'profile' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'projects' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
        </div>

        {activeTab === 'profile' && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">About Me</h2>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <div className="bg-gray-200 w-48 h-48 rounded-full mx-auto"></div>
              </div>
              <div className="md:w-2/3">
                <p className="mb-4">
                  I'm a full-stack developer with expertise in React, Next.js, and Node.js.
                  I specialize in building responsive and performant web applications.
                </p>
                <div className="flex space-x-4">
                  <Link href="/contact" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Contact Me
                  </Link>
                  <Link href="/resume" className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50">
                    View Resume
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'projects' && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-gray-200 h-40"></div>
                  <div className="p-4">
                    <h3 className="text-xl font-medium mb-2">Project {item}</h3>
                    <p className="text-gray-600 mb-4">
                      A brief description of project {item} and the technologies used.
                    </p>
                    <Link href={`/projects/${item}`} className="text-blue-500 hover:underline">
                      Learn more →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default HomePage;
