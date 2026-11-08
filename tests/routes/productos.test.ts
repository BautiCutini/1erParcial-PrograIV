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