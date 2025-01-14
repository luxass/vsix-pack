import type { PackageManager } from "vsix-utils";
import process from "node:process";
import { green, red, underline, yellow } from "farver/fast";
import yargs, { type Argv } from "yargs";
import { version } from "../package.json" with { type: "json" };
import { pack } from "./pack";

const cli = yargs(process.argv.slice(2))
  .scriptName("vsix-pack")
  .usage("$0 [args]")
  .version(version)
  .strict()
  .showHelpOnFail(true)
  .alias("h", "help")
  .alias("v", "version")
  .demandCommand(1, "");

cli.command(
  "pack",
  "Pack Visual Studio Code Extensions",
  (args) => commonOptions(args)
    .option("package-manager", {
      type: "string",
      description: "Package Manager",
      default: "auto",
      alias: "pm",
    })
    .option("pre-release", {
      type: "boolean",
      description: "Pre-release",
      default: false,
    })
    .option("force", {
      type: "boolean",
      description: "Force write to disk",
      default: false,
    })
    .option("include-dependencies", {
      type: "boolean",
      description: "Include dependencies in the package, only useful it you are not bundling the extension",
      default: true,
    })
    .option("readme", {
      type: "string",
      description: "Path to README file",
    })
    .option("dry-run", {
      type: "boolean",
      description: "Dry run",
      default: false,
    })
    .option("skip-scripts", {
      type: "boolean",
      description: "Skip running vscode scripts",
      default: false,
    })
    .option("ignore-file", {
      type: "string",
      description: "Path to ignore file",
    })
    .option("package-path", {
      type: "string",
      description: "The destination path for the VSIX package",
    })
    .strict().help(),
  async (args) => {
    const {
      cwd,
      packageManager,
      dryRun,
      includeDependencies,
      preRelease,
      readme,
      packagePath,
      ignoreFile,
      skipScripts,
      force,
    } = args;
    const result = await pack({
      write: !dryRun,
      forceWrite: force,
      cwd,
      ignoreFile,
      packageManager: packageManager as PackageManager,
      packagePath,
      preRelease,
      readme,
      scanDependencies: includeDependencies,
      skipScripts,
    });

    if (result.errors.length > 0) {
      console.error("some errors occurred while creating the vsix package");

      for (const error of result.errors) {
        console.error(` - ${red(error.type)}${"message" in error ? `: ${error.message}` : ""}`);
      }

      return;
    }

    if (!result.written) {
      console.warn(`no vsix package was created, as you are in ${yellow("dry-run")} mode`);
      return;
    }

    console.info(`vsix package created at ${green(underline(result.vsixPath))}`);
  },
);

cli.command(
  "publish",
  "Publish Visual Studio Code Extensions",
  (args) => commonOptions(args).strict().help(),
  async (args) => {
    console.log("publishing", args);
  },
);

cli.help().parse();

function commonOptions(args: Argv<object>): Argv<object & { cwd: string }> {
  return args.option("cwd", {
    type: "string",
    description: "The working directory to run the command in",
    default: process.cwd(),
  });
}
