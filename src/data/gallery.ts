// Galerías con las fotos de la web original, procesadas en public/images/.
export type Category = 'cocina' | 'bano' | 'armarios';

export const categories: { id: Category; label: string }[] = [
  { id: 'cocina', label: 'Cocinas' },
  { id: 'bano', label: 'Baños' },
  { id: 'armarios', label: 'Armarios' },
];

type Design = { id: string; category: Category; title: string; text: string };

const designList: Design[] = [
  { id: 'c0', category: 'cocina', title: 'Cocina lacada', text: 'Cocina lacada clásica con encimera y frontal de Silestone' },
  { id: 'c1', category: 'cocina', title: 'Cocina', text: 'Diseño a medida' },
  { id: 'b0', category: 'bano', title: 'Baño', text: 'Diseño a medida' },
  { id: 'b1', category: 'bano', title: 'Baño', text: 'Diseño a medida' },
  { id: 'a0', category: 'armarios', title: 'Armario', text: 'Diseño a medida' },
  { id: 'a1', category: 'armarios', title: 'Armario', text: 'Diseño a medida' },
  { id: 'c2', category: 'cocina', title: 'Cocina', text: 'Diseño a medida' },
  { id: 'c3', category: 'cocina', title: 'Cocina', text: 'Diseño a medida' },
  { id: 'b2', category: 'bano', title: 'Baño', text: 'Diseño a medida' },
  { id: 'b3', category: 'bano', title: 'Baño', text: 'Diseño a medida' },
  { id: 'a2', category: 'armarios', title: 'Armario', text: 'Diseño a medida' },
  { id: 'a3', category: 'armarios', title: 'Armario', text: 'Diseño a medida' },
  { id: 'a7', category: 'armarios', title: 'Armario', text: 'Diseño a medida' },
  { id: 'a8', category: 'armarios', title: 'Armario', text: 'Diseño a medida' },
];

export const designs = designList.map((d) => ({
  ...d,
  src: `/images/disenos/${d.id}.webp`,
  thumb: `/images/disenos/thumb/${d.id}.webp`,
  alt: `${d.title}: ${d.text.toLowerCase()}, realizado por Dos Ambients`,
}));

export const catalog = Array.from({ length: 28 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    id: `catalogo-${n}`,
    src: `/images/catalogo/catalogo-${n}.webp`,
    thumb: `/images/catalogo/thumb/catalogo-${n}.webp`,
    alt: `Catálogo Dos Ambients, imagen ${i + 1}`,
  };
});
