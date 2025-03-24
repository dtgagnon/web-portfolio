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
            tailwindcss_4
            nodePackages.postcss
            autoprefixer
            nodejs_22
            pnpm
            spirenix.nixd
          ];

          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"
            
            echo "Development environment ready!"
            echo "Run './scripts/start-dev.sh' to start the development servers."
          '';
        };
      }
    );
}