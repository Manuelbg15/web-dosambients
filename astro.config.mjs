// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.dosambients.es',
  build: { format: 'directory' },
  vite: {
    // Evita que Vite resuelva la carpeta del proyecto a otra ruta real (carpetas redirigidas
    // o enlazadas en Windows), lo que hacía que el CSS no se generase. Inofensivo en carpetas normales.
    resolve: { preserveSymlinks: true },
    // Cast: los tipos de Vite de @tailwindcss/vite y de Astro 5 no coinciden (no afecta al build).
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
