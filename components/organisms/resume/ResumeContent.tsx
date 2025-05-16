import React from 'react';

const Resume = () => {
  return (
    <div className="flex flex-col gap-8 p-8 bg-transparent text-black dark:bg-transparent dark:text-yellow-50">
      <ContactInfo />
      <Summary />
      <Experience />
      <Education />
      <Expertise />
      <ActiveProjects />
    </div>
  );
};

const ContactInfo = () => {
  return (
    <div className="grid grid-cols-2" 
      style={{ fontFamily: 'Times New Roman' }}
    >
      <h1 className="text-3xl font-semibold self-end">Derek T Gagnon</h1>
      <div className="text-right"> 
        <p>517-902-3799</p>
        <p>gagnon.derek@protonmail.com</p>
      </div>
    </div>
  );
};

const Summary = () => {
  return (
    <div className="summary">
      <h2 className="flex justify-center mb-2 text-xl font-bold border-b border-gray-200 dark:border-gray-600">SUMMARY</h2>
      <p className="flex justify-center text-lg font-bold mb-2">Systems Engineer • Medical Devices &amp; Biotechnology • PD Expertise</p>
      <ul className="list-disc px-4">
        <li>
          <strong>Med-Tech Engineering Professional with 9+ years of experience</strong> in the design and development of complex medical device systems, integrating mechanical, bio-chemical, and electro-optic subsystems for Class II, blood-contacting cardiovascular medical devices.
        </li>
        <li>
          <strong>Adept at leading cross-functional teams, prototyping solutions, and optimizing processes.</strong> Thrives in high-pressure, dynamic environments.
        </li>
        <li>
          <strong>Proven track record of delivering complex projects</strong> through the full product development lifecycle, from concept through production.
        </li>
        <li>
          <strong>Leverages unique background</strong> to combine a deep understanding of engineering principles with multidisciplinary problem-solving skills; meshing areas of expertise to innovate and scale new product portfolios.
      </li>
    </ul>
  </div>
  );
};

