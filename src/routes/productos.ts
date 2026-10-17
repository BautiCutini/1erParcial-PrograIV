import { Router } from 'express';
import type { Catalogo } from '../models/catalogo';
import type { Producto } from '../models/producto';


const aDto = (p: Producto) => ({ id: p.id, nombre: p.nombre, precio: p.calcularPrecio() });

export function crearProductosRouter(catalogo: Catalogo): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(catalogo.listar().map(aDto));
  });

  router.get('/:id', (req, res) => {
    const producto = catalogo.buscar(req.params.id);
    if (producto) {
      res.json(aDto(producto));
    } else {
      res.status(404).json({ error: `Producto ${req.params.id} no encontrado` });
    }
  });

  return router;
}