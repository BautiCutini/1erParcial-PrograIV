import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import App from '../App';
import { server } from './server';
import { catalogoPrueba } from './fixtures';

describe('App', () => {
  it('muestra el encabezado y el menú cargado desde la API', async () => {
    server.use(http.get('*/productos', () => HttpResponse.json(catalogoPrueba)));

    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Cafetería Origen' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Café' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pastelería' })).toBeInTheDocument();
  });

  it('tiene un pie de página con el nombre de la cafetería', async () => {
    server.use(http.get('*/productos', () => HttpResponse.json(catalogoPrueba)));

    render(<App />);

    const pie = screen.getByRole('contentinfo');
    expect(within(pie).getByText(/Cafetería Origen/)).toBeInTheDocument();
    // Esperamos a que cargue el menú para que el test no termine con un request a medias.
    await screen.findByRole('heading', { name: 'Café' });
  });
});