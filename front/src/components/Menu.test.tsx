import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../test/server';
import { Menu } from './Menu';

describe('Menu', () => {
  it('muestra "cargando" y después los productos', async () => {
    render(<Menu />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(await screen.findByText('Muffin de chocolate')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('muestra error si el servidor responde 500', async () => {
    server.use(http.get('*/productos', () => new HttpResponse(null, { status: 500 })));

    render(<Menu />);

    expect(await screen.findByRole('alert')).toHaveTextContent('500');
  });

  it('muestra error si no hay conexión', async () => {
    server.use(http.get('*/productos', () => HttpResponse.error()));

    render(<Menu />);

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar');
  });

  it('muestra error si la respuesta no cumple el esquema Zod', async () => {
    server.use(http.get('*/productos', () => HttpResponse.json([{ id: 'x', nombre: 'Algo' }])));

    render(<Menu />);

    expect(await screen.findByRole('alert')).toHaveTextContent('formato esperado');
  });

  it('reintenta y carga el menú después de un error', async () => {
    server.use(
      http.get('*/productos', () => new HttpResponse(null, { status: 500 }), { once: true }),
    );

    render(<Menu />);
    await userEvent.click(await screen.findByRole('button', { name: 'Reintentar' }));

    expect(await screen.findByText('Muffin de chocolate')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});