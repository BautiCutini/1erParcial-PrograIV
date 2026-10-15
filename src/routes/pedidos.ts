import { Router } from 'express';
import type { PedidoService } from '../models/pedido';

export function crearPedidosRouter(service: PedidoService): Router {
  const router = Router();

  router.post('/', (req, res) => {
    const pedido = service.crearPedido(req.body ?? {});
    res.status(201).json(pedido);
  });

  router.get('/', (_req, res) => {
    res.json(service.listarPedidos());
  });

  router.get('/:id', (req, res) => {
    res.json(service.obtenerPedido(Number(req.params.id)));
  });

  return router;
}