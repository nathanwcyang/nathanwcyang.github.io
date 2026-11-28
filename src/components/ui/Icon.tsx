// The site's icon. Astryx semantic names ("menu", "chevronRight") or any SVG component (Phosphor).
// Only a semantic name needs the theme (its icon set); an SVG component skips <Theme>, whose <div>
// would otherwise break out of a surrounding <p>.
import { Icon as AstryxIcon } from "@astryxdesign/core/Icon";
import type { ComponentProps } from "react";
import { Themed } from "./Themed";

export function Icon(props: ComponentProps<typeof AstryxIcon>) {
  const icon = <AstryxIcon {...props} />;
  return typeof props.icon === "string" ? <Themed>{icon}</Themed> : icon;
}
