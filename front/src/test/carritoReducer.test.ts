
import { describe, it, expect } from 'vitest';
import { carritoReducer } from '../reducers/carritoReducer';
import { muffinChocolate, tortaSelvaNegra } from './fixtures';

describe('carritoReducer', () => {
    it('agrega un producto al carrito con cantidad uno', () => {
        const resultado = carritoReducer([], {
            type: 'AGREGAR',
            producto: muffinChocolate,
        });
        
    expect(resultado).toEqual([
        { producto: muffinChocolate, cantidad: 1 },
    ]);
    });
    
    it('incrementa la cantidad si el producto ya existe', () => {
        const inicial = [
            { producto: muffinChocolate, cantidad: 1 },
        ];
        
        const resultado = carritoReducer(inicial, {
            type: 'AGREGAR',
            producto: muffinChocolate,
        });
        
    expect(resultado[0].cantidad).toBe(2);
    });
        
    it('permite agregar productos diferentes', () => {
        const resultado = carritoReducer(
            [{ producto: muffinChocolate, cantidad: 1 }],
            { type: 'AGREGAR', producto: tortaSelvaNegra },
        );
        
        expect(resultado).toHaveLength(2);
    });
    
    it('incrementa la cantidad de un producto', () => {
        const inicial = [
            { producto: muffinChocolate, cantidad: 1 },
        ];
        
        const resultado = carritoReducer(inicial, {
            type: 'INCREMENTAR',
            productoId: muffinChocolate.id,
        });
        
        expect(resultado[0].cantidad).toBe(2);
    });
    
    it('decrementa la cantidad de un producto', () => {
        const inicial = [
            { producto: muffinChocolate, cantidad: 2 },
        ];
        
        const resultado = carritoReducer(inicial, {
            type: 'DECREMENTAR',
            productoId: muffinChocolate.id,
        });
        
        expect(resultado[0].cantidad).toBe(1);
    });
    
    it('elimina el producto cuando la cantidad llega a cero', () => {
        const inicial = [
            { producto: muffinChocolate, cantidad: 1 },
        ];
        
        const resultado = carritoReducer(inicial, {
            type: 'DECREMENTAR',
            productoId: muffinChocolate.id,
        });
        
        expect(resultado).toHaveLength(0);
    });
    
    it('permite quitar un producto directamente', () => {
        const inicial = [
            { producto: muffinChocolate, cantidad: 2 },
            { producto: tortaSelvaNegra, cantidad: 1 },
        ];
        
        const resultado = carritoReducer(inicial, {
            type: 'QUITAR',
            productoId: muffinChocolate.id,
        });
        
        expect(resultado).toHaveLength(1);
        expect(resultado[0].producto.id).toBe(tortaSelvaNegra.id);
    });
    
    it('no modifica el carrito original', () => {
        const inicial = [
            { producto: muffinChocolate, cantidad: 1 },
        ];
        
        carritoReducer(inicial, {
        type: 'INCREMENTAR',
        productoId: muffinChocolate.id,
        });
        
        expect(inicial[0].cantidad).toBe(1);
    });
});
