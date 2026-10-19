// Galerías: trabajos reales de Dos Ambients (fotos de octubre 2026) y catálogo.
// Imágenes en public/images/disenos/ (originales en material/fotos-nuevas-2026-10/).
export type Category = 'cocina' | 'bano' | 'armarios' | 'muebles';

export const categories: { id: Category; label: string }[] = [
  { id: 'cocina', label: 'Cocinas' },
  { id: 'bano', label: 'Baños' },
  { id: 'armarios', label: 'Armarios' },
  { id: 'muebles', label: 'Muebles a medida' },
];

type Design = {
  id: string;
  category: Category;
  title: string;
  /** Descripción de lo que se ve en la foto (también se usa como texto alternativo) */
  text: string;
  /** Vídeo en public/videos/ (si el trabajo es un vídeo en lugar de una foto) */
  video?: string;
};

const designList: Design[] = [
  { id: 'cocina-01', category: 'cocina', title: 'Cocina', text: 'Cocina en madera con isla y encimera efecto mármol' },
  { id: 'bano-01', category: 'bano', title: 'Baño', text: 'Baño con mueble suspendido granate y espejo retroiluminado' },
  { id: 'armario-01', category: 'armarios', title: 'Armario', text: 'Armario a medida sin tiradores con uñero de madera' },
  { id: 'cocina-03', category: 'cocina', title: 'Cocina', text: 'Cocina con isla, frentes blancos y madera' },
  { id: 'libreria', category: 'muebles', title: 'Librería', text: 'Librería blanca hecha a medida', video: '/videos/libreria-a-medida.mp4' },
  { id: 'bano-03', category: 'bano', title: 'Baño', text: 'Baño con pared de piedra y lavabo de piedra natural' },
  { id: 'cocina-02', category: 'cocina', title: 'Cocina', text: 'Cocina en madera con isla y lámparas colgantes' },
  { id: 'cocina-10', category: 'cocina', title: 'Cocina', text: 'Cocina rústica en madera con isla y fregadero de mármol' },
  { id: 'bano-02', category: 'bano', title: 'Baño', text: 'Baño con mueble azul, mampara negra y radiador toallero' },
  { id: 'armario-02', category: 'armarios', title: 'Armario', text: 'Armario empotrado blanco con puertas y cajones' },
  { id: 'cocina-04', category: 'cocina', title: 'Cocina', text: 'Cocina con isla, columnas de hornos y frentes de madera' },
  { id: 'cocina-05', category: 'cocina', title: 'Cocina', text: 'Cocina con isla y frentes lisos sin tiradores' },
  { id: 'bano-04', category: 'bano', title: 'Baño', text: 'Baño rústico con pared de piedra y mueble azul' },
  { id: 'cocina-11', category: 'cocina', title: 'Cocina', text: 'Cocina en madera con campana integrada y ventana' },
  { id: 'cocina-06', category: 'cocina', title: 'Cocina', text: 'Cocina en madera con península y encimera blanca' },
  { id: 'armario-03', category: 'armarios', title: 'Armario', text: 'Armario a medida gris con tiradores negros' },
  { id: 'bano-07', category: 'bano', title: 'Baño', text: 'Ducha con pared de piedra y hornacina iluminada' },
  { id: 'cocina-07', category: 'cocina', title: 'Cocina', text: 'Cocina abierta con isla y frentes de madera' },
  { id: 'cocina-12', category: 'cocina', title: 'Cocina', text: 'Cocina en madera con fregadero de mármol bajo la ventana' },
  { id: 'bano-05', category: 'bano', title: 'Baño', text: 'Ducha a ras de suelo con pared de piedra' },
  { id: 'cocina-08', category: 'cocina', title: 'Cocina', text: 'Cocina blanca con isla y electrodomésticos integrados' },
  { id: 'armario-04', category: 'armarios', title: 'Armario', text: 'Armario blanco con puertas de cristal en aspa' },
  { id: 'cocina-14', category: 'cocina', title: 'Cocina', text: 'Cocina blanca con península y barra' },
  { id: 'bano-06', category: 'bano', title: 'Baño', text: 'Baño con bañera y pared de piedra' },
  { id: 'cocina-09', category: 'cocina', title: 'Cocina', text: 'Cocina en madera con península negra' },
  { id: 'bano-08', category: 'bano', title: 'Baño', text: 'Baño con mueble de madera y espejo iluminado' },
  { id: 'cocina-13', category: 'cocina', title: 'Cocina', text: 'Cocina con isla junto a pared de piedra' },
  { id: 'bano-09', category: 'bano', title: 'Baño', text: 'Baño con encimera de madera y lavabo sobre encimera' },
  { id: 'cocina-15', category: 'cocina', title: 'Cocina', text: 'Cocina blanca en U sin tiradores' },
  { id: 'bano-10', category: 'bano', title: 'Baño', text: 'Mueble de baño suspendido en dos alturas' },
];

export const designs = designList.map((d) => ({
  ...d,
  src: d.video ?? `/images/disenos/${d.id}.webp`,
  thumb: `/images/disenos/thumb/${d.id}.webp`,
  alt: `${d.text}, trabajo de Dos Ambients`,
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
