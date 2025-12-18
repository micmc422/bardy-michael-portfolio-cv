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

function findChildByType(
    children: React.ReactNode,
    type: string
): ReactNode | null {
    if (!children) return null;

    const arrayChildren = Array.isArray(children) ? children : [children];
    for (const child of arrayChildren) {
        if (React.isValidElement(child) && child.type === type) {
            return child;
        }
    }
    return null;
}

function parseReactTable(children: ReactNode) {
    // Trouver thead et tbody
    const thead = findChildByType(children, "thead");
    const tbody = findChildByType(children, "tbody");

    // Extraire headers
    const headers: { content: string; key: string, sortable: boolean }[] = [];
    if (thead && React.isValidElement(thead)) {
        const tr = findChildByType((thead.props as any).children, "tr");
        if (tr && React.isValidElement(tr)) {
            const ths = React.Children.toArray((tr.props as any).children).filter(
                (c) => React.isValidElement(c) && c.type === "th"
            ) as React.ReactElement[];

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
    if (tbody && React.isValidElement(tbody)) {
        const trs = React.Children.toArray((tbody.props as any).children).filter(
            (c) => React.isValidElement(c) && c.type === "tr"
        ) as React.ReactElement[];

        trs.forEach((tr) => {
            if (React.isValidElement(tr)) {
                const tds = React.Children.toArray((tr.props as any).children).filter(
                    (c) => React.isValidElement(c) && c.type === "td"
                ) as React.ReactElement[];

                const row = tds.map((td) => extractTextFromReactNode((td.props as any).children));
                rows.push(row);
            }
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
