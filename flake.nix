{
  description = "Medical Device Portfolio Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; config.allowUnfree = true; };
      in {
        devShell = pkgs.mkShell {
          packages = with pkgs; [
            ungoogled-chromium
            lsof
          ];
          buildInputs = with pkgs; [
            nodePackages.tailwindcss
            nodePackages.postcss
            nodePackages.autoprefixer
            nodejs_22
            pnpm
          ];

          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"
            
            # Ensure port is free before starting
            lsof -ti:3000 | xargs kill -9 2>/dev/null || true
            sleep 1
            
            # Start chromium if not already running
            if ! pgrep -f "chromium.*remote-debugging-port=9222" >/dev/null; then
              echo "Starting Chromium debug instance..."
              ${pkgs.ungoogled-chromium}/bin/chromium --remote-debugging-port=9222 &
              sleep 2  # Give chromium time to start
            else
              echo "Chromium debug instance already running"
            fi
            
            # Start development server in background
            echo "Starting development server..."
            PORT=3000 pnpm dev &
            
            echo "Development environment ready!"
          '';
        };
      }
    );
}