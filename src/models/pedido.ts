import type { Producto } from './producto';

export type BuscarProducto = (id: string) => Producto | undefined;

export class ValidacionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidacionError';
  }
}

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

export interface NuevoPedidoInput {
  productoId: unknown;
  cantidad: unknown;
}

export class PedidoService {
  private readonly buscarProducto: BuscarProducto;
  private pedidos: Pedido[] = [];
  private siguienteId = 1;

  constructor(buscarProducto: BuscarProducto) {
    this.buscarProducto = buscarProducto;
  }

  crearPedido(input: NuevoPedidoInput): Pedido {
    const { productoId, cantidad } = this.validar(input);

    const producto = this.buscarProducto(productoId);
    if (!producto) {
      throw new ValidacionError(`El producto con id ${productoId} no existe`);
    }

    const total = producto.calcularPrecio() * cantidad;
    const pedido = new Pedido(this.siguienteId++, productoId, cantidad, total);
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

  private validar(input: NuevoPedidoInput): { productoId: string; cantidad: number } {
    const { productoId, cantidad } = input;

    if (productoId === undefined || productoId === null) {
      throw new ValidacionError('productoId es obligatorio');
    }
    if (cantidad === undefined || cantidad === null) {
      throw new ValidacionError('cantidad es obligatoria');
    }
    if (typeof productoId !== 'string') {
      throw new ValidacionError('productoId debe ser un texto');
    }
    if (typeof cantidad !== 'number' || !Number.isInteger(cantidad)) {
      throw new ValidacionError('cantidad debe ser un número entero');
    }
    if (cantidad <= 0) {
      throw new ValidacionError('cantidad debe ser mayor a 0');
    }

    return { productoId, cantidad };
  }
}