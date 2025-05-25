---
trigger: always_on
---

# Rule – Core Development Environment

- OS: **NixOS** with flakes.  
- Shell: **zsh**.  
- Node.js **20.19.0**.  
- Package manager: **pnpm 10.6.3** — npm and yarn are disallowed.  
- **TypeScript strict** mode and **Tailwind CSS 4.0.14** are enabled by default.  
- Run `direnv reload` whenever `flake.nix` or `.envrc` changes.

Activation Mode: Always On
