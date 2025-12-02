import { Column, Meta } from "@once-ui-system/core";
import { PokemonCompare } from "@/components/pokemon";
import { baseURL } from "@/app/resources";
import Schema from "@/modules/seo/Schema";

const pageTitle = "Comparateur Pokémon";
const pageDescription = "Comparez les statistiques de deux Pokémon côte à côte avec des graphiques radar superposés.";
const pagePath = "/pokemon";

export async function generateMetadata() {
    return Meta.generate({
        title: pageTitle,
        description: pageDescription,
        baseURL: baseURL,
        image: `${baseURL}/og?title=${encodeURIComponent(pageTitle)}`,
        path: pagePath,
    });
}

export default function PokemonPage() {
    return (
        <>
            <Schema
                as="webPage"
                baseURL={baseURL}
                path={pagePath}
                title={pageTitle}
                description={pageDescription}
                image={`${baseURL}/og?title=${encodeURIComponent(pageTitle)}`}
            />
            <Column paddingY="24" gap="l" fillWidth horizontal="center">
                <PokemonCompare />
            </Column>
        </>
    );
}
