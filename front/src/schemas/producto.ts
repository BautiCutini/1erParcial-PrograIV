import { z } from 'zod';

const camposComunes = {
  id: z.string().min(1),
  nombre: z.string().min(1),
  precio: z.number().nonnegative(),
};

const CafeSchema = z.object({
  ...camposComunes,
  tipo: z.enum(['expreso', 'filtrado']),
  tamanio: z.enum(['pocillo', 'mediano', 'taza grande']),
  gramosCafe: z.number().positive(),
  variedad: z.object({
    nombre: z.enum(['Brasil', 'Colombia', 'Etiopia']),
    descripcion: z.string(),
  }),
});

const PasteleriaSchema = z.object({
  ...camposComunes,
  tipo: z.literal('pasteleria'),
});

export const ProductoSchema = z.discriminatedUnion('tipo', [CafeSchema, PasteleriaSchema]);

export const MenuSchema = z.array(ProductoSchema);

export type Producto = z.infer<typeof ProductoSchema>;