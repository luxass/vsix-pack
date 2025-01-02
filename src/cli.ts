import { defineCommand, runMain } from "citty";
import { version } from "../package.json" with { type: "json" };

const main = defineCommand({
  meta: {
    name: "vsix-pack",
    version,
    description: "Pack Visual Studio Code Extensions with ease",
  },
  subCommands: {
    pack: () => import("./commands/pack").then((m) => m.default),
    publish: () => import("./commands/publish").then((m) => m.default),
  },
});

runMain(main);
