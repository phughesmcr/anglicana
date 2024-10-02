import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";
import * as esbuild from "npm:esbuild";
import DenoConfig from "../deno.json" with { type: "json" };

const VERSION = DenoConfig.version;

await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ["mod.ts"],
  outfile: "./dist/anglicana.es2022.min.js",
  target: ["es2022", "edge127", "chrome127", "firefox130", "safari17.6"],
  bundle: true,
  format: "esm",
  minify: true,
  banner: {
    js: `// Copyright 2024 the Anglicana authors. All rights reserved. MIT license. Version ${VERSION}`,
  },
  sourcemap: true,
});

await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ["mod.ts"],
  outfile: "./dist/anglicana.es6.min.js",
  target: ["es6", "chrome98"],
  bundle: true,
  format: "esm",
  minify: true,
  banner: {
    js: `// Copyright 2024 the Anglicana authors. All rights reserved. MIT license. Version ${VERSION}`,
  },
  sourcemap: true,
});

esbuild.stop();
