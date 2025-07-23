import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
    // import.meta.dirname is available after Node.js v20.11.0
    baseDirectory: import.meta.dirname,
})

const eslintConfig = [
    ...compat.config({
        extends: [
            'next',
            'next/core-web-vitals',
            'next/typescript',
            'prettier',
            'plugin:@next/next/recommended'
        ],

        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-require-imports': 'warn',
        },
    }),
]

export default eslintConfig