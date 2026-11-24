import { Row, ToggleButton, type IconName } from "@once-ui-system/core";
import { DraggableFlexRow } from "@/shared/components/DraggableRow";
import { siteTypes } from "../models/estimationData";

export function SiteTypeNav({ activeSlug }: { activeSlug: string }) {
  return (
    <nav aria-label="Type de projet" style={{ width: "100%" }}>
      <DraggableFlexRow>
        <Row wrap={false} gap="s">
          {siteTypes.map((site) => (
            <ToggleButton
              key={site.slug}
              prefixIcon={site.icon as IconName}
              label={site.name}
              selected={site.slug === activeSlug}
              href={`/estimation/${site.slug}`}
              size="s"
            />
          ))}
        </Row>
      </DraggableFlexRow>
    </nav>
  );
}
