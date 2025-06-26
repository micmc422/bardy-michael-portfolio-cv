"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion, Button, Column, Feedback, Heading, Icon, Row, Text, useToast } from '@/once-ui/components';
import { Analytics } from '@vercel/analytics/next';

export const getCookies = (): { [key: string]: string } | undefined => {
    if (document?.cookie === "") return undefined
    return document?.cookie
        ?.split(';')
        ?.reduce((prev: { [key: string]: string } | undefined, current) => {
            const [key, value] = current.split('=');
            if (!prev) return undefined;
            prev[key.trim()] = value;
            return prev;
        }, {});
}
const CookieConsent: React.FC = () => {
    const { addToast, removeToast } = useToast();
    const [trigger, setTigger] = useState(false)
    const [accepted, setAccepted] = useState(false)
    const router = useRouter()
    function AcceptCookies() {
        if (typeof document === "undefined") return;
        document.cookie = "acceptedCookies=true; path=/; max-age=2592000`;";
        setTigger(prev => !prev)
        removeToast("cookieConsent")
        addToast({
            variant: "success", message: "Merci, les statistiques m'aide à améliorer le site 🙏."
        });

        router.refresh();
    }
    function DenyCookies() {
        if (typeof document === "undefined") return;
        document.cookie = "acceptedCookies=false; path=/; max-age=2592000`;";
        setTigger(prev => !prev)
        removeToast("cookieConsent")
        addToast({
            variant: "danger", message: "Très bien votre activité ne serai pas suivi."
        });

        router.refresh();
    }
    const CookieMessage = () => {
        return <Column gap="s">
            <Accordion title={<Row gap="s" center><Icon name='cookie' /><Text variant='body-strong-s'>Ce site utilise des cookies à des fins statistiques uniquement.</Text></Row>}>
                <Column gap='s'>
                    <Text onBackground="neutral-weak" variant='body-strong-m'>
                        Les informations collectées incluent :
                    </Text>
                    <Column>
                        <Text onBackground="neutral-weak">📄 Les pages consultées</Text>
                        <Text onBackground="neutral-weak">🌍 l&apos;origine de votre visite</Text>
                        <Text onBackground="neutral-weak">🌐 Votre navigateur</Text>
                        <Text onBackground="neutral-weak">💻 votre système d’exploitation</Text>
                        <Text onBackground="neutral-weak">📍Le pays associé à votre adresse IP</Text>
                    </Column>
                    <Feedback
                        variant="success"
                        icon
                        description="Aucunes de ces informations n&apos;est partagées avec des tiers."
                    />

                </Column>

            </Accordion>
            <Row gap={"m"}>
                <Button size='s' onClick={() => AcceptCookies()}>Accepter</Button>
                <Button size='s' variant='secondary' onClick={() => DenyCookies()}>Refuser</Button>
            </Row>
        </Column>
    }

    useEffect(() => {
        if (typeof document === "undefined") return;
        const cookies = getCookies();
        console.log("CookieConsent", cookies)
        // Vérifie si l'utilisateur a déjà accepté les cookies
        if ((cookies?.acceptedCookies === undefined) && !!addToast && !trigger) {
            // Affiche le toast d'avertissement
            //  alert("Nous utilisons des cookies pour améliorer votre expérience. En continuant à naviguer, vous acceptez notre utilisation des cookies.");
            addToast({
                id: "cookieConsent",
                variant: "success", message: <CookieMessage />, keepVisible: true
            });
        }
        if (cookies?.acceptedCookies === "true") {
            setAccepted(true)
        }
    }, [trigger]);
    if (accepted) {
        return <>
            <Analytics />
        </>;
    }
    return <></>;
};


export default CookieConsent;