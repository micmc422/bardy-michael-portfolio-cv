import { rdv } from "@/app/resources";
import { Heading, Text, Background, Column, type opacity, type SpacingToken } from "@once-ui-system/core";
import { type JSX, Suspense } from "react";
import { RDVDropDown } from "./RdvDropDown";
import type { RDVContentType } from "@/app/api/cal/types/route";

const CAL_API_KEY = process.env.CAL_API_KEY;
const CAL_API_BASE_URL = 'https://api.cal.com/v2';

type SectionContentProps = {
  display: boolean;
  title: string | JSX.Element;
  description: string | JSX.Element;
  href?: string;
};


async function getRDVContent(): Promise<RDVContentType[]> {
  const response = await fetch(`${CAL_API_BASE_URL}/event-types`, {
    headers: {
      Authorization: `Bearer ${CAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    return Promise.reject(new Error(error));
  }

  const { data } = await response.json();
  const events = data.eventTypeGroups[0].eventTypes.filter((event: any) => !event.hidden)
    .map((event: any) => ({
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description,
      duration: event.length,
      locations: event.locations,
      requiresConfirmation: event.requiresConfirmation,
      price: event.price,
      currency: event.currency,
    }));
  return events;
}

export const RDV = ({ content }: { content: SectionContentProps }) => {

  return (
    <Column
      overflow="hidden"
      width={"s"}
      radius="l"
      background="surface"
      border="neutral-alpha-weak"
      id="RDV"
    >
      <Background
        fill
        position="absolute"
        mask={{
          x: rdv.effects.mask.x,
          y: rdv.effects.mask.y,
          radius: rdv.effects.mask.radius,
          cursor: rdv.effects.mask.cursor
        }}
        gradient={{
          display: rdv.effects.gradient.display,
          opacity: rdv.effects.gradient.opacity as opacity,
          x: rdv.effects.gradient.x,
          y: rdv.effects.gradient.y,
          width: rdv.effects.gradient.width,
          height: rdv.effects.gradient.height,
          tilt: rdv.effects.gradient.tilt,
          colorStart: rdv.effects.gradient.colorStart,
          colorEnd: rdv.effects.gradient.colorEnd,
        }}
        dots={{
          display: rdv.effects.dots.display,
          opacity: rdv.effects.dots.opacity as opacity,
          size: rdv.effects.dots.size as SpacingToken,
          color: rdv.effects.dots.color,
        }}
        grid={{
          display: rdv.effects.grid.display,
          opacity: rdv.effects.grid.opacity as opacity,
          color: rdv.effects.grid.color,
          width: rdv.effects.grid.width,
          height: rdv.effects.grid.height,
        }}
        lines={{
          display: rdv.effects.lines.display,
          opacity: rdv.effects.lines.opacity as opacity,
          size: rdv.effects.lines.size as SpacingToken,
          thickness: rdv.effects.lines.thickness,
          angle: rdv.effects.lines.angle,
          color: rdv.effects.lines.color,
        }}
      />
      <Column
        padding="xl"
        marginBottom="m"
        horizontal="center"
        align="center"
      >
        <Heading style={{ position: "relative" }} marginBottom="s" variant="display-strong-xs">
          {content.title}
        </Heading>
        <Text
          style={{
            position: "relative",
            maxWidth: "var(--responsive-width-xs)",
          }}
          wrap="balance"
          marginBottom="l"
          onBackground="neutral-medium"
        >
          {content.description}
        </Text>
        <Suspense fallback={
          <Text variant="body-default-s" onBackground="neutral-weak">
            Chargement des disponibilités...
          </Text>}>
          <RDVDropDown eventTypesPromise={getRDVContent()} />
        </Suspense>
      </Column>
    </Column >
  );
};

