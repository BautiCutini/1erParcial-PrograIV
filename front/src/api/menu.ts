import { get } from './cliente';
import { MenuSchema } from '../schemas/producto';

export const obtenerMenu = (signal?: AbortSignal) => get('/productos', MenuSchema, signal);