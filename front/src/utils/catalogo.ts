import type { Producto } from '../schemas/producto';

export type Cafe = Exclude<Producto, { tipo: 'pasteleria' }>;
export type Pasteleria = Extract<Producto, { tipo: 'pasteleria' }>;
export type TipoCafe = Cafe['tipo'];
export type Tamanio = Cafe['tamanio'];
export type Origen = Cafe['variedad']['nombre'];

export const TIPOS: TipoCafe[] = ['expreso', 'filtrado'];
export const TAMANIOS: Tamanio[] = ['pocillo', 'mediano', 'taza grande'];
export const ORIGENES: Origen[] = ['Brasil', 'Colombia', 'Etiopia'];

export const ETIQUETAS_TIPO: Record<TipoCafe, string> = {
  expreso: 'Expreso',
  filtrado: 'Filtrado',
};
export const ETIQUETAS_TAMANIO: Record<Tamanio, string> = {
  pocillo: 'Pocillo',
  mediano: 'Mediano',
  'taza grande': 'Taza grande',
};
export const ETIQUETAS_ORIGEN: Record<Origen, string> = {
  Brasil: 'Brasil',
  Colombia: 'Colombia',
  Etiopia: 'Etiopía',
};

export const esCafe = (producto: Producto): producto is Cafe => producto.tipo !== 'pasteleria';

export const esPasteleria = (producto: Producto): producto is Pasteleria =>
  producto.tipo === 'pasteleria';

export const buscarCafe = (
  productos: Producto[],
  tipo: TipoCafe,
  tamanio: Tamanio,
  origen: Origen,
): Cafe | undefined =>
  productos
    .filter(esCafe)
    .find((c) => c.tipo === tipo && c.tamanio === tamanio && c.variedad.nombre === origen);

export const preciosPorOrigen = (
  productos: Producto[],
  tipo: TipoCafe,
  tamanio: Tamanio,
): Partial<Record<Origen, number>> => {
  const precios: Partial<Record<Origen, number>> = {};
  for (const cafe of productos.filter(esCafe)) {
    if (cafe.tipo === tipo && cafe.tamanio === tamanio) {
      precios[cafe.variedad.nombre] = cafe.precio;
    }
  }
  return precios;
};