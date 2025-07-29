import { Heading, Text } from "@once-ui-system/core";

export default async function HeadlineEstimationRoot() {
    return <>
        <Heading as="h1" variant="display-strong-xl">Estimation de votre <Text onBackground="brand-weak">projet</Text></Heading>
        <Text variant="body-default-xl" align="center" wrap="balance" onBackground="neutral-weak">Obtenez une estimation personnalisée pour votre site internet. Du <b>site vitrine</b> au <b>CRM</b> complexe, nous adaptons nos solutions à vos besoins.</Text>
    </>
}