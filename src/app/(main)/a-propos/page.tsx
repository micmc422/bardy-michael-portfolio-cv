"use server"

import {
  Avatar,
  Button,
  Column,
  Heading,
  Icon,
  IconButton,
  Media,
  Row,
  Skeleton,
  Tag,
  Text,
  type IconName,
} from "@once-ui-system/core";
import { RevealFx } from "@once-ui-system/fx";
import Meta from "@/modules/seo/Meta";
import { baseURL } from "@/core/config";
import dynamic from "next/dynamic";

// import TableOfContents from "@/modules/blog/components/TableOfContents";
const TableOfContents = dynamic(() => import('@/modules/blog/components/TableOfContents'), {
  loading: () => <Row>
    <Skeleton shape="line" width="160" />
    <Skeleton shape="line" width="160" />
    <Skeleton shape="line" width="160" />
    <Skeleton shape="line" width="160" />
    <Skeleton shape="line" width="160" />
    <Skeleton shape="line" width="160" />
    <Skeleton shape="line" width="160" />
  </Row>
  ,
});

import styles from "@/modules/blog/components/a-propos.module.scss";
import panel from "@/shared/components/PageHeader.module.scss";
import { person, about, social } from "@/core/config/content";
import React from "react";

export async function generateMetadata() {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

export default async function About() {
  const structure = [
    {
      title: about.intro.title,
      display: about.intro.display,
      items: [],
    },
    {
      title: about.work.title,
      display: about.work.display,
      items: about.work.experiences.map((experience) => experience.company),
    },
    {
      title: about.studies.title,
      display: about.studies.display,
      items: about.studies.institutions.map((institution) => institution.name),
    },
    {
      title: about.technical.title,
      display: about.technical.display,
      items: about.technical.skills.map((skill) => skill.title),
    },
  ];
  return (
    <Column as="article" maxWidth="m" className="isolate">
      {about.tableOfContent.display && (
        <Column
          as="aside"
          left="0"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed"
          paddingLeft="24"
          gap="32"
          s={{ hide: true }}

        >
          <TableOfContents structure={structure} about={about} />
        </Column>
      )}
      <Row fillWidth s={{ direction: "column" }} horizontal="center">
        {about.avatar.display && (
          <Column
            className={"isolate"}
            top="64"
            fitHeight
            position="sticky"
            s={{ position: "relative", style: { top: "auto" } }}
            xs={{ style: { top: "auto" } }}
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            flex={3}
            horizontal="center"
            zIndex={1}
          >
            <Avatar src={person.avatar} size="xl" />
            <Row gap="8" vertical="center">
              <Icon onBackground="accent-weak" name="globe" />
              {person.location}
            </Row>
            {person.languages && person.languages.length > 0 && (
              <Row wrap gap="8">
                {person.languages.map((language, index) => (
                  <Tag key={index} size="l">
                    {language}
                  </Tag>
                ))}
              </Row>
            )}
          </Column>
        )}
        <Column className={styles.blockAlign} flex={9} maxWidth="40rem">
          <Column
            id={about.intro.title}
            fillWidth
            minHeight="160"
            vertical="center"
            marginBottom="32"
          >
            {about.calendar.display && (
              <RevealFx fillWidth horizontal="start" s={{ horizontal: "center" }} paddingTop="16" paddingBottom="32" paddingLeft="8">
                <Tag
                  variant="announce"
                  background="brand-alpha-weak" paddingX="xs" paddingY="4" onBackground="brand-strong"
                  arrow={false}
                  href={about.calendar.link}
                  center
                  gap="s"
                  id="RDVBtn"
                  aria-label="Lien vers la prise de rendez-vous"
                >
                  <Row as="span" inline fit paddingLeft="12">
                    <Icon name="calendar" onBackground="brand-strong" />
                  </Row>
                  <Text style={{ paddingTop: "var(--static-space-4)" }}>Planifier un RDV</Text>
                  <IconButton
                    variant="ghost"
                    icon="chevronRight"
                  />
                </Tag>
              </RevealFx>
            )}
            <h1 className={`${panel.title} ${styles.textAlign}`}>{person.name}</h1>
            <p className={`${panel.lead} ${styles.textAlign}`}>{person.role}</p>
            {social.length > 0 && (
              <Row
                className={styles.blockAlign}
                paddingTop="20"
                paddingBottom="8"
                gap="8"
                wrap
                horizontal="center"
                fitWidth
                data-border="rounded"
              >
                {social
                  .filter((item) => item.essential)
                  .map(
                    (item) =>
                      item.link && (
                        <React.Fragment key={item.name}>
                          <Row s={{ hide: true }}>
                            <Button
                              key={item.name}
                              href={item.link}
                              prefixIcon={item.icon as IconName}
                              label={item.name}
                              size="s"
                              weight="default"
                              variant="secondary"
                            />
                          </Row>
                          <Row hide s={{ hide: false }}>
                            <IconButton
                              size="l"
                              key={`${item.name}-icon`}
                              href={item.link}
                              icon={item.icon as IconName}
                              variant="secondary"
                            />
                          </Row>
                        </React.Fragment>
                      ),
                  )}
              </Row>
            )}
          </Column>

          {about.intro.display && (
            <Column textVariant="body-default-l" fillWidth gap="m" marginBottom="xl">
              {about.intro.description}
            </Column>
          )}

          {about.work.display && (
            <>
              <Heading as="h2" id={about.work.title} textVariant="display-strong-m" marginBottom="m" marginTop="l">
                {about.work.title}
              </Heading>
              <Column fillWidth gap="m" marginBottom="40">
                {about.work.experiences.map((experience, index) => (
                  <Column key={`${experience.company}-${experience.role}-${index}`} fillWidth padding="l" className={panel.panel}>
                    <Row fillWidth horizontal="between" vertical="end" marginBottom="4">
                      <Text id={experience.company} textVariant="display-strong-s">
                        {experience.company}
                      </Text>
                      <Text textVariant="display-default-xs" onBackground="neutral-weak">
                        {experience.timeframe}
                      </Text>
                    </Row>
                    <Text textVariant="body-default-s" onBackground="brand-weak" marginBottom="m">
                      {experience.role}
                    </Text>
                    <Column as="ul" gap="12" className="list-disc" paddingLeft="24" marginY="1em">
                      {experience.achievements.map(
                        (achievement: React.ReactNode, index: number) => (
                          <Text
                            as="li"
                            textVariant="body-default-m"
                            key={`${experience.company}-${index}`}
                          >
                            {achievement}
                          </Text>
                        ),
                      )}
                    </Column>
                    {experience.images && experience.images.length > 0 && (
                      <Row fillWidth paddingTop="m" gap="12" wrap>
                        {experience.images.map((image, index) => (
                          <Row
                            key={index}
                            border="neutral-medium"
                            radius="m"
                            minWidth={`${image.width}rem`}
                            height={`${image.height}rem`}
                          >
                            <Media
                              enlarge
                              radius="m"
                              sizes={image.width.toString()}
                              alt={image.alt}
                              src={image.src}
                            />
                          </Row>
                        ))}
                      </Row>
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}

          {about.studies.display && (
            <>
              <Heading as="h2" id={about.studies.title} textVariant="display-strong-m" marginBottom="m" marginTop="l">
                {about.studies.title}
              </Heading>
              <Column fillWidth gap="m" marginBottom="40">
                {about.studies.institutions.map((institution, index) => (
                  <Column key={`${institution.name}-${index}`} fillWidth gap="4" padding="l" className={panel.panel}>
                    <Text id={institution.name} textVariant="display-strong-xs">
                      {institution.name}
                    </Text>
                    <Text textVariant="body-default-l" onBackground="neutral-weak">
                      {institution.description}
                    </Text>
                  </Column>
                ))}
              </Column>
            </>
          )}

          {about.technical.display && (
            <>
              <Heading
                as="h2"
                id={about.technical.title}
                textVariant="display-strong-m"
                marginBottom="m"
                marginTop="l"
              >
                {about.technical.title}
              </Heading>
              <Column fillWidth gap="m">
                {about.technical.skills.map((skill, index) => (
                  <Column key={`${skill}-${index}`} fillWidth gap="4" padding="l" className={panel.panel}>
                    <Text id={skill.title} textVariant="display-strong-s">
                      {skill.title}
                    </Text>
                    <Text textVariant="body-default-m" onBackground="neutral-weak">
                      {skill.description}
                    </Text>
                    {skill.tags && skill.tags.length > 0 && (
                      <Row wrap gap="8" paddingTop="8">
                        {skill.tags.map((tag, tagIndex) => (
                          <Tag key={`${skill.title}-${tagIndex}`} size="l" prefixIcon={tag.icon as IconName}>
                            {tag.name}
                          </Tag>
                        ))}
                      </Row>
                    )}
                    {skill.images && skill.images.length > 0 && (
                      <Row fillWidth paddingTop="m" gap="12" wrap>
                        {skill.images.map((image, index) => (
                          <Row
                            key={index}
                            border="neutral-medium"
                            radius="m"
                            minWidth={`${image.width}rem`}
                            height={`${image.height}rem`}
                          >
                            <Media
                              enlarge
                              radius="m"
                              sizes={image.width.toString()}
                              alt={image.alt}
                              src={image.src}
                            />
                          </Row>
                        ))}
                      </Row>
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}
        </Column>
      </Row>
    </Column>

  );
}
