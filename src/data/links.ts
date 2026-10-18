// Enlaces externos centralizados.
// Los pendientes llevan `pending: true` y un TODO; los componentes no los
// muestran hasta que se rellene la URL y se quite `pending`.
export type ExternalLink = { url: string; pending?: boolean; note?: string };

export const links = {
  facebook: {
    url: 'https://www.facebook.com/Dosambients-648117008687679/',
  },
  instagram: {
    url: 'https://www.instagram.com/dosambients/',
  },
  googleBusiness: {
    url: '',
    pending: true,
    note: 'TODO: ficha de Google Business (reseñas)',
  },
  whatsapp: { url: 'https://wa.me/34623232083' },
  googleMaps: {
    url: 'https://www.google.com/maps/search/?api=1&query=39.994127%2C-0.0335108',
  },
  googleMapsEmbed: {
    url: 'https://maps.google.com/maps?q=39.994127,-0.0335108&z=17&output=embed',
  },
} satisfies Record<string, ExternalLink>;

export const isActive = (l: ExternalLink) => !l.pending && l.url !== '';
