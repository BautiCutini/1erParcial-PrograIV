import { describe, it, expect } from 'vitest';
import { Expreso } from '../../src/models/expreso';

describe('Expreso', () => {
  it('calcula 5020 para un pocillo de Brasil', () => {

    const expreso = new Expreso('Brasil', 'pocillo');

    const precio = expreso.calcularPrecio();
    expect(precio).toBe(5020);
  });
});