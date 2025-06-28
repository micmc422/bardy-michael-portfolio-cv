
import React, { forwardRef, type ReactNode } from "react";
import { CodeBlock } from "@/once-ui/modules";

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

const RawGithubFile = forwardRef<HTMLDivElement, ComponentProps>(
    async ({ rawCodeUrl, ...rest }, ref) => {
        const code = await getCode(rawCodeUrl)
        const language = await detectLanguageFromURL(rawCodeUrl)
        let path = rawCodeUrl.split("/main").slice(-1)[0];
        if(rawCodeUrl?.includes("micmc422/blogfiles")) {
            path = ""
        }
        return (
            <CodeBlock
                ref={ref}
                copyButton
                codeInstances={[
                    {
                        code,
                        language,
                        label: `${language} ${path ? path.replace(/-/g, ' ') : ''}`
                    }
                ]}
                {...rest}

            />
        );
    }
);

RawGithubFile.displayName = "RawGithubFile";
export { RawGithubFile };

function detectLanguageFromURL(url: string) {
    const extensionToLanguage: { [key: string]: string } = {
        'js': 'javaScript',
        'ts': 'typeScript',
        'jsx': 'javaScript',
        'tsx': 'javaScript',
        'html': 'HTML',
        'css': 'CSS',
        'scss': 'Sass',
        'json': 'JSON',
        'md': 'Markdown',
        'py': 'Python',
        'php': 'PHP',
        'java': 'Java',
        'rb': 'Ruby',
        'go': 'Go',
        'c': 'C',
        'cpp': 'C++',
        'h': 'C Header',
        'sh': 'Shell',
        'yml': 'YAML',
        'yaml': 'YAML',
        'xml': 'XML',
        'txt': 'Plain Text'
    };

    try {
        const pathname = new URL(url).pathname;
        const extensionMatch = pathname.match(/\.([a-z0-9]+)$/i);

        if (extensionMatch && extensionMatch[1]) {
            const ext = extensionMatch[1].toLowerCase();
            return extensionToLanguage[ext] || `Inconnu (extension .${ext})`;
        }

        return 'Extension non détectée';
    } catch (err) {
        console.error(err)

        return 'URL invalide';
    }
}
