import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Menu } from '../components/Menu';
import { cafeBrasilPocillo, muffinChocolate } from './fixtures';

describe('Menu con selección de productos', () => {
  it('una vez cargado el menú permite agregar un pastel', async () => {
    const onAgregar = vi.fn();
    render(<Menu onAgregar={onAgregar} />);

    await userEvent.click(await screen.findByRole('button', { name: 'Agregar Muffin de chocolate' }));

    expect(onAgregar).toHaveBeenCalledWith(muffinChocolate);
  });

  it('una vez cargado el menú permite armar y agregar un café', async () => {
    const onAgregar = vi.fn();
    render(<Menu onAgregar={onAgregar} />);

    await userEvent.click(await screen.findByRole('radio', { name: 'Expreso' }));
    await userEvent.click(screen.getByRole('radio', { name: 'Pocillo' }));
    await userEvent.click(screen.getByRole('radio', { name: /Brasil/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Agregar al pedido' }));

    expect(onAgregar).toHaveBeenCalledWith(cafeBrasilPocillo);
  });
});