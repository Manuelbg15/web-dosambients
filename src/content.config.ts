import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { cmsLoader } from './lib/cms-loader';

const newsSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  // Ruta en public/images/ (p. ej. /images/actualidad/foto.webp) o URL absoluta (imágenes del CMS)
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  // Las noticias con draft: true no se publican.
  draft: z.boolean().default(false),
});

// Noticias escritas a mano: un archivo Markdown por noticia en src/content/actualitat/.
// El nombre del archivo es la URL: /actualidad/<nombre-del-archivo>/
const actualitat = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/actualitat' }),
  schema: newsSchema,
});

// Noticias publicadas desde el CMS (cms.dragonrcnc.com), descargadas en el build.
const cms = defineCollection({
  loader: cmsLoader(),
  schema: newsSchema,
});

export const collections = { actualitat, cms };
