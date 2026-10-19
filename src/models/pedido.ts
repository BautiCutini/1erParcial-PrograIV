import type { Producto } from './producto';

export type BuscarProducto = (id: string) => Producto | undefined;

export type EstadoPedido = 'pendiente' | 'entregado' | 'cancelado';

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

export interface ItemPedido {
  readonly productoId: string;
  readonly cantidad: number;
  readonly subtotal: number;
}

export class Pedido {
  readonly id: number;
  readonly items: readonly ItemPedido[];
  readonly estado: EstadoPedido;
  readonly total: number;

  constructor(id: number, items: readonly ItemPedido[], estado: EstadoPedido = 'pendiente') {
    this.id = id;
    this.items = items;
    this.estado = estado;
    // El total es la suma de los subtotales: calcularPrecio() x cantidad de cada item.
    this.total = items.reduce((suma, item) => suma + item.subtotal, 0);
  }
}

export interface NuevoPedidoInput {
  items: unknown;
}

interface ItemValidado {
  productoId: string;
  cantidad: number;
}

export class PedidoService {
  private readonly buscarProducto: BuscarProducto;
  private pedidos: Pedido[] = [];
  private siguienteId = 1;

  constructor(buscarProducto: BuscarProducto) {
    this.buscarProducto = buscarProducto;
  }

  crearPedido(input: NuevoPedidoInput): Pedido {
    const itemsValidados = this.validar(input);

    // Si cualquier item falla, se lanza el error antes de guardar nada.
    const items = itemsValidados.map(({ productoId, cantidad }, indice) => {
      const producto = this.buscarProducto(productoId);
      if (!producto) {
        throw new ValidacionError(`items[${indice}]: el producto con id ${productoId} no existe`);
      }
      return { productoId, cantidad, subtotal: producto.calcularPrecio() * cantidad };
    });

    const pedido = new Pedido(this.siguienteId++, items);
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

  private validar(input: NuevoPedidoInput): ItemValidado[] {
    const { items } = input;

    if (items === undefined || items === null) {
      throw new ValidacionError('items es obligatorio');
    }
    if (!Array.isArray(items)) {
      throw new ValidacionError('items debe ser una lista');
    }
    if (items.length === 0) {
      throw new ValidacionError('items no puede estar vacío');
    }

    return items.map((item, indice) => this.validarItem(item, indice));
  }

  private validarItem(item: unknown, indice: number): ItemValidado {
    const prefijo = `items[${indice}]`;

    if (typeof item !== 'object' || item === null) {
      throw new ValidacionError(`${prefijo} debe ser un objeto`);
    }

    const { productoId, cantidad } = item as { productoId?: unknown; cantidad?: unknown };

    if (productoId === undefined || productoId === null) {
      throw new ValidacionError(`${prefijo}: productoId es obligatorio`);
    }
    if (cantidad === undefined || cantidad === null) {
      throw new ValidacionError(`${prefijo}: cantidad es obligatoria`);
    }
    if (typeof productoId !== 'string') {
      throw new ValidacionError(`${prefijo}: productoId debe ser un texto`);
    }
    if (typeof cantidad !== 'number' || !Number.isInteger(cantidad)) {
      throw new ValidacionError(`${prefijo}: cantidad debe ser un número entero`);
    }
    if (cantidad <= 0) {
      throw new ValidacionError(`${prefijo}: cantidad debe ser mayor a 0`);
    }

    return { productoId, cantidad };
  }
}
