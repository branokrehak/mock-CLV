import prettierConfig from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  prettierConfig,
  tseslint.configs.base,
  {
    files: ["**/*.ts"],
    rules: {
      eqeqeq: ["warn", "smart"],
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: ".",
      },
    },
  },
  {
    files: ["**/*.js"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    ignores: ["dist/*"],
  },
);
