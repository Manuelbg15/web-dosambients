import type { APIRoute } from 'astro';
import { nav, legalNav } from '../data/site';
import { getNews } from '../data/news';

// Sitemap generado en el build a partir del menú, las páginas legales y las noticias publicadas.
export const GET: APIRoute = async ({ site }) => {
  const news = await getNews();
  const paths = [...nav.map((n) => n.href), ...legalNav.map((n) => n.href), ...news.map((n) => `/actualidad/${n.id}/`)];
  const urls = paths.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
