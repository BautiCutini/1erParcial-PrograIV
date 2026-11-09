import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Errores de la API', () => {
  it('una ruta inexistente responde 404 con { error }', async () => {
    const res = await request(app).get('/ruta-inexistente');

    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  it('un JSON mal formado responde 400 con { error }, no 500', async () => {
    const res = await request(app)
      .post('/pedidos')
      .set('Content-Type', 'application/json')
      .send('{"items": [');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  it('un producto inexistente responde 404 con { error }', async () => {
    const res = await request(app).get('/productos/no-existe');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: expect.any(String) });
  });
});