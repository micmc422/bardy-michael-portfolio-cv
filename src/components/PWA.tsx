'use client'

import { useState, useEffect, useTransition } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from '@/app/pwaActions'
import { Button, Column, Dialog, Icon, Row, Switch, Text, Banner } from '@/once-ui/components'

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export function PushNotificationManager() {
    const [loading, startTransition] = useTransition()
    const [isSupported, setIsSupported] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(
        null
    )
    const [message, setMessage] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            registerServiceWorker()
        }
    }, [])

    async function registerServiceWorker() {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none',
        })
        const sub = await registration.pushManager.getSubscription()
        setSubscription(sub)
    }

    async function subscribeToPush() {
        try {
            const registration = await navigator.serviceWorker.ready
            console.log("registration", { registration })
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                ),
            })
            setSubscription(sub)

            const serializedSub = JSON.parse(JSON.stringify(sub))
            await subscribeUser(serializedSub)

        } catch (e) {
            console.log({e})
        }
    }

    async function unsubscribeFromPush() {
        await subscription?.unsubscribe()
        setSubscription(null)
        await unsubscribeUser()
    }

    async function sendTestNotification() {
        if (subscription) {
            await sendNotification(message)
            setMessage('')
        }
    }
    async function handleToggleNotif() {
        startTransition(() => {
            if (!subscription) {
                subscribeToPush()
            } else {
                unsubscribeFromPush()
            }
        })
    }
    if (!isSupported) {
        return <></>
    }
    return <Row>
        <Text>Notifications : </Text>
        {subscription ?
            <Icon name='notifOn' size='s' onBackground='success-weak' onClick={() => setIsOpen(true)} />
            :
            <Icon name='notifOff' size='s' onBackground='danger-weak' onClick={() => setIsOpen(true)} />
        }
        <Dialog
            maxWidth={32}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Notifications"
        >
            <Column gap='s'>
                <Switch
                    label={!!subscription ? "Notifications Activées" : "Notifications Désactivées"}
                    description="En acceptant les notifications vous recevrez un message directement sur votre appareil lors de la publications de nouvelles publications."
                    isChecked={!!subscription}
                    onToggle={() => handleToggleNotif()}
                    loading={loading}
                />
                <Banner solid="warning-medium" onSolid="warning-strong" center radius='s'>
                    <Icon name="warningTriangle" size="s" />
                    Fonctionnalité en développement
                </Banner>
            </Column>
        </Dialog>
    </Row>
    return (
        <Column>
            <h3>Push Notifications</h3>
            {subscription ? (
                <>
                    <p>You are subscribed to push notifications.</p>
                    <button onClick={unsubscribeFromPush}>Unsubscribe</button>
                    <input
                        type="text"
                        placeholder="Enter notification message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={sendTestNotification}>Send Test</button>
                </>
            ) : (
                <>
                    <p>You are not subscribed to push notifications.</p>
                    <button onClick={subscribeToPush}>Subscribe</button>
                </>
            )}
        </Column>
    )
}

export function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)

    useEffect(() => {
        setIsIOS(
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
        )

        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
    }, [])

    if (isStandalone) {
        return null // Don't show install button if already installed
    }

    return (
        <div>
            <h3>Install App</h3>
            <button>Add to Home Screen</button>
            {isIOS && (
                <p>
                    To install this app on your iOS device, tap the share button
                    <span role="img" aria-label="share icon">
                        {' '}
                        ⎋{' '}
                    </span>
                    and then &quot;Add to Home Screen&quot;
                    <span role="img" aria-label="plus icon">
                        {' '}
                        ➕{' '}
                    </span>.
                </p>
            )}
        </div>
    )
}

export default function PWA() {
    return (
        <div>
            <PushNotificationManager />
            <InstallPrompt />
        </div>
    )
}