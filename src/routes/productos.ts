import { Router } from 'express';
import type { Catalogo } from '../models/catalogo';

export function crearProductosRouter(catalogo: Catalogo): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(catalogo.listar().map((p) => p.describir()));
  });

  router.get('/:id', (req, res) => {
    const producto = catalogo.buscar(req.params.id);
    if (producto) {
      res.json(producto.describir());
    } else {
      res.status(404).json({ error: `Producto ${req.params.id} no encontrado` });
    }
  });

  return router;
}