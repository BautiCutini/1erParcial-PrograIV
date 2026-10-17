import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { crearCatalogo } from './models/catalogo';
import { PedidoService, ValidacionError, PedidoNoEncontradoError } from './models/pedido';
import { crearProductosRouter } from './routes/productos';
import { crearPedidosRouter } from './routes/pedidos';
import { crearReportesRouter } from './routes/reportes';
import { ReportesService } from './services/reportes';

const app = express();
app.use(express.json());

const catalogo = crearCatalogo();
const pedidoService = new PedidoService((id) => catalogo.buscar(id));
const reportesService = new ReportesService(catalogo, pedidoService);

app.use('/productos', crearProductosRouter(catalogo));
app.use('/pedidos', crearPedidosRouter(pedidoService));
app.use('/reportes', crearReportesRouter(reportesService));

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ValidacionError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof PedidoNoEncontradoError) {
    res.status(404).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default app;