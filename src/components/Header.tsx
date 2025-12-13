"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Fade, Flex, Line, ToggleButton } from "@once-ui-system/core";
import styles from "@/components/Header.module.scss";

import { routes, display } from "@/app/resources";
import { person, about, blog, work, estimation } from "@/app/resources/content";
import { ThemeToggle } from "./ThemeToggle";

type TimeDisplayProps = {
  timeZone: string;
  locale?: string;
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = "en-GB" }) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat(locale, options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <>{currentTime}</>;
};

export default TimeDisplay;

export const Header = () => {
  const pathname = usePathname() ?? "";

  return (
    <>
      <Fade fillWidth position="fixed" height={80} zIndex={9} className={styles.desktopOnly} />
      <Flex
        fitHeight
        position="unset"
        className={styles.position}
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
      >
        <Flex paddingLeft="12" fillWidth vertical="center" textVariant="body-default-s">
          {person.place && <Flex className={styles.desktopOnly}>{person.place}</Flex>}
        </Flex>
        <Flex fillWidth horizontal="center">
          <Flex
            background="surface"
            border="neutral-alpha-medium"
            radius="m-4"
            shadow="l"
            padding="4"
            horizontal="center"
            zIndex={1}
          >
            <Flex gap="4" vertical="center" textVariant="body-default-s">
              {routes["/"] && (
                <ToggleButton
                  aria-label={`accueil du porfolio de ${person.name}`}
                  prefixIcon="home"
                  href="/"
                  selected={pathname === "/"}
                />
              )}
              <Line background="neutral-alpha-medium" vert maxHeight={24} />
              {routes["/a-propos"] && (
                <>
                  <Flex s={{ hide: true }}>
                    <ToggleButton
                      prefixIcon="person"
                      href="/a-propos"
                      label={about.label}
                      aria-label={about.label}
                      selected={pathname === "/a-propos"}
                    />
                  </Flex>
                  <Flex hide s={{ hide: false }}>
                    <ToggleButton
                      prefixIcon="person"
                      href="/a-propos"
                      aria-label={about.label}
                      selected={pathname === "/a-propos"}
                    />
                  </Flex>
                </>
              )}
              {routes["/realisations"] && (
                <>
                  <Flex s={{ hide: true }}>
                    <ToggleButton
                      prefixIcon="grid"
                      href="/realisations"
                      label={work.label}
                      aria-label={work.label}
                      selected={pathname.startsWith("/realisations")}
                    />
                  </Flex>
                  <Flex hide s={{ hide: false }}>
                    <ToggleButton
                      prefixIcon="grid"
                      href="/realisations"
                      aria-label={work.label}
                      selected={pathname.startsWith("/realisations")}
                    />
                  </Flex>
                </>
              )}
              {routes["/estimation"] && (
                <>
                  <Flex s={{ hide: true }}>
                    <ToggleButton
                      prefixIcon="euro"
                      href="/estimation"
                      label={estimation.label}
                      aria-label={estimation.label}
                      selected={pathname.startsWith("/estimation")}
                    />
                  </Flex>
                  <Flex hide s={{ hide: false }}>
                    <ToggleButton
                      prefixIcon="euro"
                      href="/estimation"
                      aria-label={estimation.label}
                      selected={pathname.startsWith("/estimation")}
                    />
                  </Flex>
                </>
              )}
              {routes["/blog"] && (
                <>
                  <Flex s={{ hide: true }}>
                    <ToggleButton
                      prefixIcon="book"
                      href="/blog"
                      label={blog.label}
                      aria-label={blog.label}
                      selected={pathname.startsWith("/blog")}
                    />
                  </Flex>
                  <Flex hide s={{ hide: false }}>
                    <ToggleButton
                      prefixIcon="book"
                      href="/blog"
                      aria-label={blog.label}
                      selected={pathname.startsWith("/blog")}
                    />
                  </Flex>
                </>
              )}
              {display.themeSwitcher && (
                <>
                  <Line background="neutral-alpha-medium" vert maxHeight={24} />
                  <ThemeToggle />
                </>
              )}
            </Flex>
          </Flex>
        </Flex>
        <Flex fillWidth horizontal="end" vertical="center">
          <Flex
            paddingRight="12"
            horizontal="end"
            vertical="center"
            textVariant="body-default-s"
            gap="20"
          >
            <Flex className={styles.desktopOnly}>{display.time && <TimeDisplay timeZone={person.location} />}</Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
