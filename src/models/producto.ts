export type TipoProducto = 'expreso' | 'filtrado' | 'pasteleria';

// lo que la api muestra de cualquier producto
export interface DatosProducto {
  id: string;
  tipo: TipoProducto;
  nombre: string;
  precio: number;
}

// contrato que cumplen todos los productos de la cafeteria
export abstract class Producto {
  abstract readonly id: string;
  abstract readonly tipo: TipoProducto;
  abstract readonly nombre: string;
  abstract readonly precioBase: number;

  abstract calcularPrecio(): number;

  // cada producto sabe describirse. las subclases pueden sumar sus propios datos
  describir(): DatosProducto {
    return {
      id: this.id,
      tipo: this.tipo,
      nombre: this.nombre,
      precio: this.calcularPrecio(),
    };
  }
}