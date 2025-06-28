'use client'

import { useState, useEffect, useTransition } from 'react'
import { subscribeUser, unsubscribeUser } from '@/app/pwaActions'
import { Icon, useToast, Spinner } from '@/once-ui/components'

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
    const { addToast } = useToast();
    const [loading, startTransition] = useTransition()
    const [isSupported, setIsSupported] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(
        null
    )
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
            addToast({
                variant: "success", message: "Vous recevrez maintenant des notifications lors de la publication de nouveaux articles."
            });
        } catch (e) {
            console.log({ e })
        }
    }
    function handleSubscribe() {
        startTransition(() => subscribeToPush())
    }
    function handleUnSubscribe() {
        startTransition(() => unsubscribeFromPush())
    }
    async function unsubscribeFromPush() {
        await subscription?.unsubscribe()
        setSubscription(null)
        await unsubscribeUser()
        addToast({
            variant: "success", message: "Vous ne recevrez plus les notifications."
        });
    }
    /*
        async function sendTestNotification() {
            if (subscription) {
                await sendNotification(message)
                setMessage('')
            }
        }
    */
    if (!isSupported) {
        return <></>
    }
    if (loading) {
        return <Spinner size='s' />
    }
    return <Icon name={subscription ? 'notifOn' : 'notifOff'} size='s' onBackground={subscription ? 'success-weak' : 'danger-weak'} onClick={() => !!subscription ? handleUnSubscribe() : handleSubscribe()} />
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
                    </span >
                    and then & quot;Add to Home Screen & quot;
                    <span role="img" aria-label="plus icon">
                        {' '}
                        ➕{' '}
                    </span>.
                </p >
            )
            }
        </div >
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