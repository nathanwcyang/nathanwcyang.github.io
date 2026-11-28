// A small label: a project's category, or a skill pill.
import { Token } from "@astryxdesign/core/Token";
import type { ComponentProps } from "react";
import { Themed } from "./Themed";

export function Tag(props: ComponentProps<typeof Token>) {
  return <Themed><Token size="md" {...props} /></Themed>;
}
