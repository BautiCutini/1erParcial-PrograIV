import { describe, it, expect } from 'vitest';
import { buscarCafe, preciosPorOrigen, ETIQUETAS_ORIGEN, ETIQUETAS_TAMANIO } from '../utils/catalogo';
import { catalogoPrueba } from './fixtures';

describe('buscarCafe', () => {
  it('devuelve el café que coincide con tipo, tamaño y origen', () => {
    const cafe = buscarCafe(catalogoPrueba, 'expreso', 'pocillo', 'Colombia');

    expect(cafe?.precio).toBe(5740);
    expect(cafe?.variedad.nombre).toBe('Colombia');
  });

  it('distingue el filtrado del expreso', () => {
    const cafe = buscarCafe(catalogoPrueba, 'filtrado', 'pocillo', 'Brasil');

    expect(cafe?.tipo).toBe('filtrado');
    expect(cafe?.precio).toBe(4040);
  });

  it('devuelve undefined si la combinación no existe', () => {
    expect(buscarCafe(catalogoPrueba, 'filtrado', 'mediano', 'Brasil')).toBeUndefined();
  });
});

describe('preciosPorOrigen', () => {
  it('devuelve el precio de cada origen para una bebida y tamaño', () => {
    expect(preciosPorOrigen(catalogoPrueba, 'expreso', 'pocillo')).toEqual({
      Brasil: 5020,
      Colombia: 5740,
      Etiopia: 6820,
    });
  });

  it('devuelve un objeto vacío si no hay cafés para esa combinación', () => {
    expect(preciosPorOrigen(catalogoPrueba, 'filtrado', 'taza grande')).toEqual({});
  });
});

describe('etiquetas', () => {
  it('muestra Etiopía con tilde y Taza grande con mayúscula', () => {
    expect(ETIQUETAS_ORIGEN.Etiopia).toBe('Etiopía');
    expect(ETIQUETAS_TAMANIO['taza grande']).toBe('Taza grande');
  });
});