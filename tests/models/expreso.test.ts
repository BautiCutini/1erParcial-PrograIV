import { describe, it, expect } from 'vitest';
import { Expreso } from '../../src/models/expreso';

describe('Expreso', () => {
  it('calcula 5020 para un pocillo de Brasil', () => {

    const expreso = new Expreso('Brasil', 'pocillo');

    const precio = expreso.calcularPrecio();
    expect(precio).toBe(5020);
  });

  it('tiene id y nombre', () => {
  const expreso = new Expreso('Brasil', 'pocillo');

  expect(expreso.id).toBe('expreso-pocillo-brasil');
  expect(expreso.nombre).toBe('Expreso');
});

it('arma un id distinto según tamaño y variedad', () => {
  const expreso = new Expreso('Etiopia', 'taza grande');

  expect(expreso.id).toBe('expreso-taza-grande-etiopia');
});

});