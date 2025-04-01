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
            node2nix
            sqlite
          ];
          buildInputs = with pkgs; [
            nodejs_22
            pnpm
            tailwindcss_4
          ];

          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"
            echo "Development environment ready!"
          '';
        };
      }
    );
}