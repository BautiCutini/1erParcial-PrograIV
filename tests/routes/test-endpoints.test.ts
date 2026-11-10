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

describe('POST /_test/seed', () => {
  it('carga los pedidos de ejemplo', async () => {
    const res = await request(app).post('/_test/seed');
    const lista = await request(app).get('/pedidos');

    expect(res.status).toBe(201);
    expect(res.body).toHaveLength(3);
    expect(lista.body).toHaveLength(3);
    expect(res.body[0].id).toBe(1);
  });

  it('es repetible: no duplica pedidos', async () => {
    await request(app).post('/_test/seed');
    await request(app).post('/_test/seed');

    const lista = await request(app).get('/pedidos');
    expect(lista.body).toHaveLength(3);
  });

  it('acepta pedidos propios en el body', async () => {
    const res = await request(app)
      .post('/_test/seed')
      .send({ pedidos: [{ mesaId: 9, items: [{ productoId: 'torta-selva-negra', cantidad: 2 }] }] });

    expect(res.status).toBe(201);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].mesaId).toBe(9);
    expect(res.body[0].total).toBe(8400);
  });

  it('devuelve 400 y no deja datos a medias si un pedido es invalido', async () => {
    const res = await request(app)
      .post('/_test/seed')
      .send({ pedidos: [{ items: [{ productoId: 'inventado', cantidad: 1 }] }] });
    const lista = await request(app).get('/pedidos');

    expect(res.status).toBe(400);
    expect(lista.body).toEqual([]);
  });
});

describe('POST /pedidos con mesaId', () => {
  it('devuelve 201 e incluye el mesaId', async () => {
    const res = await request(app)
      .post('/pedidos')
      .send({ mesaId: 4, items: [{ productoId: 'muffin-de-chocolate', cantidad: 1 }] });

    expect(res.status).toBe(201);
    expect(res.body.mesaId).toBe(4);
  });

  it('devuelve 400 si el mesaId es invalido', async () => {
    const res = await request(app)
      .post('/pedidos')
      .send({ mesaId: 0, items: [{ productoId: 'muffin-de-chocolate', cantidad: 1 }] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('mesaId debe ser mayor a 0');
  });
});