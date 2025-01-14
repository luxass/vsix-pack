import luxass from "@luxass/eslint-config";

export default luxass({
  formatters: true,
  type: "lib",
  languageOptions: {
    ecmaVersion: "latest",
    parserOptions: {
      ecmaVersion: "latest",
    },
  },
});
