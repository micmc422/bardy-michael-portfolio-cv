
import React, { forwardRef, type ReactNode } from "react";
import { CodeBlock } from "@once-ui-system/core";

interface ComponentProps extends React.ComponentProps<typeof CodeBlock> {
    rawCodeUrl: string;
    label?: ReactNode
}

async function getCode(url: string): Promise<any> {
    const res = await fetch(url);
    const data = await res.text()
    const code = data
    return code
}

/**
 * Renvoie l'identifiant Prism (prism) utilisé pour la coloration + un label
 * lisible. Once UI CodeBlock colorie via Prism en interne, qui attend les
 * identifiants exacts des fichiers `prismjs/components/prism-<id>` (ex.
 * `typescript`, `javascript`, `markup`, `scss`), et NON des libellés comme
 * `typeScript`/`javaScript` (sinon le chargement du langage échoue
 * silencieusement → code monochrome).
 */
function detectLanguageFromURL(url: string): { prism: string; label: string } {
    const extensionToLanguage: { [key: string]: { prism: string; label: string } } = {
        // Web / Next.js
        'js': { prism: 'javascript', label: 'JavaScript' },
        'mjs': { prism: 'javascript', label: 'JavaScript (ESM)' },
        'cjs': { prism: 'javascript', label: 'JavaScript (CommonJS)' },
        'jsx': { prism: 'jsx', label: 'JSX' },
        'ts': { prism: 'typescript', label: 'TypeScript' },
        'tsx': { prism: 'tsx', label: 'TSX' },
        'd.ts': { prism: 'typescript', label: 'TypeScript' },
        'html': { prism: 'markup', label: 'HTML' },
        'htm': { prism: 'markup', label: 'HTML' },
        'css': { prism: 'css', label: 'CSS' },
        'scss': { prism: 'scss', label: 'Sass' },
        'sass': { prism: 'sass', label: 'Sass (indented)' },
        'less': { prism: 'less', label: 'Less' },
        'json': { prism: 'json', label: 'JSON' },
        'json5': { prism: 'json', label: 'JSON5' },
        'jsonc': { prism: 'json', label: 'JSONC' },
        'md': { prism: 'markdown', label: 'Markdown' },
        'mdx': { prism: 'markdown', label: 'MDX' },
        'xml': { prism: 'markup', label: 'XML' },
        'svg': { prism: 'markup', label: 'SVG' },
        'yaml': { prism: 'yaml', label: 'YAML' },
        'yml': { prism: 'yaml', label: 'YAML' },
        'toml': { prism: 'toml', label: 'TOML' },
        'env': { prism: 'bash', label: 'Dotenv' },
        'sh': { prism: 'bash', label: 'Shell' },
        'bash': { prism: 'bash', label: 'Bash' },
        'zsh': { prism: 'bash', label: 'Zsh' },
        // Backend / data
        'py': { prism: 'python', label: 'Python' },
        'rb': { prism: 'ruby', label: 'Ruby' },
        'php': { prism: 'php', label: 'PHP' },
        'go': { prism: 'go', label: 'Go' },
        'rs': { prism: 'rust', label: 'Rust' },
        'java': { prism: 'java', label: 'Java' },
        'kt': { prism: 'kotlin', label: 'Kotlin' },
        'cs': { prism: 'csharp', label: 'C#' },
        'c': { prism: 'c', label: 'C' },
        'h': { prism: 'c', label: 'C Header' },
        'cpp': { prism: 'cpp', label: 'C++' },
        'cc': { prism: 'cpp', label: 'C++' },
        'hpp': { prism: 'cpp', label: 'C++ Header' },
        'sql': { prism: 'sql', label: 'SQL' },
        'graphql': { prism: 'graphql', label: 'GraphQL' },
        'gql': { prism: 'graphql', label: 'GraphQL' },
        // Config / misc
        'dockerfile': { prism: 'docker', label: 'Dockerfile' },
        'txt': { prism: 'none', label: 'Plain Text' },
    };

    try {
        const pathname = new URL(url).pathname;
        const extensionMatch = pathname.match(/\.([a-z0-9]+)$/i);

        if (extensionMatch && extensionMatch[1]) {
            const ext = extensionMatch[1].toLowerCase();
            return extensionToLanguage[ext] || { prism: 'none', label: `Inconnu (extension .${ext})` };
        }

        return { prism: 'none', label: 'Extension non détectée' };
    } catch (err) {
        console.error(err)
        return { prism: 'none', label: 'URL invalide' };
    }
}

const RawGithubFile = forwardRef<HTMLDivElement, ComponentProps>(
    async ({ rawCodeUrl, ...rest }, ref) => {
        const code = await getCode(rawCodeUrl)
        const { prism, label: langLabel } = detectLanguageFromURL(rawCodeUrl)
        let path = rawCodeUrl.split("/main").slice(-1)[0];
        if (rawCodeUrl?.includes("micmc422/blogfiles")) {
            path = ""
        }
        return (
            <CodeBlock
                ref={ref}
                copyButton
                codes={[
                    {
                        code,
                        language: prism,
                        label: `${langLabel}${path ? " " + path.replace(/-/g, " ") : ""}`
                    }
                ]}
                {...rest}

            />
        );
    }
);

RawGithubFile.displayName = "RawGithubFile";
export { RawGithubFile };
