import { defineConfig } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended"
    )),

    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        react: fixupPluginRules(react),
        "react-hooks": fixupPluginRules(reactHooks),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },

            project: "./tsconfig.json",
        },
    },

    settings: {
        react: {
            version: "detect",
        },

        "import/resolver": {
            typescript: {
                alwaysTryTypes: true,
                project: "./tsconfig.json",
            },
        },
    },

    rules: {
        "@typescript-eslint/no-require-imports": "off",
        "no-extra-boolean-cast": "off",
        "no-useless-escape": "off",
        semi: "off",
        "no-case-declarations": "off",
        indent: "off",
        "no-unused-vars": "off",
        "no-empty-function": "off",
        "arrow-body-style": "off",
        "prefer-const": "error",

        "@typescript-eslint/consistent-type-imports": ["error", {
            prefer: "type-imports",
            disallowTypeAnnotations: true,
            fixStyle: "inline-type-imports",
        }],

        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",

        "@typescript-eslint/no-unused-vars": ["error", {
            args: "after-used",
            ignoreRestSiblings: true,
            varsIgnorePattern: "^_",
            argsIgnorePattern: "^_",
        }],

        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/no-empty-function": "warn",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react/display-name": "off",
        "react/jsx-uses-react": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "off",
        "react/no-unknown-property": "off"
    },
}]);