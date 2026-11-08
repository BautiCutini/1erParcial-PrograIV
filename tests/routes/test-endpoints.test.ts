import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

beforeEach(async () => {
  await request(app).post('/_test/reset');
});

describe('POST /_test/reset', () => {
  it('responde 204 y deja la lista de pedidos vacia', async () => {
    await request(app)
      .post('/pedidos')
      .send({ items: [{ productoId: 'muffin-de-chocolate', cantidad: 1 }] });

    const reset = await request(app).post('/_test/reset');
    const lista = await request(app).get('/pedidos');

    expect(reset.status).toBe(204);
    expect(lista.body).toEqual([]);
  });
});