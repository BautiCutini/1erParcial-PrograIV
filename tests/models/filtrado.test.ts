import { describe, it, expect } from 'vitest';
import { Filtrado } from '../../src/models/filtrado';

describe('Filtrado', () => {
  it('calcula 4040 para un pocillo de Brasil', () => {

    const filtrado = new Filtrado('Brasil', 'pocillo');

    const precio = filtrado.calcularPrecio();
    expect(precio).toBe(4040);
  });

  it('tiene id y nombre', () => {
  const filtrado = new Filtrado('Colombia', 'mediano');

  expect(filtrado.id).toBe('filtrado-mediano-colombia');
  expect(filtrado.nombre).toBe('Filtrado');
  });

});