import { z, defineCollection, type SchemaContext } from "astro:content";
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

const projectCollection = defineCollection({ schema: projectSchema });

export const collections = {
    'projects': projectCollection,
}