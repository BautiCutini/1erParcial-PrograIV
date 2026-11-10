
import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';

import { crearPedido } from '../api/pedidos';
import { server } from './server';

describe('crearPedido', () => {
    it('envía los productos y la mesa al servidor y devuelve el pedido creado', async () => {
        const pedidoNuevo = {
            mesaId: 5,
            items: [
                {
                    productoId: 'muffin-de-chocolate',
                    cantidad: 2,
                },
            ],
        };
        
        const respuestaPedido = {
            id: 1,
            mesaId: 5,
            items: [
                {
                    productoId: 'muffin-de-chocolate',
                    cantidad: 2,
                    subtotal: 5000,
                },
            ],
            estado: 'pendiente',
            total: 5000,
        };
        
        let bodyRecibido: unknown;
        
        server.use(
            http.post('*/pedidos', async ({ request }) => {
                bodyRecibido = await request.json();
                
                return HttpResponse.json(respuestaPedido, {
                    status: 201,
                });
            }),
        );
        
        const resultado = await crearPedido(pedidoNuevo);
        
        expect(bodyRecibido).toEqual(pedidoNuevo);
        expect(resultado).toEqual(respuestaPedido);
    });
});