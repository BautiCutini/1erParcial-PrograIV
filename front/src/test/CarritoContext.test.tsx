
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CarritoProvider, useCarrito } from '../context/CarritoContext';
import { muffinChocolate } from './fixtures';

describe('CarritoContext', () => {
    it('inicia con el carrito vacío', () => {
        const { result } = renderHook(() => useCarrito(), {
            wrapper: CarritoProvider,
        });
        
        expect(result.current.items).toEqual([]);
    });
    
    it('permite agregar un producto al carrito', () => {
        const { result } = renderHook(() => useCarrito(), {
            wrapper: CarritoProvider,
        });
        
        act(() => {
            result.current.agregar(muffinChocolate);
        });
        
        expect(result.current.items).toEqual([
        { producto: muffinChocolate, cantidad: 1 },
        ]);
    });
    
    it('permite incrementar y decrementar cantidades', () => {
        const { result } = renderHook(() => useCarrito(), {
            wrapper: CarritoProvider,
        });
        
        act(() => {
            result.current.agregar(muffinChocolate);
            result.current.incrementar(muffinChocolate.id);
        });
        
        expect(result.current.items[0].cantidad).toBe(2);
        
        act(() => {
            result.current.decrementar(muffinChocolate.id);
        });
        
        expect(result.current.items[0].cantidad).toBe(1);
    });
    
    it('permite quitar un producto del carrito', () => {
        const { result } = renderHook(() => useCarrito(), {
            wrapper: CarritoProvider,
        });
        
        act(() => {
            result.current.agregar(muffinChocolate);
            result.current.quitar(muffinChocolate.id);
        });
        
        expect(result.current.items).toEqual([]);
    });
});
