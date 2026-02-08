import { FlatCompat } from '@eslint/eslintrc'

/**
 * Create ESLint config for Next.js apps.
 * @param {string} baseDirectory - The directory of the consuming app (import.meta.dirname)
 */
export function createNextEslintConfig(baseDirectory) {
    const compat = new FlatCompat({ baseDirectory })

    return [
        ...compat.config({
            extends: [
                'next',
                'next/core-web-vitals',
                'next/typescript',
                'prettier',
            ],

            rules: {
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
        }),
    ]
}

export default createNextEslintConfig
