import { describe, it, expect, beforeEach } from 'vitest';
import { PedidoService, PedidoNoEncontradoError, ValidacionError } from '../../src/models/pedido';
import { Expreso } from '../../src/models/expreso';
import { Pasteleria } from '../../src/models/pasteleria';

const expreso = new Expreso('Brasil', 'pocillo'); // 5020
const muffin = new Pasteleria('Muffin de chocolate', 2500);
const productos = [expreso, muffin];
const buscar = (id: string) => productos.find((p) => p.id === id);

describe('PedidoService', () => {
  let service: PedidoService;

  beforeEach(() => {
    service = new PedidoService(buscar);
  });

  it('calcula el total de un pedido con un solo item', () => {
    const pedido = service.crearPedido({ items: [{ productoId: expreso.id, cantidad: 3 }] });

    expect(pedido.total).toBe(15060);
  });

  it('calcula el total como la suma de calcularPrecio() x cantidad de cada item', () => {
    const pedido = service.crearPedido({
      items: [
        { productoId: expreso.id, cantidad: 2 },
        { productoId: muffin.id, cantidad: 1 },
      ],
    });

    expect(pedido.total).toBe(12540); // 2 x 5020 + 1 x 2500
  });

  it('guarda los items del pedido', () => {
    const pedido = service.crearPedido({
      items: [
        { productoId: expreso.id, cantidad: 2 },
        { productoId: muffin.id, cantidad: 1 },
      ],
    });

    expect(pedido.items).toHaveLength(2);
    expect(pedido.items[0]).toMatchObject({ productoId: expreso.id, cantidad: 2 });
    expect(pedido.items[1]).toMatchObject({ productoId: muffin.id, cantidad: 1 });
  });

  it('crea el pedido con estado pendiente', () => {
    const pedido = service.crearPedido({ items: [{ productoId: expreso.id, cantidad: 1 }] });

    expect(pedido.estado).toBe('pendiente');
  });

  it('asigna ids incrementales', () => {
    const a = service.crearPedido({ items: [{ productoId: expreso.id, cantidad: 1 }] });
    const b = service.crearPedido({ items: [{ productoId: expreso.id, cantidad: 1 }] });

    expect(a.id).toBe(1);
    expect(b.id).toBe(2);
  });

  describe('listarPedidos', () => {
    it('devuelve una lista vacía si no hay pedidos', () => {
      expect(service.listarPedidos()).toEqual([]);
    });

    it('devuelve todos los pedidos creados', () => {
      service.crearPedido({ items: [{ productoId: expreso.id, cantidad: 1 }] });
      service.crearPedido({ items: [{ productoId: expreso.id, cantidad: 2 }] });

      expect(service.listarPedidos()).toHaveLength(2);
    });
  });

  describe('obtenerPedido', () => {
    it('devuelve el pedido por id', () => {
      const creado = service.crearPedido({ items: [{ productoId: expreso.id, cantidad: 4 }] });

      expect(service.obtenerPedido(creado.id)).toEqual(creado);
    });

    it('lanza PedidoNoEncontradoError si no existe', () => {
      expect(() => service.obtenerPedido(123)).toThrow(PedidoNoEncontradoError);
    });
  });

  describe('crearPedido: validaciones', () => {
    it('falla si falta items', () => {
      expect(() => service.crearPedido({ items: undefined })).toThrow(ValidacionError);
    });

    it('falla si items no es una lista', () => {
      expect(() => service.crearPedido({ items: 'expreso' })).toThrow(ValidacionError);
    });

    it('falla si items está vacío', () => {
      expect(() => service.crearPedido({ items: [] })).toThrow(ValidacionError);
    });

    it('falla si la cantidad es 0 o negativa', () => {
      expect(() => service.crearPedido({ items: [{ productoId: expreso.id, cantidad: 0 }] })).toThrow(ValidacionError);
      expect(() => service.crearPedido({ items: [{ productoId: expreso.id, cantidad: -2 }] })).toThrow(ValidacionError);
    });

    it('falla si la cantidad no es un entero', () => {
      expect(() => service.crearPedido({ items: [{ productoId: expreso.id, cantidad: 1.5 }] })).toThrow(ValidacionError);
      expect(() => service.crearPedido({ items: [{ productoId: expreso.id, cantidad: '2' }] })).toThrow(ValidacionError);
    });

    it('falla si a un item le faltan campos obligatorios', () => {
      expect(() => service.crearPedido({ items: [{ cantidad: 1 }] })).toThrow(ValidacionError);
      expect(() => service.crearPedido({ items: [{ productoId: expreso.id }] })).toThrow(ValidacionError);
    });

    it('falla si un item no es un objeto', () => {
      expect(() => service.crearPedido({ items: ['expreso'] })).toThrow(ValidacionError);
    });

    it('falla si algún producto no existe', () => {
      expect(() =>
        service.crearPedido({ items: [{ productoId: 'producto-inexistente', cantidad: 1 }] }),
      ).toThrow(ValidacionError);
    });

    it('no guarda el pedido si un solo item es inválido', () => {
      expect(() =>
        service.crearPedido({
          items: [
            { productoId: expreso.id, cantidad: 1 },
            { productoId: muffin.id, cantidad: 0 },
          ],
        }),
      ).toThrow(ValidacionError);

      expect(service.listarPedidos()).toHaveLength(0);
    });
  });
});