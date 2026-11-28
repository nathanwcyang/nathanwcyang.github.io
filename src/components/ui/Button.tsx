// The site's button. With href it renders a link.
// `icon` takes the icon itself (a Phosphor component or an Astryx icon name), so .astro pages can pass it.
import { Button as AstryxButton } from "@astryxdesign/core/Button";
import type { ComponentProps } from "react";
import { Icon } from "./Icon";

type Props = Omit<ComponentProps<typeof AstryxButton>, "icon"> & { icon?: ComponentProps<typeof Icon>["icon"] };

export function Button({ icon, ...props }: Props) {
  return <AstryxButton {...props} icon={icon && <Icon icon={icon} />} />;
}
