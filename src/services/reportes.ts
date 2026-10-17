import type { Catalogo } from '../models/catalogo';
import type { PedidoService } from '../models/pedido';

export interface ProductoReporte {
    productoId: string;
    producto: string;
    cantidadVendida: number;
    facturacion: number;
}

export interface ReporteProductos {
    cantidadPorProducto: ProductoReporte[];
    masVendido: ProductoReporte | null;
}

/** Calcula reportes a partir de los pedidos existentes y del catálogo vigente. */
export class ReportesService {
    constructor(
    private readonly catalogo: Catalogo,
    private readonly pedidos: PedidoService,
    ) {}
    
    obtenerFacturacion(): { facturacionTotal: number; cantidadPedidos: number } {
    const pedidos = this.pedidos.listarPedidos();
    const facturacionTotal = pedidos.reduce((total, pedido) => total + pedido.total, 0);
    
    return { facturacionTotal, cantidadPedidos: pedidos.length };
    } 
    
    obtenerReporteProductos(): ReporteProductos {
    const acumulado = new Map<string, ProductoReporte>();
    
    // Incluye también los productos sin ventas, con cantidad y facturación en cero.
    for (const producto of this.catalogo.listar()) {
        acumulado.set(producto.id, {
        productoId: producto.id,
        producto: producto.nombre,
        cantidadVendida: 0,
        facturacion: 0,
        });
    }
    
    for (const pedido of this.pedidos.listarPedidos()) {
        const reporte = acumulado.get(pedido.productoId);
        if (!reporte) continue;
        reporte.cantidadVendida += pedido.cantidad;
        reporte.facturacion += pedido.total;
    }
    
    const cantidadPorProducto = [...acumulado.values()].sort((a, b) =>
        a.producto.localeCompare(b.producto, 'es') || a.productoId.localeCompare(b.productoId),
    );
    
    const vendidos = cantidadPorProducto.filter((producto) => producto.cantidadVendida > 0);
    const masVendido = vendidos.reduce<ProductoReporte | null>((mejor, actual) => {
        if (!mejor || actual.cantidadVendida > mejor.cantidadVendida) return actual;
        return mejor;
    }, null);
    
    return { cantidadPorProducto, masVendido };
    } 
}