import { Column, Flex, IconButton, SmartLink, Text } from "@once-ui-system/core";
import { person, rendezVous, social } from "@/app/resources/content";
import styles from "./Footer.module.scss";
import { RDV } from "./Rdv";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Column
      as="footer"
      fillWidth
      padding={"m"}
      gap="m"
      horizontal="center"
    >
      <RDV content={rendezVous} />
      <Flex
        className={styles.mobile}
        maxWidth="m"
        gap="m"
        horizontal="between"
        vertical="center"
      >
        <Text variant="body-default-s" onBackground="neutral-strong">
          <Text onBackground="neutral-weak">© {currentYear} /</Text>
          <Text paddingX="4">{person.name}</Text>
          <Text onBackground="neutral-weak">
            {/* Usage of this template requires attribution. Please don't remove the link to Once UI. */}
            / Votre site internet en {" "}
            <SmartLink
              href="https://occitaweb.fr/webmaster-albi"
            >
              Occitanie
            </SmartLink>
          </Text>
        </Text>
        <Flex gap="s">
          {social.map(
            (item) =>
              item.link && (
                <IconButton
                  key={item.name}
                  href={item.link}
                  icon={item.icon}
                  tooltip={item.name}
                  size="s"
                  variant="ghost"
                />
              ),
          )}
        </Flex>
      </Flex>
    </Column>
  );
};
