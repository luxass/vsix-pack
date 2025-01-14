// @ts-check

import path from "node:path";
import { defineConfig } from "rolldown";
import UnpluginIsolatedDecl from "unplugin-isolated-decl/rolldown";
import pkg from "./package.json" with { type: "json" };

const EXTERNAL_DEPENDENCIES = [
  ...Object.keys(pkg.dependencies || {}),
  ...(("peerDependencies" in pkg && typeof pkg.peerDependencies === "object" && pkg.peerDependencies != null) ? Object.keys(pkg.peerDependencies) : []),
];

/**
 * @type {import('rolldown').Plugin}
 */
const ExternalPlugin = {
  name: "external-deps",
  resolveId(id, _, { isEntry }) {
    if (isEntry) {
      return;
    }

    let shouldExternal = !path.isAbsolute(id) && id[0] !== ".";

    shouldExternal ||= EXTERNAL_DEPENDENCIES.some((dep) => id === dep || id.startsWith(`${dep}/`));

    if (shouldExternal) {
      return {
        id,
        external: true,
      };
    }
  },
};

export default defineConfig([
  {
    input: {
      index: "src/index.ts",
      cli: "src/cli.ts",
    },
    output: {
      dir: "dist",
      format: "esm",
      sourcemap: false,
      entryFileNames: "[name].mjs",
      chunkFileNames: "chunk-[hash].mjs",
    },
    platform: "node",
    resolve: {
      extensionAlias: {
        ".js": [".ts", ".js"],
      },
    },
    plugins: [UnpluginIsolatedDecl(), ExternalPlugin],
  },
  {
    input: {
      index: "src/index.ts",
    },
    output: {
      dir: "dist",
      format: "cjs",
      sourcemap: false,
      entryFileNames: "[name].cjs",
      chunkFileNames: "chunk-[hash].cjs",
    },
    platform: "node",
    resolve: {
      extensionAlias: {
        ".js": [".ts", ".js"],
      },
    },
    plugins: [
      UnpluginIsolatedDecl(),
      ExternalPlugin,
    ],
  },
]);
