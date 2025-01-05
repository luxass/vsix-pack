import type { PackageManager } from "vsix-utils";
import process from "node:process";
import { defineCommand } from "citty";
import { green, red, underline, yellow } from "farver/fast";
import { createVsix } from "vsix-builder";

export default defineCommand({
  meta: {
    name: "pack",
    description: "Pack Visual Studio Code Extensions",
  },
  args: {
    "cwd": {
      type: "string",
      description: "Working directory",
      required: false,
    },
    "skip-scripts": {
      type: "boolean",
      description: "Skip running vscode scripts",
      required: false,
      default: false,
    },
    "package-path": {
      type: "string",
      description: "The destination path for the VSIX package",
      required: false,
    },
    "package-manager": {
      type: "string",
      description: "Package Manager",
      required: false,
      default: "auto",
      alias: "pm",
    },
    "dry-run": {
      type: "boolean",
      description: "Dry run",
      required: false,
      default: false,
    },
    "readme": {
      type: "string",
      description: "Path to README file",
      required: false,
    },
    "dependencies": {
      type: "boolean",
      description: "Include dependencies in the package, only useful it you are not bundling the extension",
      required: false,
      default: true,
    },
    "force": {
      type: "boolean",
      description: "Force write to disk",
      required: false,
      default: false,
    },
    "pre-release": {
      type: "boolean",
      description: "Pre-release",
      required: false,
      default: false,
    },
    "ignore-file": {
      type: "string",
      description: "Ignore file",
      required: false,
    },
  },
  async run({ args }) {
    const cwd = args.cwd ?? process.cwd();
    const vsix = await createVsix({
      write: !args["dry-run"],
      forceWrite: args.force,
      cwd,
      packagePath: args["package-path"],
      packageManager: args["package-manager"] as PackageManager,
      readme: args.readme,
      preRelease: args["pre-release"],
      ignoreFile: args["ignore-file"],
      skipScripts: args["skip-scripts"],
    });

    if (vsix.errors.length > 0) {
      console.error("some errors occurred while creating the vsix package");

      for (const error of vsix.errors) {
        console.error(` - ${red(error.type)}${"message" in error ? `: ${error.message}` : ""}`);
      }

      return;
    }

    if (!vsix.written) {
      console.warn(`no vsix package was created, as you are in ${yellow("dry-run")} mode`);
      return;
    }

    // eslint-disable-next-line no-console
    console.info(`vsix package created at ${green(underline(vsix.vsixPath))}`);
  },
});
