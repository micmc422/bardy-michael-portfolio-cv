"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion, Button, Column, Heading, Text, useToast } from '@/once-ui/components';

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
const CookieMessage = () => {
    return <Column gap="2">
        <Accordion title={<Text variant='body-strong-s'>Ce site utilise des cookies à des fins statistiques uniquement.</Text>}>
            <Text onBackground="neutral-weak" variant='body-strong-m'>
                Les informations collectées incluent :
            </Text>
            <>
                <Text onBackground="neutral-weak">Les pages consultées</Text>
                <Text onBackground="neutral-weak">l'origine de votre visite</Text>
                <Text onBackground="neutral-weak">votre navigateur</Text>
                <Text onBackground="neutral-weak">votre système d’exploitation</Text>
                <Text onBackground="neutral-weak">Le pays associé à votre adresse IP</Text>
            </>
            <Text onBackground="success-medium" variant='body-strong-m'>
                Aucunes de ces informations n'est partagées avec des tiers.
            </Text>
        </Accordion>
    </Column>
}
const CookieConsent: React.FC = () => {
    const { addToast, removeToast } = useToast();
    const [trigger, setTigger] = useState(false)
    const router = useRouter()
    function AcceptCookies() {
        if (typeof document === "undefined") return;
        document.cookie = "acceptedCookies=true; path=/; max-age=2592000`;";
        setTigger(prev => !prev)
        removeToast("cookieConsent")
        router.refresh();
    }
    useEffect(() => {
        if (typeof document === "undefined") return;
        const cookies = getCookies();
        console.log("CookieConsent", cookies)
        // Vérifie si l'utilisateur a déjà accepté les cookies
        if (cookies?.acceptedCookies !== "true" && !!addToast && !trigger) {
            // Affiche le toast d'avertissement
            //  alert("Nous utilisons des cookies pour améliorer votre expérience. En continuant à naviguer, vous acceptez notre utilisation des cookies.");
            addToast({
                id: "cookieConsent",
                variant: "success", message: <CookieMessage />, keepVisible: true, action: <Button onClick={() => AcceptCookies()}>OK</Button>
            });
        }
    }, [trigger]);

    return <></>;
};


export default CookieConsent;