# Medical Device Portfolio

A portfolio website for a product development engineer in the medical device industry, showcasing skills, experience, and projects with a focus on quality and regulatory knowledge.

## Features

- Single-page layout with a separate "About Me" section
- Interactive project panels that showcase medical device projects
- LLM-powered chat interface to answer questions about experience
- Responsive design with a minimalist aesthetic
- Built with React, TypeScript, and Tailwind CSS

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **AI Integration**: OpenAI API or Hugging Face Transformers with LangChain
- **Development Environment**: NixOS with Nushell

## Prerequisites

All prerequisites shall be declared within the project's [flake.nix](./flake.nix) file.

## Development Environment Setup

This project uses Nix flakes for development environment management. To set up the development environment:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd medical-device-portfolio
   ```

2. Enter the Nix development shell:
   ```bash
   direnv allow .
   ```

   *OR*

   ```bash
   nix develop
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

## Running the Application

### Development Mode

To run the application in development mode:

```bash
pnpm dev
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

### Production Build

To create a production build:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

## Project Structure

```
.
├── client/        # Frontend code
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── styles/      # CSS styles
│   └── public/      # Static assets
├── server/        # Backend code
│   ├── routes/      # API routes
│   ├── controllers/ # Route controllers
│   └── middleware/  # Express middleware
├── shared/        # Shared utilities
├── scripts/       # Development scripts
├── flake.nix      # Nix development environment
├── package.json   # Project dependencies
└── tsconfig.json  # TypeScript configuration
```

## LLM Integration

The chat interface is powered by an LLM that can answer questions about the user's experience, skills, and projects. The LLM integration can be configured to use either:

- OpenAI API with LangChain
- Hugging Face Transformers with LangChain

## License

ISC