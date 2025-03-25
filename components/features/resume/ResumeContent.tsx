import React from 'react';

const Resume = () => {
  return (
    <div className="resume">
      <ContactInfo />
      <Summary />
      <Experience />
      <Education />
      <Expertise />
      <ActiveProjects />
      <PersonalProjects />
    </div>
  );
};

const ContactInfo = () => (
  <div className="contact-info">
    <p>517-902-3799</p>
    <h1>Derek T Gagnon</h1>
    <p>gagnon.derek@gmail.com</p>
  </div>
);

const Summary = () => (
  <div className="summary">
    <h2>SUMMARY</h2>
    <p>Research &amp; Product Development • Medical Devices &amp; Biotechnology</p>
    <p>
      Innovative and results-driven engineer with 7+ years of experience in the design and development of complex medical device systems, integrating mechanical, bio-chemical, and electro-optic subsystems for Class II, blood-contacting cardiovascular medical devices.
    </p>
    <p>
      Adept at leading cross-functional teams, prototyping solutions, and optimizing processes. Thrives in high-pressure, dynamic environments.
    </p>
    <p>
      Proven track record of delivering complex projects through the full product development lifecycle, from concept through production and into new markets.
    </p>
    <p>
      Leverages unique background to combine a deep understanding of engineering principles with multidisciplinary problem-solving skills; meshing areas of expertise to innovate and scale new product portfolios.
    </p>
  </div>
);

const Experience = () => (
  <div className="experience">
    <h2>Experience</h2>
    <div className="experience-item">
      <h3>TERUMO CARDIOVASCULAR – ANN ARBOR, MI (2017 – 2024)</h3>
      <p>
        Manufacturer of class II cardiovascular medical devices used by perfusionists in surgeries requiring extracorporeal circulation, such as cardiopulmonary bypass surgeries, and include real-time blood parameter monitoring systems (CDI Monitoring Systems) and heart-lung machines (Advanced Perfusion Systems).
      </p>
      <h4>PRODUCT DEVELOPMENT ENGINEER</h4>
      <p><strong>Design, Develop, Prototype, Test, Refine, Verify &amp; Validate</strong></p>
      <ul>
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
      <h4>Technical Leader, Collaborator &amp; Mentor</h4>
      <ul>
        <li>
          Led cross-functional teams of senior engineers in critical design changes, reducing scrap by 25% and recovering $200k in product value.
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
      <h4>Process Improvement &amp; Strategic Problem Solving</h4>
      <ul>
        <li>
          Advocated and drove implementation of MBSE tools to increase cross-functional alignment and reduce manual tracing overhead.
        </li>
        <li>
          Resolved inter-system technical issues through root cause analysis methodologies, delivering clear and actionable direction.
        </li>
      </ul>
      <h4>Design Controls, Quality Systems, &amp; Regulatory Compliance</h4>
      <ul>
        <li>
          Developed and launched FDA- and ISO-compliant real-time blood parameter monitoring devices under strict design controls, guiding products from Conceptualization through to Design Transfer, for successful market launches.
        </li>
        <li>
          As SME, maintained product DHF and ensured compliance with GxP and medical device SOPs by conducting risk assessments and implementing CAPA processes, improving product quality and contributing to successful regulatory audits.
        </li>
      </ul>
    </div>
    <div className="experience-item">
      <h3>Henderson Development Company – Adrian, MI (2015 – 2017)</h3>
      <p>
        Specialty chemical manufacturer; develops advanced urethane elastomers and acrylic powders.
      </p>
      <h4>Research &amp; Development ENGINEER</h4>
      <ul>
        <li>
          Optimized development processes for advanced urethane elastomers and acrylic powders, ensuring product compliance with industry health and safety standards, regulatory requirements, and alignment with customer and industry requirements.
        </li>
      </ul>
    </div>
  </div>
);

const Education = () => (
  <div className="education">
    <h2>Education</h2>
    <div className="education-item">
      <h3>UNIVERSITY OF MICHIGAN – Materials Science &amp; Engineering</h3>
      <p>Ann Arbor, Michigan</p>
      <h4>Relevant Coursework</h4>
      <p>
        Engineering: Biotechnology and Human Values, Materials and Manufacturing, Physics of Materials, Thermodynamics of Materials, Structures of Materials, and Computation &amp; Programming
      </p>
      <p>
        Mathematics: Multivariable Calculus, Differential Equations, and Probability &amp; Statistics
      </p>
      <p>
        Physics: Modern Physics and Quantum Mechanics pertaining to solid-state physics and physical behavior of materials, Mechanics, and Electricity &amp; Magnetism
      </p>
      <p>
        Chemistry: Organic Chemistry Structure &amp; Reactivity and Molecular &amp; Cellular Biology
      </p>
      <p>
        Other: Microeconomics
      </p>
    </div>
    <div className="education-item">
      <h3>SIENA HEIGHTS UNIVERSITY – B.S. CHEMISTRY</h3>
      <p>Adrian, Michigan</p>
      <h4>Relevant Coursework</h4>
      <p>
        Chemistry: Physical-Instrument Analysis &amp; Statistics, Computational Chemistry, Analytical Chemistry, Physical Chemistry, Wet Chemistry, and laboratory techniques
      </p>
    </div>
  </div>
);

const Expertise = () => (
  <div className="expertise">
    <h2>Expertise</h2>
    <ul>
      <li><strong>General Engineering:</strong> IBM Rational DOORs, SolidWorks, DFM&amp;A, Rapid Prototyping, “failing fast”, PDM, and PLM</li>
      <li><strong>Testing:</strong> Minitab, test design, V&amp;V, and TMV</li>
      <li><strong>Regulatory &amp; Standards Knowledge:</strong> Device regulatory compliance (21CFR, ANSI, ASME, ISO/IEC, GMP)</li>
      <li><strong>Unique Subject Matter Expertise:</strong> Ex vivo blood circuits; hemodynamics; chemical biosensors; fluorescence; electro-optics; chemistry; and materials science</li>
      <li><strong>Leadership:</strong> Finding and playing to team strengths; fostering team ownership of responsibilities and collaboration across functional groups</li>
      <li><strong>Process Trending and Improvements:</strong> Root-cause analysis (8D, Ishikawa, 5 Why) and implementing corrective actions (CAPA)</li>
      <li><strong>Other:</strong> Experienced with ML/AI applications and 3D printing technologies</li>
    </ul>
  </div>
);

const ActiveProjects = () => (
  <div className="active-projects">
    <h2>Active Projects</h2>
    <h3>RevEng Technologies – Reverse Engineering Services</h3>
    <p>Ann Arbor, Michigan</p>
    <ul>
      <li>3D scan objects</li>
      <li>Produce common mesh file types (PLY, OBJ, STL) from 3D scans</li>
      <li>Design improvements</li>
      <li>Parametric 3D modelling</li>
      <li>Generate engineering drawings for fabrication</li>
    </ul>
  </div>
);

const PersonalProjects = () => (
  <div className="personal-projects">
    <h2>Personal Projects</h2>
    <ul>
      <li>Designing medical device applications from bleeding-edge machine learning techniques</li>
      <li>Learning NixOS for deployment of declarative, reproducible systems</li>
      <li>
        Design, development, and production of:
        <ul>
          <li>A custom ergonomic split mechanical keyboard</li>
          <li>An interactive personal portfolio website (coming soon to derektgagnon.com)</li>
        </ul>
      </li>
    </ul>
  </div>
);

export default Resume;
