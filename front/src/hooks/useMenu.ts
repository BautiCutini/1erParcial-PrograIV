import { useCallback, useEffect, useState } from 'react';
import { obtenerMenu } from '../api/menu';
import { ApiError } from '../api/cliente';
import type { Producto } from '../schemas/producto';

type Estado =
  | { estado: 'cargando' }
  | { estado: 'error'; mensaje: string }
  | { estado: 'listo'; productos: Producto[] };

export function useMenu() {
  const [estado, setEstado] = useState<Estado>({ estado: 'cargando' });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    obtenerMenu(controller.signal)
      .then((productos) => {
        if (!controller.signal.aborted) setEstado({ estado: 'listo', productos });
      })
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        setEstado({
          estado: 'error',
          mensaje: e instanceof ApiError ? e.message : 'Ocurrió un error inesperado',
        });
      });

    return () => controller.abort();
  }, [intento]);

  const reintentar = useCallback(() => {
    setEstado({ estado: 'cargando' });
    setIntento((n) => n + 1);
  }, []);

  return { ...estado, reintentar };
}