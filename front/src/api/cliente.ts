import type { z } from 'zod';

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function get<T>(path: string, schema: z.ZodType<T>, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    const opciones: RequestInit = {};
    
    if (import.meta.env.MODE !== 'test' && signal) {
      opciones.signal = signal;
    }
    
    res = await fetch(new URL(path, window.location.origin), opciones);
    }  catch (e) {
    
    if (e instanceof DOMException && e.name === 'AbortError') throw e;
    throw new ApiError('No se pudo conectar con el servidor');
  }

  if (!res.ok) {
    throw new ApiError(`El servidor respondió con error ${res.status}`, res.status);
  }

  const json: unknown = await res.json().catch(() => {
    throw new ApiError('La respuesta del servidor no es JSON válido', res.status);
  });

  const resultado = schema.safeParse(json);
  if (!resultado.success) {
    throw new ApiError('La respuesta del servidor no tiene el formato esperado');
  }
  return resultado.data;
}