const Experience = () => {
  return (
  <div className="experience">
    <h2 className="flex justify-center mb-4 text-xl font-bold border-b border-[#e5e7eb] dark:border-[#4b5563]">EXPERIENCE</h2>
    <div className="experience-item">
      <div className="flex font-bold">
        <h3>TERUMO CARDIOVASCULAR - ANN ARBOR, MI</h3> <h3 className="ml-auto">2017 – 2024</h3>
      </div>
      <p className="text-sm italic">
        Manufacturer of class II cardiovascular medical devices used by perfusionists in surgeries requiring extracorporeal circulation, such as cardiopulmonary bypass surgeries, and include real-time blood parameter monitoring systems (CDI Monitoring Systems) and heart-lung machines (Advanced Perfusion Systems).
      </p>
      <h4 className="mt-2 font-bold">PRODUCT DEVELOPMENT ENGINEER</h4>
      <p className="mt-2 underline">Design, Develop, Prototype, Test, Refine, Verify &amp; Validate</p>
      <ul className="mt-2 list-disc px-4">
        <li>
          Assessed impacts of designs and manufacturing methods, ensuring suitability across relevant systems and subsystems through IBM Rationale DOORs traces and additional risk management tools.
        </li>
        <li>
          Refined and adapted system schemas to support development of clear and actionable requirements for evolving patient/user needs.
        </li>
        <li>
          Spearheaded creation of a novel variable-reference sensor and various manufacturing fixtures, employing SolidWorks and rapid prototyping techniques, cutting production costs and increasing manufacturing throughput capacity by 40%.
        </li>
        <li>
          Championed NPD labeling through full PD lifecycle, evaluating label and interface risks and ensuring regulatory and standards compliance.
        </li>
      </ul>
      <p className="mt-2 underline">Technical Leader, Collaborator &amp; Mentor</p>
      <ul className="mt-2 list-disc px-4">
        <li>
          Led cross-functional teams of senior engineers in critical design changes, reducing scrap by 25% and recovering $1M in annualized product value.
        </li>
        <li>
          Mentored and trained junior engineers through implementation of a new lab space.
        </li>
        <li>
          Collaborated with marketing and product management teams to align product features with market needs and industry trends, ensuring that PD activities supported the evolving business roadmap.
        </li>
        <li>
          Consistently relied upon to bring stalled project activities to resolution, on time, and within budget.
        </li>
      </ul>
      <p className="mt-2 underline">Process Improvement &amp; Strategic Problem Solving</p>
      <ul className="mt-2 list-disc px-4">
        <li>
          Advocated and drove implementation of MBSE tools to increase cross-functional alignment and reduce manual tracing overhead.
        </li>
        <li>
          Resolved inter-system technical issues through root cause analysis methodologies, delivering clear and actionable direction.
        </li>
      </ul>
      <p className="mt-2 underline">Design Controls, Quality Systems, &amp; Regulatory Compliance</p>
      <ul className="mt-2 list-disc px-4">
        <li>
          Developed and launched FDA- and ISO-compliant real-time blood parameter monitoring devices under strict design controls, guiding products from Conceptualization through to Design Transfer, for successful market launches.
        </li>
        <li>
          As SME, maintained product DHF and ensured compliance with GxP and medical device SOPs by conducting risk assessments and implementing CAPA processes, improving product quality and contributing to successful regulatory audits.
        </li>
      </ul>
    </div>
    <div className="experience-item mt-4">
      <div className="flex font-bold">
        <h3>ANDERSON DEVELOPMENT COMPANY – ADRIAN, MI</h3> <h3 className="ml-auto">2015 – 2017</h3>
      </div>
      <p className="text-sm italic">
        Specialty chemical manufacturer; develops advanced urethane elastomers and acrylic powders.
      </p>
      <h4 className="mt-2 font-bold">RESEARCH &amp; DEVELOPMENT ENGINEER</h4>
      <ul className="mt-2 list-disc px-4">
        <li>
          <strong>Optimized</strong> development processes for advanced urethane elastomers and acrylic powders, ensuring product compliance with industry health and safety standards, regulatory requirements, and alignment with customer and industry requirements.
        </li>
      </ul>
    </div>
  </div>
  );
};

const Education = () => {
  return (
  <div className="education">
    <h2 className="flex justify-center mb-4 text-xl font-bold border-b border-[#e5e7eb] dark:border-[#4b5563]">EDUCATION</h2>
    <div className="education-item mb-4">
      <h3 className="mb-0"><b>UNIVERSITY OF MICHIGAN – Materials Science &amp; Engineering</b></h3>
      <p className="mb-2"><small>Ann Arbor, Michigan</small></p>
      <h4 className="mb-1"><u>Relevant Coursework</u></h4>
      <ul className="list-disc px-4">
        <li>Engineering: Biotechnology and Human Values, Materials and Manufacturing, Physics of Materials, Thermodynamics of Materials, Structures of Materials, and Computation &amp; Programming</li>
        <li>Mathematics: Multivariable Calculus, Differential Equations, and Probability &amp; Statistics</li>
        <li>Physics: Modern Physics and Quantum Mechanics pertaining to solid-state physics and physical behavior of materials, Mechanics, and Electricity &amp; Magnetism</li>
        <li>Chemistry: Organic Chemistry Structure &amp; Reactivity and Molecular &amp; Cellular Biology</li>
        <li>Other: Microeconomics</li>
      </ul>
    </div>
    <div className="education-item">
      <h3 className="mb-0"><b>SIENA HEIGHTS UNIVERSITY – B.S. CHEMISTRY</b></h3>
      <p className="mb-2"><small>Adrian, Michigan</small></p>
      <h4 className="mb-1"><u>Relevant Coursework</u></h4>
      <ul className="list-disc px-4">
        <li>Chemistry: Physical-Instrument Analysis &amp; Statistics, Computational Chemistry, Analytical Chemistry, Physical Chemistry, Wet Chemistry, and laboratory techniques</li>
      </ul>
    </div>
  </div>
  );
};

