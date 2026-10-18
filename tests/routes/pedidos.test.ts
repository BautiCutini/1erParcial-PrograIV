import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express, { type NextFunction, type Request, type Response } from 'express';
import { crearPedidosRouter } from '../../src/routes/pedidos';
import { PedidoService, ValidacionError, PedidoNoEncontradoError } from '../../src/models/pedido';
import { Producto } from '../../src/models/producto';

class ProductoTest extends Producto {
  readonly id: string;
  readonly nombre: string;
  readonly precioBase: number;

  constructor(id: string, nombre: string, precio: number) {
    super();
    this.id = id;
    this.nombre = nombre;
    this.precioBase = precio;
  }

  calcularPrecio(): number {
    return this.precioBase;
  }
}

const PRODUCTO_MOCK = new ProductoTest('cafe-001', 'Café Express', 150);


function crearApp() {
  const buscarProducto = (id: string) =>
    id === PRODUCTO_MOCK.id ? PRODUCTO_MOCK : undefined;
  const pedidoService = new PedidoService(buscarProducto);
  const app = express();
  app.use(express.json());
  app.use('/pedidos', crearPedidosRouter(pedidoService));

  // Mismo manejo de errores que app.ts
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ValidacionError) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (err instanceof PedidoNoEncontradoError) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  });

  return app;
}


describe('POST /pedidos', () => {
  it('devuelve 201 con el pedido creado y el total calculado', async () => {
    const res = await request(crearApp())
      .post('/pedidos')
      .send({ productoId: 'cafe-001', cantidad: 3 });

    expect(res.status).toBe(201);
    expect(res.body.productoId).toBe('cafe-001');
    expect(res.body.cantidad).toBe(3);
    expect(res.body.total).toBe(450); // 150 * 3
    expect(res.body.id).toBeDefined();
  });

  it('devuelve 400 si falta productoId', async () => {
    const res = await request(crearApp())
      .post('/pedidos')
      .send({ cantidad: 2 });
    expect(res.status).toBe(400);
  });

  it('devuelve 400 si falta cantidad', async () => {
    const res = await request(crearApp())
      .post('/pedidos')
      .send({ productoId: 'cafe-001' });
    expect(res.status).toBe(400);
  });

  it('devuelve 400 si el producto no existe', async () => {
    const res = await request(crearApp())
      .post('/pedidos')
      .send({ productoId: 'no-existe', cantidad: 1 });
    expect(res.status).toBe(400);
  });

  it('devuelve 400 si cantidad es 0 o negativa', async () => {
    const res = await request(crearApp())
      .post('/pedidos')
      .send({ productoId: 'cafe-001', cantidad: 0 });
    expect(res.status).toBe(400);
  });

  it('devuelve 400 si cantidad no es un entero', async () => {
    const res = await request(crearApp())
      .post('/pedidos')
      .send({ productoId: 'cafe-001', cantidad: 1.5 });
    expect(res.status).toBe(400);
  });
});


describe('GET /pedidos', () => {
  it('devuelve 200 con lista vacía si no hay pedidos', async () => {
    const res = await request(crearApp()).get('/pedidos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('devuelve 200 con todos los pedidos creados', async () => {
    const app = crearApp();
    await request(app).post('/pedidos').send({ productoId: 'cafe-001', cantidad: 1 });
    await request(app).post('/pedidos').send({ productoId: 'cafe-001', cantidad: 2 });

    const res = await request(app).get('/pedidos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});


describe('GET /pedidos/:id', () => {
  it('devuelve 200 con el pedido si existe', async () => {
    const app = crearApp();
    const created = await request(app)
      .post('/pedidos')
      .send({ productoId: 'cafe-001', cantidad: 2 });

    const res = await request(app).get(`/pedidos/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
  });

  it('devuelve 404 si el pedido no existe', async () => {
    const res = await request(crearApp()).get('/pedidos/999');
    expect(res.status).toBe(404);
  });
});