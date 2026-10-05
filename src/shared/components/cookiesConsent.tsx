"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Background,
    Button,
    Column,
    Icon,
    Row,
    SmartLink,
    Switch,
    Text,
} from '@once-ui-system/core';
import { Analytics } from '@vercel/analytics/next';

const COOKIE_NAME = "acceptedCookies";
const COOKIE_MAX_AGE = 2592000; // 30 jours

export const getCookies = (): { [key: string]: string } | undefined => {
    if (document?.cookie === "") return undefined
    return document?.cookie
        ?.split(';')
        ?.reduce((prev: { [key: string]: string }, current) => {
            // split limité à 2 : la valeur peut elle-même contenir des '='.
            const eq = current.indexOf('=');
            if (eq === -1) return prev;
            const key = current.slice(0, eq).trim();
            const value = current.slice(eq + 1);
            if (key !== "") {
                prev[key] = value;
            }
            return prev;
        }, {});
}

const writeConsentCookie = (value: string) => {
    if (typeof document === "undefined") return;
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

const CookieConsent: React.FC = () => {
    const router = useRouter()
    const [visible, setVisible] = useState(false)
    const [analytics, setAnalytics] = useState(true)
    const [analyticsAllowed, setAnalyticsAllowed] = useState(false)

    // Affiche la carte tant qu'aucun choix n'a été enregistré, et résout le
    // consentement existant (côté client uniquement : `document` n'existe pas au SSR).
    useEffect(() => {
        if (typeof document === "undefined") return;
        const consent = getCookies()?.[COOKIE_NAME];
        if (consent === undefined) {
            setVisible(true);
        }
        setAnalyticsAllowed(
            consent === "true" ||
            consent === "all" ||
            (typeof consent === "string" && consent.includes("analytics=1"))
        );
    }, []);

    const save = (value: string) => {
        writeConsentCookie(value);
        setVisible(false);
        router.refresh();
    }

    const handleEssentialOnly = () => save("essential")
    const handleAcceptAll = () => save("all")
    const handleSavePreferences = () => save(`analytics=${analytics ? 1 : 0}`)

    if (!visible) {
        return analyticsAllowed ? <Analytics /> : null;
    }

    return (
        <Column
            position="fixed"
            bottom="24"
            right="24"
            zIndex={10}
            maxWidth={32}
            padding="24"
            gap="20"
            radius="l"
            border="brand-alpha-weak"
            overflow="hidden"
            background="surface"
            shadow="l"
            s={{ bottom: "16", right: "16", left: "16", maxWidth: "100%" }}
        >
            <Background
                position="absolute"
                fill
                left="0"
                top="0"
                pointerEvents="none"
                gradient={{
                    display: true,
                    x: 100,
                    y: 0,
                    colorStart: "brand-background-medium",
                    colorEnd: "static-transparent",
                }}
            />
            <Row gap="12" vertical="center" zIndex={1}>
                <Icon
                    name="security"
                    size="s"
                    padding="12"
                    radius="full"
                    background="brand-alpha-weak"
                    onBackground="brand-weak"
                />
                <Column gap="4" fillWidth>
                    <Text variant="display-strong-xs">Votre vie privée compte</Text>
                    <Text variant="body-default-s" onBackground="neutral-weak" wrap="balance">
                        Ce site utilise une mesure d&apos;audience anonyme pour améliorer votre
                        expérience. Aucune donnée n&apos;est partagée avec des tiers.{" "}
                        <SmartLink href="/mentions-legales">En savoir plus</SmartLink>.
                    </Text>
                </Column>
            </Row>

            <Column fillWidth gap="12" padding="16" radius="m" border="neutral-alpha-weak" zIndex={1}>
                <Row fillWidth horizontal="between" vertical="center">
                    <Column gap="2">
                        <Text variant="label-default-s">Mesure d&apos;audience</Text>
                        <Text variant="body-default-xs" onBackground="neutral-weak">
                            Pages consultées, origine de la visite, navigateur, pays
                        </Text>
                    </Column>
                    <Switch
                        checked={analytics}
                        onToggle={() => setAnalytics((v) => !v)}
                        ariaLabel="Activer la mesure d'audience"
                    />
                </Row>
            </Column>

            <Row fillWidth gap="8" wrap zIndex={1}>
                <Button size="s" variant="secondary" fillWidth onClick={handleEssentialOnly}>
                    Essentiels uniquement
                </Button>
                <Button size="s" variant="secondary" fillWidth onClick={handleAcceptAll}>
                    Tout accepter
                </Button>
                <Button size="s" fillWidth onClick={handleSavePreferences}>
                    Enregistrer mes choix
                </Button>
            </Row>
        </Column>
    );
};

export default CookieConsent;
