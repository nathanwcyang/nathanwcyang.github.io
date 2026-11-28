// The site's icon. Astryx semantic names ("menu", "chevronRight") or any SVG component (Phosphor).
import { Icon as AstryxIcon } from "@astryxdesign/core/Icon";
import type { ComponentProps } from "react";

export function Icon(props: ComponentProps<typeof AstryxIcon>) {
  return <AstryxIcon {...props} />;
}
