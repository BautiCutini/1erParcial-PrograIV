
import { z } from 'zod';

const PedidoSchema = z.object({
    id: z.number(),
    mesaId: z.number().optional(),
    items: z.array(
        z.object({
        productoId: z.string(),
        cantidad: z.number(),
        subtotal: z.number(),
        }),
    ),
    estado: z.enum(['pendiente', 'entregado', 'cancelado']),
    total: z.number(),
});

export type Pedido = z.infer<typeof PedidoSchema>;

export interface NuevoPedido {
    mesaId?: number;
    items: {
        productoId: string;
        cantidad: number;
    }[];
}

export async function crearPedido(pedido: NuevoPedido): Promise<Pedido> {
    const respuesta = await fetch(
        new URL('/pedidos', window.location.origin),
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido),
        },
    );
    
    if (!respuesta.ok) {
    throw new Error(`El servidor respondió con error ${respuesta.status}`);
    }
    
    const json: unknown = await respuesta.json();
    
    return PedidoSchema.parse(json);
}