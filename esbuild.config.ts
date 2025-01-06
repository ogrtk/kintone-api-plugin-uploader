import { build } from "esbuild";

await build({
  entryPoints: ["src/cli.ts"],
  outfile: "dist/cli.js",
  bundle: true,
  packages: "external",
  platform: "node",
  target: "node22",
  format: "esm",
  minify: true,
  banner: {
    js: "#!/usr/bin/env node",
  },
});
