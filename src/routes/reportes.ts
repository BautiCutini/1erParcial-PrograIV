import { Router } from 'express';
import type { ReportesService } from '../services/reportes';

export function crearReportesRouter(service: ReportesService): Router {
    const router = Router();
    
    // GET /reportes/facturacion
    router.get('/facturacion', (_req, res) => {
    res.json(service.obtenerFacturacion());
        });
    
    // GET /reportes/productos: unidades por producto y el producto más vendido.
    router.get('/productos', (_req, res) => {
        res.json(service.obtenerReporteProductos());
    });

        // GET /reportes/mas-vendido: el producto con más unidades vendidas.
    router.get('/mas-vendido', (_req, res) => {
        const { masVendido } = service.obtenerReporteProductos();
        if (!masVendido) {
            res.status(404).json({ error: 'Todavía no hay productos vendidos' });
            return;
        }
        res.json(masVendido);
    });
    
    return router;
}