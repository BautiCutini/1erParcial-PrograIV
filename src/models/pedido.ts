import type { Producto } from './producto';

export type BuscarProducto = (id: string) => Producto | undefined;

export class PedidoNoEncontradoError extends Error {
  constructor(id: number) {
    super(`Pedido con id ${id} no encontrado`);
    this.name = 'PedidoNoEncontradoError';
  }
}

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
  private pedidos: Pedido[] = [];
  private siguienteId = 1;

  constructor(buscarProducto: BuscarProducto) {
    this.buscarProducto = buscarProducto;
  }

  crearPedido(input: { productoId: string; cantidad: number }): Pedido {
    const producto = this.buscarProducto(input.productoId)!; // provisorio, se arregla en el ciclo 8
    const total = producto.calcularPrecio() * input.cantidad;
    const pedido = new Pedido(this.siguienteId++, input.productoId, input.cantidad, total);
    this.pedidos.push(pedido);
    return pedido;
  }

  listarPedidos(): Pedido[] {
    return [...this.pedidos];
  }

  obtenerPedido(id: number): Pedido {
    const pedido = this.pedidos.find((p) => p.id === id);
    if (!pedido) {
      throw new PedidoNoEncontradoError(id);
    }
    return pedido;
  }
}