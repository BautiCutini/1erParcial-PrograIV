import { describe, it, expect } from 'vitest';
import { generarId } from '../../src/utils/generar-id';

describe('generarId', () => {
  it('pasa a minúsculas y cambia los espacios por guiones', () => {
    expect(generarId('Muffin de chocolate')).toBe('muffin-de-chocolate');
  });

  it('une varias partes con guiones', () => {
    expect(generarId('Expreso', 'taza grande', 'Etiopia')).toBe('expreso-taza-grande-etiopia');
  });
});