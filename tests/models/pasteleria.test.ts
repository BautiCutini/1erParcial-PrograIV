import { describe, it, expect } from 'vitest';
import { Pasteleria } from '../../src/models/pasteleria';

// [nombre, precioBase, id esperado], tomados de la tabla del PDF
const productos: [string, number, string][] = [
  ['Muffin de chocolate', 2500, 'muffin-de-chocolate'],
  ['Torta selva negra', 4200, 'torta-selva-negra'],
];

describe('Pasteleria', () => {
  it.each(productos)('%s: calcularPrecio devuelve el precioBase (%i)', (nombre, precioBase) => {
    const producto = new Pasteleria(nombre, precioBase);

    expect(producto.calcularPrecio()).toBe(precioBase);
  });

  it.each(productos)('%s: expone su nombre y su precioBase', (nombre, precioBase) => {
    const producto = new Pasteleria(nombre, precioBase);

    expect(producto.nombre).toBe(nombre);
    expect(producto.precioBase).toBe(precioBase);
  });

  it.each(productos)('%s: arma el id en minúsculas y con guiones', (nombre, precioBase, idEsperado) => {
    const producto = new Pasteleria(nombre, precioBase);

    expect(producto.id).toBe(idEsperado);
  });
});