import { describe, it, expect } from 'vitest';
import { crearCatalogo } from '../../src/models/catalogo';
import { PedidoService, ValidacionError } from '../../src/models/pedido';

const ITEMS = [{ productoId: 'muffin-de-chocolate', cantidad: 1 }];

function crearService() {
  const catalogo = crearCatalogo();
  return new PedidoService((id) => catalogo.buscar(id));
}

describe('PedidoService - mesaId opcional', () => {
  it('crea el pedido sin mesaId', () => {
    const pedido = crearService().crearPedido({ items: ITEMS });
    expect(pedido.mesaId).toBeUndefined();
  });

  it('acepta null como "sin mesa"', () => {
    const pedido = crearService().crearPedido({ items: ITEMS, mesaId: null });
    expect(pedido.mesaId).toBeUndefined();
  });

  it('guarda el mesaId cuando es válido', () => {
    const pedido = crearService().crearPedido({ items: ITEMS, mesaId: 5 });
    expect(pedido.mesaId).toBe(5);
  });

  it.each([['3'], [1.5], [true], [{}]])('rechaza mesaId no entero (%j)', (mesaId) => {
    expect(() => crearService().crearPedido({ items: ITEMS, mesaId })).toThrow(
      'mesaId debe ser un número entero',
    );
  });

  it.each([[0], [-2]])('rechaza mesaId menor o igual a 0 (%j)', (mesaId) => {
    expect(() => crearService().crearPedido({ items: ITEMS, mesaId })).toThrow(ValidacionError);
  });

  it('no guarda el pedido si el mesaId es inválido', () => {
    const service = crearService();
    expect(() => service.crearPedido({ items: ITEMS, mesaId: 0 })).toThrow();
    expect(service.listarPedidos()).toHaveLength(0);
  });
});