# Medical Device Engineer Portfolio Website - Implementation Plan

## Project Overview

We'll create a modern, interactive portfolio website with the following features:
- Single-page layout with a smooth navigation experience
- Interactive project showcase with dynamic presentation
- OpenAI-powered chat interface to answer questions about your experience
- Minimalist design with muted cool tones and golden brass accents
- NixOS-based development environment

## Technology Stack

```mermaid
graph TD
    A[Portfolio Website] --> B[Frontend]
    A --> C[Backend]
    A --> D[Development Environment]
    
    B --> B1[React with TypeScript]
    B --> B2[Tailwind CSS]
    B --> B3[React Router]
    B --> B4[Framer Motion for animations]
    
    C --> C1[Node.js with TypeScript]
    C --> C2[Express.js]
    C --> C3[LangChain]
    C --> C4[OpenAI API]
    
    D --> D1[NixOS]
    D --> D2[Nushell]
    D --> D3[direnv]
    D --> D4[Nix Flake]
```

## Project Structure

```
medical-device-portfolio/
├── flake.nix                  # Nix development environment
├── .envrc                     # direnv configuration
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript configuration
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API client services
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   ├── assets/            # Static assets
│   │   ├── styles/            # Global styles
│   │   ├── App.tsx            # Main application component
│   │   └── index.tsx          # Application entry point
├── server/                    # Backend Express application
│   ├── src/
│   │   ├── api/               # API routes
│   │   ├── config/            # Configuration
│   │   ├── services/          # Business logic
│   │   ├── models/            # Data models
│   │   ├── utils/             # Utility functions
│   │   ├── middleware/        # Express middleware
│   │   └── index.ts           # Server entry point
├── shared/                    # Shared TypeScript types
└── scripts/                   # Build and development scripts
```

## Implementation Plan

### Phase 1: Development Environment Setup

1. Create a Nix flake for the development environment:
   - Define development shell with all required dependencies
   - Set up TypeScript, Node.js, and other development tools
   - Configure direnv for automatic environment activation

2. Initialize the project:
   - Set up monorepo structure with client and server
   - Configure TypeScript for both frontend and backend
   - Set up ESLint and Prettier for code quality

### Phase 2: Frontend Implementation

1. Create the React application structure:
   - Set up React with TypeScript
   - Integrate Tailwind CSS
   - Configure React Router for navigation

2. Implement core components:
   - Header with navigation
   - Footer with contact information
   - About Me section
   - Project showcase component
   - Chat interface component

3. Design system implementation:
   - Define color palette based on muted cool tones and golden brass accents
   - Create typography system
   - Implement responsive layout components

4. Implement interactive features:
   - Rotating project panels
   - Animations for smooth transitions
   - Form handling for contact section

```mermaid
graph TD
    A[Frontend Implementation] --> B[Component Architecture]
    A --> C[State Management]
    A --> D[Styling System]
    
    B --> B1[Layout Components]
    B --> B2[Page Components]
    B --> B3[Feature Components]
    
    B1 --> B1a[Header]
    B1 --> B1b[Footer]
    B1 --> B1c[Navigation]
    
    B2 --> B2a[Home]
    B2 --> B2b[About]
    B2 --> B2c[Projects]
    
    B3 --> B3a[Project Carousel]
    B3 --> B3b[Chat Interface]
    B3 --> B3c[Contact Form]
    
    C --> C1[React Context]
    C --> C2[Custom Hooks]
    
    D --> D1[Tailwind Configuration]
    D --> D2[Global Styles]
    D --> D3[Component-specific Styles]
```

### Phase 3: Backend Implementation

1. Set up Express.js server:
   - Configure TypeScript for Node.js
   - Set up API routes
   - Implement CORS and other middleware

2. Implement API endpoints:
   - Project data endpoint
   - Contact form endpoint
   - LLM chat endpoint

3. Integrate OpenAI API with LangChain:
   - Set up OpenAI API integration
   - Create prompt templates for portfolio-specific questions
   - Implement context retrieval for accurate responses about experience and projects
   - Configure OpenAI model parameters (temperature, max tokens, etc.)