const Expertise = () => {
  return (
  <div className="expertise">
    <h2 className="flex justify-center mb-4 text-xl font-bold border-b border-[#e5e7eb] dark:border-[#4b5563]">EXPERTISE</h2>
    <div className="grid grid-cols-1 gap-x-2 md:grid-cols-2">
      <ul className="list-disc px-4">
        <li><strong>Systems Engineering:</strong> Design of complex interfacing systems, IBM Rational DOORs, SOLIDWORKS, DFM&amp;A, Rapid Prototyping, and PDM (3DX)</li>
        <li><strong>Testing:</strong> Minitab, test design, V&amp;V, and TMV</li>
        <li><strong>Regulatory &amp; Standards Knowledge:</strong>  21 CFR 820, ISO-13485/14971, IEC 60601/62304, PMA, 510(k), Technical Filings, ANSI, ASME, ISO/IEC, and GxP</li>
        <li><strong>Unique Subject Matter Expertise:</strong> Ex vivo blood circuits, hemodynamics, chemical biosensors, fluorescent sensors, electro-optics, chemistry, and materials science</li>
      </ul>
      <ul className="list-disc px-4">
        <li><strong>Specialized Knowledge:</strong> Electromechanical systems, medical device development, verification & validation</li>
        <li><strong>Leadership:</strong> Finding and playing to team strengths; fostering team ownership of responsibilities and collaboration across functional groups</li>
        <li><strong>Process Trending and Improvements:</strong> Root-cause analysis (8D, Ishikawa, 5 Why) and implementing corrective actions (CAPA)</li>
        <li><strong>Other:</strong> Experienced with ML/AI applications and 3D printing technologies</li>
      </ul>
    </div>
  </div>
  );
};

const ActiveProjects = () => {
  return (
  <div className="active-projects">
    <h2 className="flex justify-center mb-4 text-xl font-bold border-b border-[#e5e7eb] dark:border-[#4b5563]">ACTIVE PROJECTS</h2>
    <div className="grid grid-cols-1 gap-x-2 md:grid-cols-2 gap-y-2">
      <div className="flex flex-col">
        <h3 className="font-bold">DTG Engineering – Engineering Services</h3>
        <p className="text-sm">Ann Arbor, Michigan</p>
        <p className="underline">Quality Management</p>
        <ul className="list-disc px-4">
          <li>Design of Quality Management Systems and Standard Operating Procedures to support specific industries and scale</li>
          <li>Conduct reviews of quality management systems</li>
          <li>Conduct reviews of manufacturing equipment and processes</li>
        </ul>
        <p className="underline">Mechanical/CAD</p>
        <ul className="list-disc px-4">
          <li>3D scan objects (file types: PLY, OBJ, STL)</li>
          <li>Design improvements</li>
          <li>Parametric 3D modelling</li>
          <li>Generate engineering drawings</li>
          <li>Prototype fabrication</li>
        </ul>
      </div>
      <div className="flex flex-col">
        <h3 className="flex justify-start font-bold">Personal Projects</h3>
        <ul className="list-disc px-4">
          <li>Designing medical device applications from bleeding-edge machine learning techniques</li>
          <li>Learning NixOS for deployment of declarative, reproducible systems and microservices</li>
          <li>
            Design, development, and production of:
            <ul className="list-none px-4">
              <li className="before:content-['○'] before:align-middle before:translate-y-[1px] before:text-xs before:mr-2">A custom ergonomic split mechanical keyboard</li>
              <li className="before:content-['○'] before:align-middle before:translate-y-[1px] before:text-xs before:mr-2">An interactive personal portfolio website (coming soon to derektgagnon.com)</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
  );
};

export default Resume;
