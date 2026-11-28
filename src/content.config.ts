import { defineCollection, type SchemaContext } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
type ImageFn = SchemaContext["image"];
const projectSchema = ({ image }: { image: ImageFn }) => z.object({
    title: z.string(),
    description: z.string(),
    // Which section of the Projects page it appears in
    category: z.enum(["pharmacy", "creative"]),
    // Used to sort newest first
    date: z.coerce.date(),
    // Featured projects always show first on the home page
    featured: z.boolean().default(false),
    // Screenshot in src/assets/projects/<slug>/. Shows on the card and at the top of the page.
    heroImage: image().optional(),
    // Screen-reader description of heroImage (required with it)
    heroAlt: z.string().optional(),
    // Optional caption under the image on the project page
    heroCaption: z.string().optional(),
    badge: z.string().optional(),
}).refine((p) => !p.heroImage || p.heroAlt, { message: "heroAlt is required when heroImage is set", path: ["heroAlt"] });

export type ProjectSchema = z.infer<ReturnType<typeof projectSchema>>;

const projectCollection = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
    schema: projectSchema,
});

// The CV: one file, src/content/cv.md, validated so a typo in a field name fails the build.
const cvEntry = z.object({ title: z.string(), org: z.string(), dates: z.string() });
const cvCollection = defineCollection({
    loader: glob({ pattern: "cv.md", base: "./src/content" }),
    schema: z.object({
        experience: z.array(cvEntry.extend({
            location: z.string(),
            type: z.string(),
            bullets: z.array(z.string()).min(1),
            // Inline markdown links allowed: [text](/url)
            achievement: z.string().optional(),
        })),
        education: z.array(cvEntry),
        certifications: z.array(z.string()),
        skills: z.array(z.object({ group: z.string(), items: z.array(z.string()).min(1) })),
    }),
});

export const collections = {
    'projects': projectCollection,
    'cv': cvCollection,
}