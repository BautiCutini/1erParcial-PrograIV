import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectorCafe } from '../components/SelectorCafe';
import { cafeColombiaPocillo, catalogoPrueba } from './fixtures';

const elegir = (nombre: string | RegExp) =>
  userEvent.click(screen.getByRole('radio', { name: nombre }));

const botonAgregar = () => screen.getByRole('button', { name: 'Agregar al pedido' });

const renderizar = (onAgregar = vi.fn()) => {
  render(<SelectorCafe productos={catalogoPrueba} onAgregar={onAgregar} />);
  return onAgregar;
};

describe('SelectorCafe', () => {
  it('arranca con el botón Agregar deshabilitado', () => {
    renderizar();

    expect(botonAgregar()).toBeDisabled();
  });

  it('el tamaño y el origen quedan deshabilitados hasta elegir el paso anterior', async () => {
    renderizar();

    expect(screen.getByRole('radio', { name: 'Pocillo' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: /Brasil/ })).toBeDisabled();

    await elegir('Expreso');
    expect(screen.getByRole('radio', { name: 'Pocillo' })).toBeEnabled();
    expect(screen.getByRole('radio', { name: /Brasil/ })).toBeDisabled();

    await elegir('Pocillo');
    expect(screen.getByRole('radio', { name: /Brasil/ })).toBeEnabled();
  });

  it('sigue deshabilitado si falta el origen', async () => {
    renderizar();

    await elegir('Expreso');
    await elegir('Pocillo');

    expect(botonAgregar()).toBeDisabled();
  });

  it('muestra el precio de cada origen al elegir bebida y tamaño', async () => {
    renderizar();

    await elegir('Expreso');
    await elegir('Pocillo');

    expect(screen.getByRole('radio', { name: /Brasil/ })).toHaveAccessibleName(/5\.020/);
    expect(screen.getByRole('radio', { name: /Colombia/ })).toHaveAccessibleName(/5\.740/);
    expect(screen.getByRole('radio', { name: /Etiopía/ })).toHaveAccessibleName(/6\.820/);
  });

  it('deshabilita los orígenes que no existen para esa bebida y tamaño', async () => {
    renderizar();

    await elegir('Filtrado');
    await elegir('Pocillo');

    expect(screen.getByRole('radio', { name: /Brasil/ })).toBeEnabled();
    expect(screen.getByRole('radio', { name: /Colombia/ })).toBeDisabled();
    expect(screen.getByRole('radio', { name: /Etiopía/ })).toBeDisabled();
  });

  it('se habilita al completar los tres pasos y agrega el café elegido', async () => {
    const onAgregar = renderizar();

    await elegir('Expreso');
    await elegir('Pocillo');
    await elegir(/Colombia/);
    expect(botonAgregar()).toBeEnabled();

    await userEvent.click(botonAgregar());

    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(cafeColombiaPocillo);
  });

  it('vuelve a deshabilitar el botón después de agregar', async () => {
    renderizar();

    await elegir('Expreso');
    await elegir('Pocillo');
    await elegir(/Colombia/);
    await userEvent.click(botonAgregar());

    expect(botonAgregar()).toBeDisabled();
  });
});