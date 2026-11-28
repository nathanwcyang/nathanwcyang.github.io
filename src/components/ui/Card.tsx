// A raised surface for project cards.
import { Card as AstryxCard } from "@astryxdesign/core/Card";
import type { ComponentProps } from "react";
import { Themed } from "./Themed";

export function Card(props: ComponentProps<typeof AstryxCard>) {
  return <Themed><AstryxCard elevation="low" {...props} /></Themed>;
}
