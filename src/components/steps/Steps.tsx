
import React, { forwardRef } from "react";
import classNames from "classnames";
import { Column, Flex, Heading, Row, Text } from "@/once-ui/components";
import styles from "./steps.module.scss"
import { slugify } from "@/utils/utils";

interface StepsComponentProps extends React.ComponentProps<typeof Column> {
    title?: string;
    steps: { icon?: string, title?: string, content?: string }[];
    className?: string;
    style?: React.CSSProperties;
}

const defaulSteps = [
    {
        "title": "⚡ Performance SEO (Search Console, Analytics)",
        "content": "Suivre régulièrement les indicateurs SEO via Google Search Console et Google Analytics permet d’évaluer la visibilité du site, le comportement des utilisateurs et l’efficacité des optimisations en place. Une analyse approfondie des données aide à identifier les pages performantes, à repérer les axes d’amélioration et à ajuster la stratégie pour un meilleur positionnement."
    },
    {
        "title": "🥇 Positions zéro et extraits enrichis",
        "content": "Atteindre la position zéro ou obtenir des extraits enrichis (featured snippets) permet de capter une part importante du trafic organique. En optimisant le contenu pour répondre clairement aux requêtes des utilisateurs, on augmente les chances d’apparaître en tête des résultats, améliorant ainsi la visibilité et la notoriété de la marque."
    },
    {
        "title": "🤖 Sources IA identifiées",
        "content": "S’assurer que les contenus du site sont correctement identifiés et attribués par les IA est essentiel pour renforcer l’autorité et la crédibilité en ligne. Un contenu bien structuré, signé par des auteurs identifiables et issu de sources fiables favorise sa réutilisation par les IA génératives, tout en garantissant une attribution claire."
    },
    {
        "title": "📈 Conversion et engagement",
        "content": "Mesurer le taux de conversion et l’engagement des visiteurs permet de transformer le trafic en résultats concrets. En analysant les parcours utilisateurs, les taux de clics, les temps de lecture et les actions réalisées, on peut optimiser le contenu et les appels à l’action pour augmenter la fidélisation et la rentabilité."
    }
]

const StepsComponent = forwardRef<HTMLDivElement, StepsComponentProps>(
    ({ title, steps = defaulSteps, className, style, ...rest }, ref) => {

        return (
            <Column
                ref={ref}
                style={style}
                className={classNames(className)}
                {...rest}
            >
                {title && <Heading as="h2" paddingBottom="l" id={slugify(title)}>{title}</Heading>}
                {steps?.map((step, i) => <StepComponent key={i} step={i} {...step} />)}
            </Column>
        );
    }
);

StepsComponent.displayName = "StepsComponent";

interface StepComponentProps extends React.ComponentProps<typeof Column> {
    step: number;
    icon?: string;
    title?: string;
    content?: string;
    className?: string;
    style?: React.CSSProperties;
}

const StepComponent = forwardRef<HTMLDivElement, StepComponentProps>(
    ({ icon, title, content, step, className, style, ...rest }, ref) => {
        return (
            <Column
                ref={ref}
                style={style}
                className={classNames(className)}
                {...rest}
            >
                <Row gap="s">
                    <Column>
                        <div className={classNames(styles.stepCount)}>{step + 1}</div>
                        <div className={classNames(styles.stepLine)} />
                    </Column>
                    <Column gap="s" paddingBottom="m" paddingTop="4">
                        <Text variant="body-strong-xl">{title}</Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">{content}</Text>
                    </Column>
                </Row>
            </Column>
        );
    }
);

StepComponent.displayName = "StepComponent";

export { StepsComponent };
