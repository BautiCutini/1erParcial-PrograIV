import { describe, it, expect } from 'vitest';
import { formatearPrecio } from '../utils/formatearPrecio';

const normalizar = (texto: string) => texto.replace(/\u00a0/g, ' ');

describe('formatearPrecio', () => {
  it('formatea con signo $, punto de miles y sin decimales', () => {
    expect(normalizar(formatearPrecio(5020))).toBe('$ 5.020');
  });

  it('formatea precios de cinco cifras', () => {
    expect(normalizar(formatearPrecio(11140))).toBe('$ 11.140');
  });

  it('formatea precios de cuatro cifras sin separar de más', () => {
    expect(normalizar(formatearPrecio(2500))).toBe('$ 2.500');
  });
});