// Astro renders each React component on its own, so every wrapper puts itself inside the ayu <Theme>
// (Astryx's provider: theme icons, tokens). Its wrapper <div> is display: contents, so layout is unchanged.
// The generated theme module also loads the theme's stylesheet; its rules sit in Astryx's cascade layers.
import type { ReactNode } from "react";
import { Theme } from "@astryxdesign/core/theme";
import { themes, defaultThemeSlug, themeModes } from "../../astryx-themes";

export function Themed({ children }: { children: ReactNode }) {
  return (
    <Theme theme={themes[defaultThemeSlug]} mode={themeModes[defaultThemeSlug] ?? "light"}>
      {children}
    </Theme>
  );
}
