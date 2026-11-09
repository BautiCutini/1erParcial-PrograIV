export type TipoProducto = 'expreso' | 'filtrado' | 'pasteleria';

// Contrato que cumplen todos los productos de la cafetería.
export abstract class Producto {
  abstract readonly id: string;
  abstract readonly tipo: TipoProducto;
  abstract readonly nombre: string;
  abstract readonly precioBase: number;

  abstract calcularPrecio(): number;
}