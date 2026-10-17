
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Endpoints de reportes', () => {
    it('GET /reportes/facturacion devuelve la facturación inicial en cero', async () => {
    const respuesta = await request(app).get('/reportes/facturacion');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
        facturacionTotal: 0,
        cantidadPedidos: 0,
    });
    });

    it('GET /reportes/productos devuelve el reporte de productos', async () => {
    const respuesta = await request(app).get('/reportes/productos');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toHaveProperty('cantidadPorProducto');
    expect(respuesta.body).toHaveProperty('masVendido');
    expect(respuesta.body.cantidadPorProducto).toBeInstanceOf(Array);
    expect(respuesta.body.masVendido).toBeNull();
    });
});
