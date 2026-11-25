import { z, defineCollection } from "astro:content";
const blogSchema = z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.string().optional(),
    heroImage: z.string().optional(),
    badge: z.string().optional(),
    tags: z.array(z.string()).refine(items => new Set(items).size === items.length, {
        message: 'tags must be unique',
    }).optional(),
});


const projectSchema = z.object({
    title: z.string(),
    description: z.string(),
    // Which section of the Projects page it appears in
    category: z.enum(["pharmacy", "creative"]),
    // Used to sort newest first
    date: z.coerce.date(),
    // Featured projects always show first on the home page
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
    badge: z.string().optional(),
});

export type ProjectSchema = z.infer<typeof projectSchema>;
export type BlogSchema = z.infer<typeof blogSchema>;

const projectCollection = defineCollection({ schema: projectSchema });
const blogCollection = defineCollection({ schema: blogSchema });

export const collections = {
    'blog': blogCollection,
    'projects': projectCollection,
}