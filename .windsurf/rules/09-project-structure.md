---
trigger: always_on
---

# Rule – Project Structure Reference

- `app/`          – Next.js routes, layouts, API handlers  
- `components/`   – atoms → pages per Atomic Design  
- `lib/`          – shared utilities (`api/`, `utils/`)  
- `data/`         – static or generated data files  
- `docs/`         – documentation and dev-plans  
- `public/`       – static assets  
- `__tests__/`    – mirrors component hierarchy  
- Root configs: `flake.nix`, `package.json`, `tsconfig.json`, `tailwind.config.js`

Activation Mode: Always On
