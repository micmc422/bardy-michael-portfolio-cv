'use client'

import { baseURL } from '@/app/resources'
import { Text, Flex, SmartLink } from '@/once-ui/components'
import { IconName } from '@/once-ui/icons'
import { usePathname } from 'next/navigation'


export function SocialShareBar() {
    const pathname = usePathname()
    const url = `${baseURL}${pathname}`

    const shareLinks: { label: string, description: string, link: string, iconName: IconName }[] = [{
        label: "facebook",
        description: "Partager sur facebook",
        link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        iconName: "facebook"
    },
    {
        label: "twitter/X",
        description: "Partager sur X (Twitter)",
        link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
        iconName: "twitter"
    },
    {
        label: "linkedin",
        description: "Partager sur linkedin",
        link: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`,
        iconName: "linkedin"
    },
    {
        label: "email",
        description: "Partager par courriel",
        link: `mailto:?subject=Je voulais partager ça avec toi&body=Voici le lien: ${encodeURIComponent(url)}`,
        iconName: "email"
    }]
    return (<Flex gap='xs'>
        <Text>Partager : </Text>
            {shareLinks.map(({ label, link, description, iconName }) => <SmartLink key={label} href={link} target="_blank" rel="noopener noreferrer" title={description} prefixIcon={iconName}>
                {""}
            </SmartLink>)}

        </Flex>
    )
}
