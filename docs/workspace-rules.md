# Workspace Rules & Development Principles

## Code Style & Structure

- Use spaces for indentation, with a width of 2 spaces
- Use camelCase for variable names
- Use absolute imports with the '@/' prefix for internal paths
- Write unit tests for all new functions
- Explain reasoning before providing code
- Focus on code readability and maintainability
- Prioritize using the most common library in the community
- When adding new features to websites, ensure they are responsive and accessible

## Atomic Design Structure

Components must be organized according to the atomic design methodology:

1. **Atoms**: Basic building blocks that can't be broken down further
   - Located in `components/atoms/`
   - Examples: Button, Input, Badge, Icon

2. **Molecules**: Simple groups of UI elements functioning together as a unit
   - Located in `components/molecules/`
   - Examples: SearchBar, ProjectCard, FormField

3. **Organisms**: Complex UI components composed of groups of molecules/atoms
   - Located in `components/organisms/`
   - Examples: Navigation, ProjectList, Footer

4. **Templates**: Page layouts without real content
   - Located in `components/templates/`
   - Examples: MainLayout, ProjectLayout

5. **Pages**: Specific instances of templates with real content
   - Located in `components/pages/` or `app/` (Next.js)
   - Examples: HomePage, ProjectsPage

**Important**: Never create component directories outside this hierarchy (e.g., no `components/ui/` directory).

## Test-Driven Development (TDD)

All development must follow TDD principles:

1. **Red Phase**: Write tests first that define the expected behavior, and run them to see them fail
   - Tests should be in the `__tests__` directory with a structure mirroring the component structure
   - Example: `__tests__/components/atoms/Badge.test.tsx`

2. **Green Phase**: Implement the minimal code required to make the tests pass
   - Do not add functionality beyond what the tests verify
   - Run tests again to confirm they pass

3. **Refactor Phase**: Clean up the code while ensuring tests continue to pass
   - Improve design, remove duplication, enhance readability
   - Run tests after each refactoring step

## Project Structure

- Capture development plans in `./docs/dev-plans/`
- Place data files in `./data/`
- Store shared utilities in `./lib/`
- Keep test files in `__tests__/` directory with a structure mirroring the code structure

The project follows this standard structure:

```
.
├── app/           # Next.js app router directory (pages, layouts, etc.)
│   ├── api/       # API routes
│   └── (routes)   # Route groups and pages
├── components/    # React components organized by atomic design:
│   ├── atoms/     # Basic building blocks (Button, Badge, etc.)
│   ├── molecules/ # Simple groups of UI elements (Card, SearchBar, etc.)
│   ├── organisms/ # Complex UI components (Navigation, Footer, etc.)
│   ├── templates/ # Page layouts (MainLayout, ProjectLayout, etc.)
│   └── pages/     # Specific instances of templates with real content
├── lib/           # Shared utilities
│   ├── api/       # API client functions
│   └── utils/     # Helper functions
├── public/        # Static assets
├── scripts/       # Development scripts
├── docs/          # Documentation and development plans
├── __tests__/     # Test files mirroring the component structure
├── flake.nix      # Nix development environment
├── package.json   # Project dependencies
├── tsconfig.json  # TypeScript configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## Content Structure

- Projects use the following standardized structure:
  - `id`: Slug-based identifier
  - `title`: Project title
  - `description`: Project description
  - `imageUrl`: Path to project image
  - `link`: URL to project detail page
  - `category`: Project category
  - `skills`: Array of skills used (displayed as "Technologies" for software projects)
  - `tags`: Array of tags for filtering/categorization

## Technology Stack

- **Frontend**:
  - Next.js 15
  - TypeScript 5.8.2
  - Tailwind CSS 4.0.14
- **Backend**:
  - Node.js
- **AI Integration**:
  - OpenAI API or Hugging Face Transformers
  - LangChain
- **Package Manager**: pnpm 10.6.3 (NEVER use npm or yarn)
- **Development Environment**: NixOS with direnv for environment management
- **Testing**: Vitest and React Testing Library

## System Configuration

- **Operating System**: NixOS
- **Shell**: zsh
- **Node.js Version**: 20.19.0

## Nix Configuration

- **Flake Inputs**:
  - nixpkgs (nixos-unstable)
  - flake-utils
- **Development Packages**:
  - nodejs_20
  - pnpm
  - tailwindcss

## Important Notes

1. All command line instructions should use zsh syntax
2. Development environment is managed through Nix flakes
3. Use direnv for environment management (`direnv reload` to refresh the dev environment)
4. Tailwind CSS configuration requires Nix package installation
5. TypeScript is configured with strict mode and modern ES features
