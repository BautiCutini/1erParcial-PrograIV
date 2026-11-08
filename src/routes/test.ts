import { Router } from 'express';
import type { NuevoPedidoInput, PedidoService } from '../models/pedido';
import { ValidacionError } from '../models/pedido';


const SEED_POR_DEFECTO: NuevoPedidoInput[] = [
  {
    mesaId: 1,
    items: [
      { productoId: 'expreso-pocillo-brasil', cantidad: 2 },
      { productoId: 'muffin-de-chocolate', cantidad: 1 },
    ],
  },
  { mesaId: 2, items: [{ productoId: 'torta-selva-negra', cantidad: 1 }] },
  { items: [{ productoId: 'filtrado-mediano-colombia', cantidad: 3 }] },
];

export function crearTestRouter(pedidoService: PedidoService): Router {
  const router = Router();

  
  router.post('/reset', (_req, res) => {
    pedidoService.reiniciar();
    res.status(204).end();
  });

 
  router.post('/seed', (req, res) => {
    const pedidos = req.body?.pedidos ?? SEED_POR_DEFECTO;
    if (!Array.isArray(pedidos)) {
      throw new ValidacionError('pedidos debe ser una lista');
    }

    pedidoService.reiniciar();
    try {
      const creados = pedidos.map((input) => pedidoService.crearPedido(input ?? {}));
      res.status(201).json(creados);
    } catch (error) {
      pedidoService.reiniciar(); 
      throw error;
    }
  });

  return router;
}