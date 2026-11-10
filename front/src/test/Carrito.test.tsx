
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Carrito } from '../components/Carrito';
import { CarritoProvider, useCarrito } from '../context/CarritoContext';
import { muffinChocolate, tortaSelvaNegra } from './fixtures';

// Componente auxiliar para cargar productos de prueba.
function CarritoPrueba() {
    const { agregar } = useCarrito();
    
    return (
        <>
            <button onClick={() => agregar(muffinChocolate)}>
                Agregar muffin
            </button>
            
            <button onClick={() => agregar(tortaSelvaNegra)}>
                Agregar torta
            </button>
            
            <Carrito />
        </>
    );
}

function renderCarrito() {
    return render(
        <CarritoProvider>
        <CarritoPrueba />
        </CarritoProvider>,
    );
}

describe('Carrito', () => {
    it('muestra un mensaje cuando el carrito está vacío', () => {
        renderCarrito();
        
        expect(screen.getByText(/carrito vacío/i)).toBeInTheDocument();
    });
    
    it('muestra los productos agregados', async () => {
        const user = userEvent.setup();
        renderCarrito();
        
        await user.click(screen.getByRole('button', { name: 'Agregar muffin' }));
        
        expect(screen.getByText('Muffin de chocolate')).toBeInTheDocument();
        expect(screen.getAllByText(/2\.500/)).toHaveLength(3);
    });
    
    it('permite incrementar la cantidad de un producto', async () => {
        const user = userEvent.setup();
        renderCarrito();
        
        await user.click(screen.getByRole('button', { name: 'Agregar muffin' }));
        
        await user.click(
            screen.getByRole('button', {
            name: 'Aumentar cantidad de Muffin de chocolate',
        }),
        );
        
        expect(screen.getByText('2')).toBeInTheDocument();
    });
    
    it('permite decrementar la cantidad de un producto', async () => {
        const user = userEvent.setup();
        renderCarrito();
        
        await user.click(screen.getByRole('button', { name: 'Agregar muffin' }));
        await user.click(screen.getByRole('button', { name: 'Agregar muffin' }));
        
        await user.click(
            screen.getByRole('button', {
            name: 'Disminuir cantidad de Muffin de chocolate',
        }),
        );
        
        expect(screen.getByText('1')).toBeInTheDocument();
    });
    
    it('permite quitar un producto del carrito', async () => {
        const user = userEvent.setup();
        renderCarrito();
        
        await user.click(screen.getByRole('button', { name: 'Agregar muffin' }));
        
        await user.click(
            screen.getByRole('button', {
            name: 'Quitar Muffin de chocolate',
        }),
    );
    
        expect(screen.queryByText('Muffin de chocolate')).not.toBeInTheDocument();
        expect(screen.getByText(/carrito vacío/i)).toBeInTheDocument();
    });
    
    it('calcula el total según las cantidades de los productos', async () => {
        const user = userEvent.setup();
        renderCarrito();
        
        await user.click(screen.getByRole('button', { name: 'Agregar muffin' }));
        await user.click(screen.getByRole('button', { name: 'Agregar muffin' }));
        await user.click(screen.getByRole('button', { name: 'Agregar torta' }));
        
        
        expect(screen.getByText(/9\.200/)).toBeInTheDocument();
    });
});