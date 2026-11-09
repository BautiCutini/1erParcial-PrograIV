import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('GET /productos', () => {
  it('devuelve el tipo y el precio de cada producto', async () => {
    const res = await request(app).get('/productos');

    expect(res.status).toBe(200);

    const buscar = (id: string) => res.body.find((p: { id: string }) => p.id === id);

    expect(buscar('expreso-mediano-colombia')).toMatchObject({ tipo: 'expreso', precio: 7360 });
    expect(buscar('filtrado-pocillo-brasil')).toMatchObject({ tipo: 'filtrado', precio: 4040 });
    expect(buscar('muffin-de-chocolate')).toMatchObject({ tipo: 'pasteleria', precio: 2500 });
  });
});

describe('GET /productos: datos de cada producto', () => {
  it('lista los 20 productos del catálogo', async () => {
    const res = await request(app).get('/productos');

    expect(res.body).toHaveLength(20);
  });

  it('devuelve tamaño, gramos y variedad con su descripción para un café', async () => {
    const res = await request(app).get('/productos/expreso-mediano-colombia');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 'expreso-mediano-colombia',
      tipo: 'expreso',
      nombre: 'Expreso',
      tamanio: 'mediano',
      gramosCafe: 27,
      variedad: {
        nombre: 'Colombia',
        descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
      },
      precio: 7360,
    });
  });

  it('cada café trae la descripción de su origen', async () => {
    const res = await request(app).get('/productos');
    const cafes = res.body.filter((p: { tipo: string }) => p.tipo !== 'pasteleria');

    expect(cafes).toHaveLength(18);
    for (const cafe of cafes) {
      expect(typeof cafe.variedad.descripcion).toBe('string');
      expect(cafe.variedad.descripcion.length).toBeGreaterThan(0);
    }
  });

  it('la pastelería no trae datos de café', async () => {
    const res = await request(app).get('/productos/muffin-de-chocolate');

    expect(res.body).toEqual({
      id: 'muffin-de-chocolate',
      tipo: 'pasteleria',
      nombre: 'Muffin de chocolate',
      precio: 2500,
    });
  });
});