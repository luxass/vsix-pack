import process from "node:process";
import { createVsix, type CreateVsixResult, type Options } from "vsix-builder";

export async function pack(options: Options): Promise<CreateVsixResult> {
  const {
    cwd = process.cwd(),
    preRelease = false,
    readme,
    write = false,
    forceWrite,
    ignoreFile,
    packageManager,
    packagePath,
    skipScripts,
    scanDependencies,
  } = options;

  const vsix = await createVsix({
    write,
    forceWrite,
    cwd,
    packageManager,
    readme,
    preRelease,
    ignoreFile,
    skipScripts,
    packagePath,
    scanDependencies,
  });

  return vsix;
}
