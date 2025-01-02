import process from "node:process";
import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    name: "publish",
    description: "publish visual studio code extensions",
  },
  args: {
    cwd: {
      type: "string",
      description: "working directory",
      required: false,
      default: process.cwd(),
    },
  },
  run({ args }) {
    // eslint-disable-next-line no-console
    console.info("parsed args:", args);
  },
});
