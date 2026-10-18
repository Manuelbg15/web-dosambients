import { getCollection } from 'astro:content';

export const formatDate = (d: Date) =>
  d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

// Noticias publicadas (sin borradores), de más reciente a más antigua.
export const getNews = async () =>
  (await getCollection('actualitat', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
