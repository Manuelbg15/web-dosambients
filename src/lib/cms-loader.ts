// Loader de Astro para las noticias del CMS (https://cms.dragonrcnc.com).
// Se ejecuta en el build: descarga las noticias de la API y las guarda como una colección,
// así la API Key nunca llega al navegador.
//
// Variables de entorno (en local, en el archivo .env; en GitHub, como secrets):
//   CMS_API_KEY  → API Key del sitio en el CMS (obligatoria para cargar noticias)
//   CMS_API_URL  → opcional, por defecto https://cms.dragonrcnc.com/api/noticias
//   CMS_ORIGIN   → opcional, por defecto dosambients.es
//
// Si falta la clave o el CMS no responde, el build continúa sin noticias del CMS.
import type { Loader } from 'astro/loaders';
import { loadEnv } from 'vite';

type Raw = Record<string, unknown>;
// Tipado mínimo de process (el proyecto no incluye @types/node)
declare const process: { env: Record<string, string | undefined>; cwd(): string };

const env = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'CMS_'), ...process.env };

// Devuelve el primer campo con valor entre varios nombres posibles (el CMS no tiene documentación pública).
const pick = (obj: Raw, ...keys: string[]): unknown => {
  for (const k of keys) {
    const v = k.split('.').reduce<unknown>((o, part) => (o && typeof o === 'object' ? (o as Raw)[part] : undefined), obj);
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
};

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// El contenido puede venir en HTML o en texto plano: el texto plano se convierte en párrafos.
const toHtml = (content: string) =>
  /<\/?(p|h[1-6]|ul|ol|li|br|img|a|strong|em|div|blockquote)\b/i.test(content)
    ? content
    : content
        .split(/\n{2,}/)
        .map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, '<br />')}</p>`)
        .join('\n');

// Quita scripts, iframes y atributos on* por si el contenido incluye HTML pegado de otras webs.
const sanitize = (html: string) =>
  html
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');

const absolute = (url: string, base: string) => {
  try {
    return new URL(url, base).href;
  } catch {
    return url;
  }
};

export function cmsLoader(): Loader {
  return {
    name: 'cms-noticias',
    load: async ({ store, logger, parseData, generateDigest }) => {
      const apiUrl = env.CMS_API_URL || 'https://cms.dragonrcnc.com/api/noticias';
      const apiKey = env.CMS_API_KEY;
      const origin = env.CMS_ORIGIN || 'dosambients.es';
      // Base para convertir rutas relativas de imágenes (/uploads/…) en URLs completas del CMS
      const assetsBase = /^https?:/.test(apiUrl) ? new URL(apiUrl).origin : 'https://cms.dragonrcnc.com';

      if (!apiKey) {
        logger.warn('CMS_API_KEY no está definida: se publica sin noticias del CMS.');
        store.clear();
        return;
      }

      let items: Raw[] = [];
      try {
        const res = await fetch(apiUrl, {
          headers: { 'X-API-KEY': apiKey, Origin: origin, Accept: 'application/json' },
          signal: AbortSignal.timeout(20000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as unknown;
        const list = Array.isArray(json) ? json : (pick(json as Raw, 'data', 'noticias', 'items', 'results') as unknown);
        items = Array.isArray(list) ? (list as Raw[]) : [];
      } catch (err) {
        // Si el CMS falla no rompemos el build: se mantienen las noticias que hubiera en caché.
        logger.warn(`No se han podido cargar las noticias del CMS (${(err as Error).message}).`);
        return;
      }

      store.clear();
      const used = new Set<string>();
      for (const item of items) {
        const title = String(pick(item, 'titulo', 'title', 'nombre', 'name') ?? '').trim();
        if (!title) continue;

        const published = pick(item, 'publicado', 'published', 'activo', 'active');
        const status = String(pick(item, 'estado', 'status') ?? '').toLowerCase();
        if (published === false || published === 0 || ['borrador', 'draft', 'oculto', 'hidden'].includes(status)) continue;

        const content = String(pick(item, 'contenido', 'content', 'cuerpo', 'body', 'texto', 'html') ?? '');
        const html = sanitize(toHtml(content));
        const summary = pick(item, 'resumen', 'descripcion', 'description', 'extracto', 'excerpt', 'entradilla');
        const description = String(summary ?? stripHtml(html)).slice(0, 220);
        const dateRaw = pick(item, 'fecha', 'fecha_publicacion', 'date', 'published_at', 'publishedAt', 'created_at', 'createdAt');
        const imageRaw = pick(item, 'imagen', 'imagen_url', 'image', 'image_url', 'imageUrl', 'portada', 'thumbnail', 'foto', 'imagen.url', 'image.url');

        let id = slugify(String(pick(item, 'slug', 'url_amigable') ?? title)) || `noticia-${String(pick(item, 'id', '_id') ?? used.size + 1)}`;
        while (used.has(id)) id = `${id}-${used.size}`;
        used.add(id);

        const data = await parseData({
          id,
          data: {
            title,
            description,
            date: dateRaw ? new Date(String(dateRaw)) : new Date(),
            image: typeof imageRaw === 'string' ? absolute(imageRaw, assetsBase) : undefined,
            imageAlt: title,
            draft: false,
          },
        });
        store.set({ id, data, rendered: { html }, digest: generateDigest(item) });
      }
      logger.info(`${used.size} noticia(s) cargada(s) del CMS.`);
    },
  };
}
