import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://nathanwcyang.github.io',
  // The CV now lives on the home page
  redirects: { '/cv': '/#experience' },
  integrations: [mdx(), sitemap(), tailwind(), react()]
});