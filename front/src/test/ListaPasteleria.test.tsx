import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ListaPasteleria } from '../components/ListaPasteleria';
import { cafeBrasilPocillo, catalogoPrueba, muffinChocolate, tortaSelvaNegra } from './fixtures';

describe('ListaPasteleria', () => {
  it('muestra cada pastel con su nombre y su precio', () => {
    render(<ListaPasteleria productos={catalogoPrueba} onAgregar={vi.fn()} />);

    expect(screen.getByText('Muffin de chocolate')).toBeInTheDocument();
    expect(screen.getByText(/2\.500/)).toBeInTheDocument();
    expect(screen.getByText('Torta selva negra')).toBeInTheDocument();
    expect(screen.getByText(/4\.200/)).toBeInTheDocument();
  });

  it('no muestra los cafés', () => {
    render(<ListaPasteleria productos={catalogoPrueba} onAgregar={vi.fn()} />);

    expect(screen.queryByText('Expreso')).not.toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('agrega el pastel elegido al hacer click en su botón', async () => {
    const onAgregar = vi.fn();
    render(<ListaPasteleria productos={catalogoPrueba} onAgregar={onAgregar} />);

    await userEvent.click(screen.getByRole('button', { name: 'Agregar Torta selva negra' }));

    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(tortaSelvaNegra);
  });

  it('cada botón agrega solo su pastel', async () => {
    const onAgregar = vi.fn();
    render(<ListaPasteleria productos={[muffinChocolate, tortaSelvaNegra]} onAgregar={onAgregar} />);

    await userEvent.click(screen.getByRole('button', { name: 'Agregar Muffin de chocolate' }));

    expect(onAgregar).toHaveBeenCalledWith(muffinChocolate);
  });

  it('avisa si no hay pastelería disponible', () => {
    render(<ListaPasteleria productos={[cafeBrasilPocillo]} onAgregar={vi.fn()} />);

    expect(screen.getByText('No hay pastelería disponible hoy.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});