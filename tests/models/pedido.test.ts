import { describe, it, expect } from 'vitest';
import { PedidoService } from '../../src/models/pedido';
import { Expreso } from '../../src/models/expreso';

const expreso = new Expreso('Brasil', 'pocillo'); // 5020
const buscar = (id: string) => (id === expreso.id ? expreso : undefined);

describe('PedidoService', () => {
  it('calcula el total como calcularPrecio() x cantidad', () => {
    const service = new PedidoService(buscar);

    const pedido = service.crearPedido({ productoId: expreso.id, cantidad: 3 });

    expect(pedido.total).toBe(15060);
  });

  it('asigna ids incrementales', () => {
    const service = new PedidoService(buscar);

    const a = service.crearPedido({ productoId: expreso.id, cantidad: 1 });
    const b = service.crearPedido({ productoId: expreso.id, cantidad: 1 });

    expect(a.id).toBe(1);
    expect(b.id).toBe(2);
  });
});