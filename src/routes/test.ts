import { Router } from 'express';
import type { PedidoService } from '../models/pedido';

export function crearTestRouter(pedidoService: PedidoService): Router {
  const router = Router();

  router.post('/reset', (_req, res) => {
    pedidoService.reiniciar();
    res.status(204).end();
  });

  return router;
}