# web-dosambients

Web de **Dos Ambients** (cocinas, baños, armarios y muebles a medida, Castellón). Dominio: https://www.dosambients.es

## Stack
- Astro 5 + Tailwind CSS 4 vía `@tailwindcss/vite`. **Sin otros frameworks** (nada de React/Vue/jQuery). JS solo en `<script>` nativos.
- `package.json` → `"name": "web-dosambients"`.
- `astro.config.mjs` → `site: 'https://www.dosambients.es'`, `build.format: 'directory'` (URLs con barra final: `/contacto/`).
- Idioma: **castellano** (`<html lang="es">`).

## Comandos
- `npm run dev` — servidor local (http://localhost:4321)
- `npm run build` — genera `dist/`
- `npm run check` — comprobación de tipos (`astro check`)
- `node material/scripts/check-links.mjs` — tras el build, busca enlaces e imágenes internos rotos en `dist/` (solo en local; `material/` no está en git)

## Estructura
- `src/layouts/Layout.astro` — HTML base, SEO, Open Graph, JSON-LD, fuentes. `LegalLayout.astro` para páginas legales.
- `src/components/Header.astro` — cabecera **fija**; menú de escritorio solo desde `2xl` (≥1536 px), **hamburguesa por debajo de 1536 px**.
- `src/components/Footer.astro`, `Gallery.astro` (filtro + lightbox), `PageHero.astro`, `ContactCta.astro`, `ContactForm.astro`, `Icon.astro`, `SocialIcon.astro`, `LegalHolder.astro`.
- `src/data/site.ts` — datos de la empresa, menú y enlaces legales (fuente única: no repetir teléfonos/direcciones en las páginas).
- `src/data/links.ts` — **todos los enlaces externos**. Los pendientes llevan `pending: true` + TODO y no se muestran hasta completarlos.
- `src/data/gallery.ts` — fotos de "Nuestros diseños" (con categoría) y del catálogo.
- `src/data/services.ts`, `src/data/ambientes.ts` (selector "Elige tu ambiente" e imágenes del hero), `src/data/news.ts`.
- `src/content.config.ts` + `src/content/actualitat/*.md` — **noticias** (colección de contenido). Frontmatter: `title`, `description`, `date`, `image?`, `imageAlt?`, `draft`. El nombre del archivo es el slug (`/actualidad/<archivo>/`). `draft: true` no se publica.
- `src/pages/` — `index`, `quienes-somos`, `disenos`, `catalogo`, `actualidad/`, `contacto`, `gracias`, `aviso-legal`, `politica-privacidad`, `politica-cookies`, `404`, `sitemap.xml.ts`.

## Diseño
- Paleta en `src/styles/global.css` (`@theme`): `brand-*` (granate #ab2a3e = `brand-500`), `ink` #1b1313, `muted` #676767, `line` #e0e0e0, `cream` #f3f3f3.
- Tipografías: Cairo (texto), Josefin Sans (títulos, `font-display`) y Kaushan Script (acento manuscrito, clase `script`), desde Google Fonts.
- Clases propias: `container-site`, `btn` + `btn-primary`/`btn-outline`, `eyebrow`, `display-xl`, `display-lg`, `script`, `outline-num`, `grain`, `section-title`, `prose-site`, `todo`.
- Logo en dos versiones: `logo-dosambients.webp` (granate) y `logo-dosambients-blanco.webp` (para fondos oscuros).

## Animaciones y transiciones
- **View Transitions** (`<ClientRouter />` en `Layout.astro`): navegar no recarga la página. Todo script de componente debe inicializarse dentro de `document.addEventListener('astro:page-load', …)`, nunca a nivel superior.
- `src/scripts/motion.ts`: aparición al hacer scroll, contadores, cabecera y parallax.
  - `data-reveal` (`""`, `left`, `right`, `zoom`, `clip`) + `style="--d:200"` para retrasar en ms.
  - `data-count="24"` → contador animado.
  - `data-parallax="0.12"` → parallax (la imagen debe estar dentro de un contenedor con `overflow-hidden`).
- `SplitText.astro`: títulos que aparecen palabra a palabra; las palabras entre `*asteriscos*` van en la letra manuscrita (Kaushan Script).
- `Layout` con `overlay` (por defecto `true`): la cabecera es transparente sobre la imagen del hero y se vuelve sólida al hacer scroll. Las páginas sin hero oscuro usan `overlay={false}`.
- Componentes visuales: `PageHero` (Ken Burns), `Marquee`, `BigCta`, `WhatsAppFloat`, `Gallery` (masonry + filtro + lightbox).
- Se respeta `prefers-reduced-motion`: sin animaciones para quien las tenga desactivadas.

## Formularios (hosting Hostalia)
- Se envían con PHP: `public/send-mail.php` (y similares si se añaden más formularios).
- Remitente `web@dosambients.es`, destino `info@dosambients.es`, `Reply-To` del usuario.
- Antispam: campo oculto `website` (honeypot). Si llega relleno, se finge éxito y no se envía.
- Éxito → `/gracias/`; error → `/contacto/?error=1`.
- PHP no funciona en `npm run dev`: probar el envío en el hosting.

## Imágenes y documentos
- Imágenes optimizadas en `public/images/` en **WebP o JPG, máx. 1920 px** de ancho (miniaturas de 640 px en `thumb/`).
- **Nunca HEIF/HEIC ni PDF como imagen**: convertirlos antes.
- PDFs descargables en `public/documents/`, nombres **sin espacios** (minúsculas y guiones).
- Los originales sin procesar van en `material/` (ignorado por git). Script de conversión: `material/scripts/process-images.mjs` (usa `sharp`).

## Despliegue
- `.github/workflows/deploy.yml` (mismo esquema que el resto de webs, p. ej. `espanyolfutsal-web`): en cada push a `main` (o a mano con `workflow_dispatch`) hace `npm ci` + `npm run build` y sube `dist/` por FTP con `lftp mirror -R --delete`.
- Repositorio: https://github.com/Manuelbg15/web-dosambients (público: nunca subir contraseñas ni datos privados).
- Secrets del repo: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` (los mismos de la suscripción de Hostalia que usan las otras webs) y `FTP_REMOTE_DIR` = `/dosambients.es` (la carpeta del dominio en Plesk, **no** `httpdocs`, que es de otra web).
- `--delete` excluye `.user.ini` (PHP del hosting) y `.well-known/` (certificado SSL): no quitar esas exclusiones.
- **No hacer commit/push ni lanzar el workflow sin permiso explícito**: cada push a `main` publica la web.
- Hosting: Hostalia (Plesk), IP 82.194.68.115. SSL: certificado DigiCert de Hostalia (se renueva solo).
- `public/.htaccess`: fuerza HTTPS + www, 404 personalizada y redirecciones 301 desde las URLs `.php` de la web antigua.

## Contenido
- **No inventar datos.** Si falta algo, dejar un `TODO` visible en el código (y, si se muestra, con la clase `todo`) y avisar.
- Datos legales de la empresa en `src/data/site.ts` → `legal`. El horario de apertura no se publica (`openingHours` vacío).
- Cookies: la web no instala cookies propias; el mapa de Google se carga solo tras clic. Si se añade analítica, hará falta banner de consentimiento y actualizar `politica-cookies`.
