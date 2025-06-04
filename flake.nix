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
            nixd
          ];
          buildInputs = with pkgs; [
            nodejs_22
            pnpm
            tailwindcss_4
            
            # database dependencies
            sqlite
            python3
            pkg-config
            gcc
            google-cloud-sdk # Added for Gemini API migration
          ];

          shellHook = ''
            # Ensure node_modules/.bin is in PATH
            export PATH="$PWD/node_modules/.bin:$PATH"

            # Configure pnpm to *not* ignore build scripts within this shell
            # This bypasses the need for 'pnpm approve-builds'
            export npm_config_ignore_scripts=false

            # Create pnpm workspace config
            if [ ! -f ./pnpm-workspace.yaml ]; then
              touch ./pnpm-workspace.yaml
              echo "onlyBuiltDependencies:
              - better-sqlite3
              - esbuild
              - sharp" > ./pnpm-workspace.yaml
            fi

            echo "Development environment ready!"
          '';
        };
      }
    );
}