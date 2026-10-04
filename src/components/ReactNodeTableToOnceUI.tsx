"use client";

import React, { forwardRef, type ReactNode, useMemo } from "react";
import classNames from "classnames";
import { Flex, Table } from "@once-ui-system/core";

interface ReactNodeTableToOnceUIProps extends React.ComponentProps<typeof Flex> {
    children: React.ReactNode; // arbre React du tableau (ex: JSX)
    className?: string;
    style?: React.CSSProperties;
}

function extractTextFromReactNode(node: React.ReactNode): string {
    if (typeof node === "string") return node.trim();
    if (typeof node === "number") return node.toString();
    if (Array.isArray(node))
        return node.map(extractTextFromReactNode).join(" ").trim();
    if (React.isValidElement(node)) {
        return extractTextFromReactNode((node.props as any).children);
    }
    return "";
}

/**
 * Aplatit un arbre React en une liste d'éléments, en descendant dans les
 * Fragments et les tableaux. Nécessaire car MDX/React peut envelopper les
 * enfants (`<table>` → Fragment → `thead`/`tbody`) selon le moment du rendu :
 * un `find` sur le premier niveau ne trouve alors rien et le tableau se
 * retrouve vide (premier rendu SSR, puis hydration mismatch).
 */
function flattenElements(children: React.ReactNode): React.ReactElement[] {
    const out: React.ReactElement[] = [];
    const walk = (node: React.ReactNode) => {
        if (node === null || node === undefined || typeof node === "boolean") return;
        if (Array.isArray(node)) {
            node.forEach(walk);
            return;
        }
        if (React.isValidElement(node)) {
            if (node.type === React.Fragment) {
                walk((node.props as any).children);
                return;
            }
            out.push(node);
        }
    };
    walk(children);
    return out;
}

function findChildByType(
    children: React.ReactNode,
    type: string
): React.ReactElement | null {
    return flattenElements(children).find((el) => el.type === type) ?? null;
}

function parseReactTable(children: ReactNode) {
    // Trouver thead et tbody (en descendant dans les Fragments)
    const thead = findChildByType(children, "thead");
    const tbody = findChildByType(children, "tbody");

    // Extraire headers
    const headers: { content: string; key: string, sortable: boolean }[] = [];
    if (thead) {
        const tr = findChildByType((thead.props as any).children, "tr");
        if (tr) {
            const ths = flattenElements((tr.props as any).children).filter(
                (c) => c.type === "th"
            );

            ths.forEach((th, i) => {
                const content = extractTextFromReactNode((th.props as any).children) || `col-${i}`;
                headers.push({
                    content,
                    key: content
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^\w-]/g, "") || `col-${i}`,
                    sortable: true
                });
            });
        }
    }

    // Extraire les lignes
    const rows: string[][] = [];
    if (tbody) {
        const trs = flattenElements((tbody.props as any).children).filter(
            (c) => c.type === "tr"
        );

        trs.forEach((tr) => {
            const tds = flattenElements((tr.props as any).children).filter(
                (c) => c.type === "td"
            );

            rows.push(tds.map((td) => extractTextFromReactNode((td.props as any).children)));
        });
    }

    return { headers, rows };
}

const ReactNodeTableToOnceUI = forwardRef<HTMLDivElement, ReactNodeTableToOnceUIProps>(
    ({ children, className, style, ...rest }, ref) => {
        const tableData = useMemo(() => parseReactTable(children), [children]);

        return (
            <Flex ref={ref} style={style} className={classNames(className)} {...rest}>
                <Table data={tableData} />
            </Flex>
        );
    }
);

ReactNodeTableToOnceUI.displayName = "ReactNodeTableToOnceUI";

export { ReactNodeTableToOnceUI };
