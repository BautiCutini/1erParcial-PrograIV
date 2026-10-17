
import { describe, it, expect, beforeEach } from 'vitest';
import { ReportesService } from '../../src/services/reportes';
import { Catalogo } from '../../src/models/catalogo';
import { PedidoService } from '../../src/models/pedido';
import { Pasteleria } from '../../src/models/pasteleria';

describe('ReportesService', () => {
    let catalogo: Catalogo;
    let pedidos: PedidoService;
    let reportes: ReportesService;
    let muffin: Pasteleria;
    let torta: Pasteleria;

    beforeEach(() => {
    catalogo = new Catalogo();
    muffin = new Pasteleria('Muffin de chocolate', 2500);
    torta = new Pasteleria('Torta selva negra', 4200);

    catalogo.agregar(muffin);
    catalogo.agregar(torta);

    pedidos = new PedidoService((id) => catalogo.buscar(id));
    reportes = new ReportesService(catalogo, pedidos);
    });

    it('devuelve facturación cero cuando no hay pedidos', () => {
    expect(reportes.obtenerFacturacion()).toEqual({
        facturacionTotal: 0,
        cantidadPedidos: 0,
    });
    });

    it('calcula la facturación total y cantidad de pedidos', () => {
    pedidos.crearPedido({ productoId: muffin.id, cantidad: 2 });
    pedidos.crearPedido({ productoId: torta.id, cantidad: 1 });

    expect(reportes.obtenerFacturacion()).toEqual({
        facturacionTotal: 9200,
        cantidadPedidos: 2,
    });
    });

    it('acumula las cantidades y facturación por producto', () => {
    pedidos.crearPedido({ productoId: muffin.id, cantidad: 2 });
    pedidos.crearPedido({ productoId: muffin.id, cantidad: 3 });
    pedidos.crearPedido({ productoId: torta.id, cantidad: 1 });

    const resultado = reportes.obtenerReporteProductos();

    expect(resultado.cantidadPorProducto).toContainEqual({
        productoId: muffin.id,
        producto: muffin.nombre,
        cantidadVendida: 5,
        facturacion: 12500,
    });

    expect(resultado.cantidadPorProducto).toContainEqual({
        productoId: torta.id,
        producto: torta.nombre,
        cantidadVendida: 1,
        facturacion: 4200,
    });
    });

    it('identifica el producto más vendido por unidades', () => {
    pedidos.crearPedido({ productoId: muffin.id, cantidad: 2 });
    pedidos.crearPedido({ productoId: torta.id, cantidad: 3 });

    expect(reportes.obtenerReporteProductos().masVendido).toEqual({
        productoId: torta.id,
        producto: torta.nombre,
        cantidadVendida: 3,
        facturacion: 12600,
    });
    });

    it('incluye productos sin ventas con valores en cero', () => {
    const resultado = reportes.obtenerReporteProductos();

    expect(resultado.cantidadPorProducto).toContainEqual({
        productoId: muffin.id,
        producto: muffin.nombre,
        cantidadVendida: 0,
        facturacion: 0,
    });

    expect(resultado.masVendido).toBeNull();
    });
});
