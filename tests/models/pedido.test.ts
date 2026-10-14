import { describe, it, expect, beforeEach } from 'vitest';
import { PedidoService, PedidoNoEncontradoError, ValidacionError } from '../../src/models/pedido';
import { Expreso } from '../../src/models/expreso';

const expreso = new Expreso('Brasil', 'pocillo'); 
const buscar = (id: string) => (id === expreso.id ? expreso : undefined);

describe('PedidoService', () => {
  let service: PedidoService;

  beforeEach(() => {
    service = new PedidoService(buscar);
  });

  it('calcula el total como calcularPrecio() x cantidad', () => {
    const pedido = service.crearPedido({ productoId: expreso.id, cantidad: 3 });

    expect(pedido.total).toBe(15060);
  });

  it('asigna ids incrementales', () => {
    const a = service.crearPedido({ productoId: expreso.id, cantidad: 1 });
    const b = service.crearPedido({ productoId: expreso.id, cantidad: 1 });

    expect(a.id).toBe(1);
    expect(b.id).toBe(2);
  });

  describe('listarPedidos', () => {
    it('devuelve una lista vacía si no hay pedidos', () => {
      expect(service.listarPedidos()).toEqual([]);
    });

    it('devuelve todos los pedidos creados', () => {
      service.crearPedido({ productoId: expreso.id, cantidad: 1 });
      service.crearPedido({ productoId: expreso.id, cantidad: 2 });

      expect(service.listarPedidos()).toHaveLength(2);
    });
  });

  describe('obtenerPedido', () => {
    it('devuelve el pedido por id', () => {
      const creado = service.crearPedido({ productoId: expreso.id, cantidad: 4 });

      expect(service.obtenerPedido(creado.id)).toEqual(creado);
    });

    it('lanza PedidoNoEncontradoError si no existe', () => {
      expect(() => service.obtenerPedido(123)).toThrow(PedidoNoEncontradoError);
    });
  });

  describe('crearPedido', () => {
    it('falla si la cantidad es 0 o negativa', () => {
      expect(() => service.crearPedido({ productoId: expreso.id, cantidad: 0 })).toThrow(ValidacionError);
      expect(() => service.crearPedido({ productoId: expreso.id, cantidad: -2 })).toThrow(ValidacionError);
    });

    it('falla si la cantidad no es un entero', () => {
      expect(() => service.crearPedido({ productoId: expreso.id, cantidad: 1.5 })).toThrow(ValidacionError);
      expect(() => service.crearPedido({ productoId: expreso.id, cantidad: '2' })).toThrow(ValidacionError);
    });

    it('falla si faltan campos obligatorios', () => {
      expect(() => service.crearPedido({ productoId: undefined, cantidad: 1 })).toThrow(ValidacionError);
      expect(() => service.crearPedido({ productoId: expreso.id, cantidad: undefined })).toThrow(ValidacionError);
    });

    it('falla si el producto no existe', () => {
      expect(() => service.crearPedido({ productoId: 'producto-inexistente', cantidad: 1 })).toThrow(ValidacionError);
    });

    it('no guarda el pedido si la validación falla', () => {
      try {
        service.crearPedido({ productoId: expreso.id, cantidad: 0 });
      } catch {
        
      }

      expect(service.listarPedidos()).toHaveLength(0);
    });
  });
});