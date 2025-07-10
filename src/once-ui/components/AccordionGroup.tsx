import React from "react";
import { Column, Accordion, Line, Text, Button, Row } from "@/once-ui/components";

export type AccordionItem = {
  title: React.ReactNode;
  content: React.ReactNode;
  link?: {
    label?: string;
    path?: string
  }
};

export interface AccordionGroupProps extends React.ComponentProps<typeof Column> {
  items: AccordionItem[];
  size?: "s" | "m" | "l";
}

const AccordionGroup: React.FC<AccordionGroupProps> = ({ items, size = "m", ...rest }) => {
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <Column fillWidth radius="m" border="neutral-alpha-medium" overflow="hidden" {...rest}>
      {items.map((item, index) => {

        return (
          <React.Fragment key={index}>
            <Accordion title={item.title} size={size}>
              <Text onBackground="neutral-weak">{item.content?.toString()}</Text>
              {item?.link && <Row marginTop={"s"}>
                <Button href={item.link.path}>{item.link.label}</Button>
              </Row>}
            </Accordion>
            {index < items.length - 1 && <Line background="neutral-alpha-medium" />}
          </React.Fragment>
        )
      })}
    </Column>
  );
};

AccordionGroup.displayName = "AccordionGroup";
export { AccordionGroup };
