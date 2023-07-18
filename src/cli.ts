#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import { resolve } from "pathe";
import { name, version, description } from "../package.json";
import { mkdist, MkdistOptions } from "./index";

const main = defineCommand({
  meta: {
    name,
    version,
    description,
  },
  args: {
    dir: {
      type: "positional",
      description: "Project root directory",
      default: ".",
    },
    cwd: {
      type: "string",
      description: "Current working directory",
    },
    src: {
      type: "string",
      description: "Source directory relative to project root directory",
      default: "src",
    },
    dist: {
      type: "string",
      description: "Destinition directory relative to project root directory",
      default: "dist",
    },
    pattern: {
      type: "string",
      description: "Pattern includes or excludes files",
      default: "**",
    },
    format: {
      type: "string",
      description: "File format",
      valueHint: "cjs|esm",
    },
    declaration: {
      type: "boolean",
      description: "Generate type declaration file",
      default: false,
      alias: ["d"],
    },
    ext: {
      type: "string",
      description: "File extension",
      valueHint: "mjs|js|ts",
    },
    jsx: {
      type: "string",
      description: "Specify which JSX runtime to use",
      valueHint: "transform|preserve|automatic",
    },
    jsxFactory: {
      type: "string",
      description: "JSX factory",
      valueHint: "h|React.createElement",
    },
    jsxFragment: {
      type: "string",
      description: "JSX fragment",
      valueHint: "Fragment|React.Fragment",
    },
  },
  async run({ args }) {
    const { writtenFiles } = await mkdist({
      ...args,
      rootDir: resolve(args.cwd || process.cwd(), args.dir),
      srcDir: args.src,
      distDir: args.dist,
      format: args.format,
      pattern: args.pattern,
      ext: args.ext,
      declaration: args.declaration,
      esbuild: {
        jsx: args.jsx,
        jsxFactory: args.jsxFactory,
        jsxFragment: args.jsxFragment,
      },
    } as MkdistOptions);

    // eslint-disable-next-line no-console
    console.log(writtenFiles.map((f) => `- ${f}`).join("\n"));

    process.exit(0);
  },
});

// eslint-disable-next-line unicorn/prefer-top-level-await
runMain(main).catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
