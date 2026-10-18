// Datos de la empresa extraídos de la web original (www.dosambients.es).
// Los campos marcados con TODO no aparecen en la web original.
export const site = {
  name: 'Dos Ambients',
  domain: 'www.dosambients.es',
  url: 'https://www.dosambients.es',
  description:
    'Dos Ambients, en Castellón de la Plana desde el año 2000. Cocinas, baños, armarios y muebles a medida, suelo y carpintería en general.',
  slogan: '¡Transformamos casas en hogares!',
  email: 'info@dosambients.es',
  phone: '964 22 38 64',
  phoneHref: 'tel:+34964223864',
  mobile: '623 232 083',
  address: {
    street: 'C/ Mª Rosa Molas, 15',
    note: 'Esquina Camino La Plana (rotonda de las cañas)',
    postalCode: '12004',
    city: 'Castellón de la Plana',
    province: 'Castellón',
  },
  geo: { lat: 39.994127, lng: -0.0335108 },
  foundedYear: 2000,
  // TODO: razón social, CIF y datos registrales (no aparecen en la web original).
  legal: {
    companyName: '',
    cif: '',
    registry: '',
  },
  // TODO: horario de apertura (no aparece en la web original).
  openingHours: '',
};

export const nav = [
  { label: 'Inicio', href: '/' },
  { label: 'Quiénes somos', href: '/quienes-somos/' },
  { label: 'Nuestros diseños', href: '/disenos/' },
  { label: 'Catálogo', href: '/catalogo/' },
  { label: 'Actualidad', href: '/actualidad/' },
  { label: 'Contacto', href: '/contacto/' },
];

export const legalNav = [
  { label: 'Aviso legal', href: '/aviso-legal/' },
  { label: 'Política de privacidad', href: '/politica-privacidad/' },
  { label: 'Política de cookies', href: '/politica-cookies/' },
];
