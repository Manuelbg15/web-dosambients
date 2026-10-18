import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Noticias: un archivo Markdown por noticia en src/content/actualitat/.
// El nombre del archivo es la URL: /actualidad/<nombre-del-archivo>/
const actualitat = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/actualitat' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    // Ruta a una imagen en public/images/ (opcional), p. ej. /images/actualidad/foto.webp
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    // Las noticias con draft: true no se publican.
    draft: z.boolean().default(false),
  }),
});

export const collections = { actualitat };
