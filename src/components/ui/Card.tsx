// A raised surface for project cards.
import { Card as AstryxCard } from "@astryxdesign/core/Card";
import type { ComponentProps } from "react";

export function Card(props: ComponentProps<typeof AstryxCard>) {
  return <AstryxCard elevation="low" {...props} />;
}
