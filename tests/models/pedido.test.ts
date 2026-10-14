import { describe, it, expect } from 'vitest';
import { PedidoService, PedidoNoEncontradoError, ValidacionError } from '../../src/models/pedido';
import { Expreso } from '../../src/models/expreso';

const expreso = new Expreso('Brasil', 'pocillo'); 
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

  describe('listarPedidos', () => {
    it('devuelve una lista vacía si no hay pedidos', () => {
      const service = new PedidoService(buscar);

      expect(service.listarPedidos()).toEqual([]);
    });

    it('devuelve todos los pedidos creados', () => {
      const service = new PedidoService(buscar);

      service.crearPedido({ productoId: expreso.id, cantidad: 1 });
      service.crearPedido({ productoId: expreso.id, cantidad: 2 });

      expect(service.listarPedidos()).toHaveLength(2);
    });
  });

  describe('obtenerPedido', () => {
    it('devuelve el pedido por id', () => {
      const service = new PedidoService(buscar);
      const creado = service.crearPedido({ productoId: expreso.id, cantidad: 4 });

      expect(service.obtenerPedido(creado.id)).toEqual(creado);
    });

    it('lanza PedidoNoEncontradoError si no existe', () => {
      const service = new PedidoService(buscar);

      expect(() => service.obtenerPedido(123)).toThrow(PedidoNoEncontradoError);
    });
  });

  describe('crearPedido', () => {
    it('falla si la cantidad es 0 o negativa', () => {
      const service = new PedidoService(buscar);

      expect(() => service.crearPedido({ productoId: expreso.id, cantidad: 0 })).toThrow(ValidacionError);
      expect(() => service.crearPedido({ productoId: expreso.id, cantidad: -2 })).toThrow(ValidacionError);
    });

    it('falla si la cantidad no es un entero', () => {
      const service = new PedidoService(buscar);

      expect(() => service.crearPedido({ productoId: expreso.id, cantidad: 1.5 })).toThrow(ValidacionError);
      expect(() => service.crearPedido({ productoId: expreso.id, cantidad: '2' })).toThrow(ValidacionError);
    });

    it('falla si faltan campos obligatorios', () => {
      const service = new PedidoService(buscar);

      expect(() => service.crearPedido({ productoId: undefined, cantidad: 1 })).toThrow(ValidacionError);
      expect(() => service.crearPedido({ productoId: expreso.id, cantidad: undefined })).toThrow(ValidacionError);
    });

    it('falla si el producto no existe', () => {
      const service = new PedidoService(buscar);

      expect(() => service.crearPedido({ productoId: 'producto-inexistente', cantidad: 1 })).toThrow(ValidacionError);
    });

    it('no guarda el pedido si la validación falla', () => {
      const service = new PedidoService(buscar);

      try {
        service.crearPedido({ productoId: expreso.id, cantidad: 0 });
      } catch {
       
      }

      expect(service.listarPedidos()).toHaveLength(0);
    });
  });
});