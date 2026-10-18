import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { crearCatalogo } from '../../src/models/catalogo';
import { PedidoService } from '../../src/models/pedido';
import { crearPedidosRouter } from '../../src/routes/pedidos';
import { crearReportesRouter } from '../../src/routes/reportes';
import { ReportesService } from '../../src/services/reportes';


function crearApp() {
  const catalogo = crearCatalogo();
  const pedidoService = new PedidoService((id) => catalogo.buscar(id));
  const reportesService = new ReportesService(catalogo, pedidoService);
  const app = express();
  app.use(express.json());
  app.use('/pedidos', crearPedidosRouter(pedidoService));
  app.use('/reportes', crearReportesRouter(reportesService));
  return app;
}

describe('GET /reportes/mas-vendido', () => {
  it('devuelve 404 si todavía no se vendió nada', async () => {
    const res = await request(crearApp()).get('/reportes/mas-vendido');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('devuelve el producto con más unidades vendidas', async () => {
    const app = crearApp();
    await request(app).post('/pedidos').send({ productoId: 'expreso-pocillo-brasil', cantidad: 2 });
    await request(app).post('/pedidos').send({ productoId: 'muffin-de-chocolate', cantidad: 5 });

    const res = await request(app).get('/reportes/mas-vendido');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      productoId: 'muffin-de-chocolate',
      producto: 'Muffin de chocolate',
      cantidadVendida: 5,
      facturacion: 12500,
    });
  });
});