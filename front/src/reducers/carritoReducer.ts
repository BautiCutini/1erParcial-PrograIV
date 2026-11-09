import type { Producto } from '../schemas/producto';

export interface ItemCarrito {
    producto: Producto;
    cantidad: number;
}

// Acciones que puede realizar el usuario sobre el carrito.
export type AccionCarrito =
    | { type: 'AGREGAR'; producto: Producto }
    | { type: 'INCREMENTAR'; productoId: string }
    | { type: 'DECREMENTAR'; productoId: string }
    | { type: 'QUITAR'; productoId: string };
    
    
export const carritoInicial: ItemCarrito[] = [];
export function carritoReducer(
    estado: ItemCarrito[],
    accion: AccionCarrito,
): ItemCarrito[] {
    switch (accion.type) {
        case 'AGREGAR': {
        const existente = estado.find(
            (item) => item.producto.id === accion.producto.id,
        );
        
        if (existente) {
            return estado.map((item) =>
                item.producto.id === accion.producto.id
                ? { ...item, cantidad: item.cantidad + 1 }
                : item,
            );
        }
        
        return [...estado, { producto: accion.producto, cantidad: 1 }];
        }
        
        case 'INCREMENTAR':
            return estado.map((item) =>
                item.producto.id === accion.productoId
                ? { ...item, cantidad: item.cantidad + 1 }
                : item,
            );
        
        case 'DECREMENTAR':
            return estado
                .map((item) =>
                    item.producto.id === accion.productoId
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item,
                )
        .filter((item) => item.cantidad > 0);
        
        case 'QUITAR':
            return estado.filter(
                (item) => item.producto.id !== accion.productoId,
            );
            
        default:
            return estado;
    }
}
