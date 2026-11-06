import { z } from 'zod';

export const ProductoSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1),
  precio: z.number().nonnegative(),
});

export const MenuSchema = z.array(ProductoSchema);

export type Producto = z.infer<typeof ProductoSchema>;