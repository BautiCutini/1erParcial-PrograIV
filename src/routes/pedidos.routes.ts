import { Router } from 'express';
import { PedidoService, ValidacionError, PedidoNoEncontradoError } from '../models/pedido';

export function crearPedidosRouter(pedidoService: PedidoService): Router {
  const router = Router();
  

  router.post('/', (req, res) => {
    try {
      const pedido = pedidoService.crearPedido(req.body);
      res.status(201).json(pedido);
    } catch (error) {
      if (error instanceof ValidacionError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  });

  router.get('/', (_req, res) => {
    res.status(200).json(pedidoService.listarPedidos());
  });

  router.get('/:id', (req, res) => {
    try {
      const id = Number(req.params.id);
      const pedido = pedidoService.obtenerPedido(id);
      res.status(200).json(pedido);
    } catch (error) {
      if (error instanceof PedidoNoEncontradoError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  });

  return router;
}