import { Column, Flex, Heading, Icon, IconButton, Text } from "@/once-ui/components";

export default function NotFound() {
  return (
    <Column as="section" fill center paddingBottom="40" gap="l">
      <Text marginBottom="s" variant="display-strong-xl">
        404
      </Text>
      <Heading marginBottom="l" variant="display-default-xs">
      😥 Page introuvable
      </Heading>
      <Flex
        fitWidth
        border="brand-alpha-medium"
        style={{
          backdropFilter: "blur(var(--static-space-1))",
        }}
        background="brand-alpha-weak"
        radius="full"
        marginTop="20"
        padding="4"
        gap="8"
        marginBottom="m"
        vertical="center"
      >
        <Icon paddingLeft="12" name="home" onBackground="brand-weak" />
        <Flex paddingX="8">Retourner à l'accueil</Flex>
        <IconButton
          href={"/"}
          data-border="rounded"
          variant="secondary"
          icon="chevronRight"
        />
      </Flex>

    </Column>
  );
}
