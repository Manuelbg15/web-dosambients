import { getCollection } from 'astro:content';

export const formatDate = (d: Date) =>
  d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

// Noticias publicadas (sin borradores) del CMS y de los Markdown locales, de más reciente a más antigua.
// Si un slug coincide, manda la noticia en Markdown.
export const getNews = async () => {
  const local = await getCollection('actualitat', ({ data }) => !data.draft);
  const ids = new Set(local.map((n) => n.id));
  const cms = (await getCollection('cms', ({ data }) => !data.draft)).filter((n) => !ids.has(n.id));
  return [...local, ...cms].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
};