```mermaid
graph TD
    A[Backend Implementation] --> B[Server Setup]
    A --> C[API Endpoints]
    A --> D[OpenAI Integration]
    
    B --> B1[Express Configuration]
    B --> B2[Middleware Setup]
    B --> B3[Error Handling]
    
    C --> C1[Projects API]
    C --> C2[Contact API]
    C --> C3[Chat API]
    
    D --> D1[LangChain Setup]
    D --> D2[Context Management]
    D --> D3[Response Generation]
    
    D1 --> D1a[OpenAI API Configuration]
    D2 --> D2a[Portfolio Data Embedding]
    D2 --> D2b[Retrieval Chain]
    D3 --> D3a[Prompt Templates]
    D3 --> D3b[Model Parameters]
```

### Phase 4: Integration and Testing

1. Connect frontend and backend:
   - Implement API client services
   - Set up environment-specific configuration

2. Test the application:
   - Unit testing for components and API endpoints
   - Integration testing for frontend-backend interaction
   - End-to-end testing for critical user flows

3. Optimize performance:
   - Implement code splitting
   - Optimize images and assets
   - Configure caching

### Phase 5: Deployment Preparation

1. Build process setup:
   - Configure build scripts for frontend and backend
   - Set up production environment variables

2. Deployment options:
   - Netlify/Vercel for frontend
   - Railway/Heroku/AWS for backend
   - Environment-specific configuration

## Technical Details

### Nix Flake Configuration

Here's an overview of what the `flake.nix` file will contain:

```nix
{
  description = "Medical Device Engineer Portfolio";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    snowfall-lib = {
      url = "github:snowfall-lib/flake";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, snowfall-lib, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            nodePackages.typescript
            nodePackages.typescript-language-server
            nodePackages.yarn
            nodePackages.pnpm
            nodePackages.eslint
            nodePackages.prettier
            direnv
          ];
          
          shellHook = ''
            echo "Medical Device Engineer Portfolio development environment"
            export PATH="$PWD/node_modules/.bin:$PATH"
          '';
        };
      }
    );
}
```

### OpenAI API Integration Architecture

```mermaid
graph TD
    A[Chat Interface] --> B[Frontend Chat Component]
    A --> C[Backend OpenAI Service]
    
    B --> B1[Chat UI]
    B --> B2[Message History]
    B --> B3[API Client]
    
    C --> C1[Express Endpoint]
    C --> C2[LangChain Integration]
    C --> C3[Context Manager]
    
    C2 --> C2a[OpenAI API Client]
    C2 --> C2b[Model Selection]
    C2 --> C2c[Parameter Configuration]
    
    C3 --> C3a[Vector Store]
    C3 --> C3b[Retrieval Chain]
    C3 --> C3c[Response Generation]
    
    C3a --> C3a1[Portfolio Data]
    C3a --> C3a2[Projects Data]
    C3a --> C3a3[Experience Data]
    
    C3b --> C3b1[Similarity Search]
    C3b --> C3b2[Context Window]
    
    C3c --> C3c1[Prompt Templates]
    C3c --> C3c2[Response Formatting]
```

## Timeline and Milestones

1. **Week 1**: Development environment setup and project initialization
   - Nix flake and direnv configuration
   - Project structure setup
   - Initial dependencies installation

2. **Week 2-3**: Frontend implementation
   - Component architecture
   - Pages and routing
   - Styling system
   - Basic interactions

3. **Week 4**: Backend implementation
   - Express server setup
   - API endpoints
   - Basic data handling

4. **Week 5**: OpenAI API integration
   - LangChain setup
   - Context management
   - Chat interface implementation

5. **Week 6**: Integration, testing, and optimization
   - Frontend-backend connection
   - Testing and debugging
   - Performance optimization

6. **Week 7**: Deployment and documentation
   - Build configuration
   - Deployment setup
   - Documentation