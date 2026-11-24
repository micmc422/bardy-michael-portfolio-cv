import { Column, Flex, Heading, Icon, IconButton, Row, Text } from "@once-ui-system/core";

export default function NotFound() {
  return (
    <Column as="section" fill center paddingBottom="40" gap="l">
      <Text marginBottom="s" textVariant="display-strong-xl">
        404
      </Text>
      <Heading marginBottom="l" textVariant="display-default-xs">
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
        <Row fit paddingLeft="12">
          <Icon name="home" onBackground="brand-weak" />
        </Row>
        <Flex paddingX="8">Retourner à l&apos;accueil</Flex>
        <IconButton
          href={"/"}
          variant="secondary"
          icon="chevronRight"
        />
      </Flex>

    </Column>
  );
}
