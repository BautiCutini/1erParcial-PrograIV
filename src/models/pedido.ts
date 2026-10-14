import type { Producto } from './producto';

export type BuscarProducto = (id: string) => Producto | undefined;

export class Pedido {
  readonly id: number;
  readonly productoId: string;
  readonly cantidad: number;
  readonly total: number;

  constructor(id: number, productoId: string, cantidad: number, total: number) {
    this.id = id;
    this.productoId = productoId;
    this.cantidad = cantidad;
    this.total = total;
  }
}

export class PedidoService {
  private readonly buscarProducto: BuscarProducto;
  private siguienteId = 1;

  constructor(buscarProducto: BuscarProducto) {
    this.buscarProducto = buscarProducto;
  }

  crearPedido(input: { productoId: string; cantidad: number }): Pedido {
    const producto = this.buscarProducto(input.productoId)!; // provisorio, se arregla en el ciclo 8
    const total = producto.calcularPrecio() * input.cantidad;
    return new Pedido(this.siguienteId++, input.productoId, input.cantidad, total);
  }
}