"use client";

import { Column, Row, Text, Icon } from "@once-ui-system/core";
import type { AccessibilityAnalysis, AnalysisItem } from "@/app/utils/types";
import { AnalysisCard } from "../../AnalysisCard";

function withLinks(item: AnalysisItem, links: { label: string; href: string }[]): AnalysisItem {
    return {
        ...item,
        contentComponent: (
            <Column gap="s" paddingLeft="l">
                {item.description && (
                    <Row gap="xs" vertical="start">
                        <Icon name="infoCircle" size="xs" onBackground="neutral-weak" />
                        <Text variant="body-default-s" onBackground="neutral-weak">
                            {item.description}
                        </Text>
                    </Row>
                )}
                {item.impact && (
                    <Row gap="xs" vertical="start" padding="s" radius="s" background="danger-alpha-weak">
                        <Icon name="warningTriangle" size="xs" onBackground="danger-weak" />
                        <Column gap="2">
                            <Text variant="label-default-xs" onBackground="danger-weak">Impact</Text>
                            <Text variant="body-default-s">{item.impact}</Text>
                        </Column>
                    </Row>
                )}
                {item.recommendation && (
                    <Row gap="xs" vertical="start" padding="s" radius="s" background="success-alpha-weak">
                        <Icon name="lightbulb" size="xs" onBackground="success-weak" />
                        <Column gap="2">
                            <Text variant="label-default-xs" onBackground="success-weak">Recommandation</Text>
                            <Text variant="body-default-s">{item.recommendation}</Text>
                            <Row gap="xs" wrap>
                                {links.map((l) => (
                                    <Text
                                        key={l.href}
                                        as="a"
                                        href={l.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: "underline" }}
                                    >
                                        {l.label}
                                    </Text>
                                ))}
                            </Row>
                        </Column>
                    </Row>
                )}
            </Column>
        ),
    };
}

export function AccessibilityReport({ results }: { results: AccessibilityAnalysis }) {
    const items: AnalysisItem[] = [
        withLinks(results.language, [{ label: "Langue du document (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang" }]),
        withLinks(results.ariaAttributes, [{ label: "ARIA (MDN)", href: "https://developer.mozilla.org/docs/Web/Accessibility/ARIA" }]),
        withLinks(results.formLabels, [{ label: "Labels de formulaire (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Element/label" }]),
        withLinks(results.altTexts, [{ label: "Texte alternatif (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Element/img#alt" }]),
        withLinks(results.landmarks, [{ label: "Landmarks (WAI)", href: "https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/" }]),
    ];

    return (
        <AnalysisCard
            title="Accessibilité"
            icon="users"
            score={results.score}
            items={items}
        />
    );
}
