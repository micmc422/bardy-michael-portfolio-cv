import pluginNext from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

const eslintConfig = [
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': hooksPlugin,
            '@next/next': pluginNext,
            '@typescript-eslint': tseslint,
        },
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        rules: {
            // React rules
            ...reactPlugin.configs['jsx-runtime'].rules,
            // React Hooks rules
            ...hooksPlugin.configs.recommended.rules,
            // Next.js rules
            ...pluginNext.configs.recommended.rules,
            ...pluginNext.configs['core-web-vitals'].rules,
            // TypeScript rules
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-require-imports': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    'argsIgnorePattern': '^_',
                    'varsIgnorePattern': '^_',
                    'caughtErrorsIgnorePattern': '^_'
                }
            ]
        },
    },
    {
        ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'node_modules/**'],
    }
]

export default eslintConfig