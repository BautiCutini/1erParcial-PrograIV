
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from './server';

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
    
    
    it('muestra el botón para confirmar el pedido', async () => {
        const user = userEvent.setup();
        renderCarrito();
        
        await user.click(
            screen.getByRole('button', { name: 'Agregar muffin' }),
        );
        
        expect(
            screen.getByRole('button', { name: /confirmar pedido/i }),
        ).toBeInTheDocument();
    });

    it('confirma el pedido y vacía el carrito cuando el servidor responde correctamente', async () => {
        const user = userEvent.setup();
        let bodyRecibido: unknown;
        
        server.use(
            http.post('*/pedidos', async ({ request }) => {
                bodyRecibido = await request.json();
            
            return HttpResponse.json({
                id: 1,
                items: [
                    {
                        productoId: muffinChocolate.id,
                        cantidad: 1,
                        subtotal: 2500,
                    },
                ],
                estado: 'pendiente',
                total: 2500,
            }, { status: 201 });
        }),
    );
    
    renderCarrito();
    
    await user.click(
        screen.getByRole('button', { name: 'Agregar muffin' }),
    );
    
    await user.click(
        screen.getByRole('button', { name: /confirmar pedido/i }),
    );
    
    expect(
        await screen.findByText(/pedido.*1/i),
    ).toBeInTheDocument();
    
    expect(bodyRecibido).toEqual({
        items: [
            {
                productoId: muffinChocolate.id,
                cantidad: 1,
            },
        ],
    });
    
    expect(screen.getByText(/carrito vacío/i)).toBeInTheDocument();
    });
    
    it('conserva los productos cuando falla la confirmación', async () => {
        const user = userEvent.setup();
    
        server.use(
            http.post('*/pedidos', () => {
                return HttpResponse.json(
                    { error: 'Error del servidor' },
                    { status: 500 },
                );
            }),
        );
        
        renderCarrito();
        
        await user.click(
            screen.getByRole('button', { name: 'Agregar muffin' }),
        );
        
        await user.click(
            screen.getByRole('button', { name: /confirmar pedido/i }),
        );
        
        expect(
        await screen.findByText(/no se pudo confirmar el pedido/i),
        ).toBeInTheDocument();
        
        expect(
            screen.getByText('Muffin de chocolate'),
        ).toBeInTheDocument();
    

it('envía el número de mesa al confirmar el pedido', async () => {
    const user = userEvent.setup();
    let bodyRecibido: unknown;

    server.use(
        http.post('*/pedidos', async ({ request }) => {
            bodyRecibido = await request.json();

            return HttpResponse.json({
                id: 1,
                mesaId: 5,
                items: [
                    {
                        productoId: muffinChocolate.id,
                        cantidad: 1,
                        subtotal: 2500,
                    },
                ],
                estado: 'pendiente',
                total: 2500,
            }, { status: 201 });
        }),
    );

    renderCarrito();

    await user.click(
        screen.getByRole('button', { name: 'Agregar muffin' }),
    );

    await user.type(
        screen.getByLabelText(/número de mesa/i),
        '5',
    );

    await user.click(
        screen.getByRole('button', { name: /confirmar pedido/i }),
    );

    expect(bodyRecibido).toEqual({
        mesaId: 5,
        items: [
            {
                productoId: muffinChocolate.id,
                cantidad: 1,
            },
        ],
    });
});


    });
});