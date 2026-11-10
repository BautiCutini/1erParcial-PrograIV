import { describe, it, expect } from 'vitest';
import { ProductoSchema } from '../schemas/producto';
import { cafeBrasilPocillo, muffinChocolate } from './fixtures';

describe('ProductoSchema', () => {
  it('acepta un café completo y conserva tipo, tamaño, gramos y variedad', () => {
    expect(ProductoSchema.parse(cafeBrasilPocillo)).toEqual(cafeBrasilPocillo);
  });

  it('acepta un pastel y conserva su tipo', () => {
    expect(ProductoSchema.parse(muffinChocolate)).toEqual(muffinChocolate);
  });

  it('rechaza un café al que le falta el tamaño', () => {
    const resultado = ProductoSchema.safeParse({ ...cafeBrasilPocillo, tamanio: undefined });

    expect(resultado.success).toBe(false);
  });

  it('rechaza un producto con un tipo desconocido', () => {
    const resultado = ProductoSchema.safeParse({ ...cafeBrasilPocillo, tipo: 'te' });

    expect(resultado.success).toBe(false);
  });
});