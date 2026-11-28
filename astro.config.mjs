import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://nathanwcyang.github.io',
  // The CV and contact details now live on the home page
  redirects: { '/cv': '/#experience', '/contact': '/' },
  integrations: [sitemap(), react()],
  vite: { plugins: [tailwindcss()] }
});