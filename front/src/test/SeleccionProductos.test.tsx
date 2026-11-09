import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SeleccionProductos } from '../components/SeleccionProductos';
import { cafeColombiaPocillo, catalogoPrueba, tortaSelvaNegra } from './fixtures';

const renderizar = (onAgregar = vi.fn()) => {
  render(<SeleccionProductos productos={catalogoPrueba} onAgregar={onAgregar} />);
  return onAgregar;
};

describe('SeleccionProductos', () => {
  it('muestra la sección de café y la de pastelería', () => {
    renderizar();

    expect(screen.getByRole('heading', { name: 'Café' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pastelería' })).toBeInTheDocument();
  });

  it('avisa con el café armado cuando se agrega', async () => {
    const onAgregar = renderizar();

    await userEvent.click(screen.getByRole('radio', { name: 'Expreso' }));
    await userEvent.click(screen.getByRole('radio', { name: 'Pocillo' }));
    await userEvent.click(screen.getByRole('radio', { name: /Colombia/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Agregar al pedido' }));

    expect(onAgregar).toHaveBeenCalledWith(cafeColombiaPocillo);
  });

  it('avisa con el pastel elegido cuando se agrega', async () => {
    const onAgregar = renderizar();

    await userEvent.click(screen.getByRole('button', { name: 'Agregar Torta selva negra' }));

    expect(onAgregar).toHaveBeenCalledWith(tortaSelvaNegra);
  });
});