import type { PackageManager } from "vsix-utils";
import process from "node:process";
import { defineCommand } from "citty";
import { green, red, underline } from "farver";
import { createVsix } from "vsix-builder";

export default defineCommand({
  meta: {
    name: "pack",
    description: "Pack Visual Studio Code Extensions",
  },
  args: {
    cwd: {
      type: "string",
      description: "Working directory",
      required: false,
    },
    skipScripts: {
      type: "boolean",
      description: "Skip running vscode scripts",
      required: false,
      default: false,
    },
    packagePath: {
      type: "string",
      description: "The destination path for the VSIX package",
      required: false,
    },
    packageManager: {
      type: "string",
      description: "Package Manager",
      required: false,
      default: "auto",
      alias: "pm",
    },
    dryRun: {
      type: "boolean",
      description: "Dry run",
      required: false,
      default: false,
    },
    readme: {
      type: "string",
      description: "Path to README file",
      required: false,
    },
    dependencies: {
      type: "boolean",
      description: "Include dependencies in the package, only useful it you are not bundling the extension",
      required: false,
      default: true,
    },
  },
  async run({ args }) {
    const cwd = args.cwd ?? process.cwd();
    const vsix = await createVsix({
      write: !args.dryRun,
      cwd,
      packagePath: args.packagePath,
      packageManager: args.pm as PackageManager,
    });

    if (vsix.errors.length > 0) {
      console.error("some errors occurred while creating the vsix package");

      for (const error of vsix.errors) {
        console.error(` - ${red(error.type)}${"message" in error ? `: ${error.message}` : ""}`);
      }

      return;
    }

    // eslint-disable-next-line no-console
    console.info(`vsix package created at ${green(underline(vsix.vsixPath))}`);
  },
});
