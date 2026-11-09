import type { Producto } from '../schemas/producto';

export const cafeBrasilPocillo = {
  id: 'expreso-pocillo-brasil',
  tipo: 'expreso',
  nombre: 'Expreso',
  precio: 5020,
  tamanio: 'pocillo',
  gramosCafe: 18,
  variedad: {
    nombre: 'Brasil',
    descripcion: 'Acidez baja, cuerpo intenso y notas a chocolate y frutos secos',
  },
} satisfies Producto;

export const cafeColombiaPocillo = {
  id: 'expreso-pocillo-colombia',
  tipo: 'expreso',
  nombre: 'Expreso',
  precio: 5740,
  tamanio: 'pocillo',
  gramosCafe: 18,
  variedad: { nombre: 'Colombia', descripcion: 'Acidez media, cuerpo equilibrado' },
} satisfies Producto;

export const cafeEtiopiaPocillo = {
  id: 'expreso-pocillo-etiopia',
  tipo: 'expreso',
  nombre: 'Expreso',
  precio: 6820,
  tamanio: 'pocillo',
  gramosCafe: 18,
  variedad: { nombre: 'Etiopia', descripcion: 'Acidez alta, cuerpo ligero' },
} satisfies Producto;

export const filtradoBrasilPocillo = {
  id: 'filtrado-pocillo-brasil',
  tipo: 'filtrado',
  nombre: 'Filtrado',
  precio: 4040,
  tamanio: 'pocillo',
  gramosCafe: 6,
  variedad: { nombre: 'Brasil', descripcion: 'Acidez baja, cuerpo intenso' },
} satisfies Producto;

export const muffinChocolate = {
  id: 'muffin-de-chocolate',
  tipo: 'pasteleria',
  nombre: 'Muffin de chocolate',
  precio: 2500,
} satisfies Producto;

export const tortaSelvaNegra = {
  id: 'torta-selva-negra',
  tipo: 'pasteleria',
  nombre: 'Torta selva negra',
  precio: 4200,
} satisfies Producto;

export const catalogoPrueba: Producto[] = [
  cafeBrasilPocillo,
  cafeColombiaPocillo,
  cafeEtiopiaPocillo,
  filtradoBrasilPocillo,
  muffinChocolate,
  tortaSelvaNegra,
];

