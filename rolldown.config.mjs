import { defineConfig } from "rolldown";
import UnpluginIsolatedDecl from "unplugin-isolated-decl/rolldown";

export default defineConfig([
  {
    input: {
      index: "src/index.ts",
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
    plugins: [UnpluginIsolatedDecl()],
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
    ],
  },
  {
    input: "./src/cli.ts",
    output: {
      dir: "dist",
      format: "esm",
      sourcemap: false,
      entryFileNames: "cli.mjs",
      chunkFileNames: "chunk-[hash].mjs",
    },
    platform: "node",
    resolve: {
      extensionAlias: {
        ".js": [".ts", ".js"],
      },
    },
  },
]);
