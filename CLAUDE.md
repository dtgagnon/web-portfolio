# CLAUDE.md - Guidelines for Medical Device Portfolio Project

## Build Commands
- `pnpm install` - Install dependencies
- `pnpm dev` - Run development server (http://localhost:3000)
- `pnpm build` - Create production build
- `pnpm start` - Start production server

## Code Style

### Component Patterns
- Use functional components with explicit React.FC typing
- Props interfaces defined near components
- PascalCase for component files and names
- Prefer hooks (useState, useEffect) for state management

### Naming Conventions
- Components: PascalCase (ProjectPanel)
- Functions/variables: camelCase (handleSubmit, isExpanded)
- Interfaces: PascalCase, descriptive (Message, ProjectData)

### Import Structure
- React imports first
- Component imports second
- Type/interface imports grouped together
- Absolute paths for packages, relative for local files

### Styling
- Tailwind CSS for styling with utility classes
- Custom animations and components in main.css
- Theme colors as CSS variables

### TypeScript
- Use explicit typing for function parameters and returns
- Avoid any type when possible
- Use interfaces for complex object shapes