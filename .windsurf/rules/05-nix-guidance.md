---
trigger: model_decision
description: Apply when the query involves NixOS, flakes, direnv, or Nix-managed packages.
---

# Rule – Nix Flake Guidance

- `flake.nix` tracks **nixos-unstable** and uses **flake-utils**.  
- Key packages exposed: `nodejs_20`, `pnpm`, `tailwindcss`.  
- Tailwind is provided by Nix; avoid global npm installs.  
- If the environment behaves unexpectedly, run `direnv reload`.

Activation Mode: Model Decision  
Description: Apply when the query involves NixOS, flakes, direnv, or Nix-managed packages.
