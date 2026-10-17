import type { Producto } from './producto';
import type { Variedad, Tamano } from './cafe';
import { Expreso } from './expreso';
import { Filtrado } from './filtrado';
import { Pasteleria } from './pasteleria';

const VARIEDADES: Variedad[] = ['Brasil', 'Colombia', 'Etiopia'];
const TAMANOS: Tamano[] = ['pocillo', 'mediano', 'taza grande'];

export class Catalogo {
  private readonly productos = new Map<string, Producto>();

  agregar(producto: Producto): void {
    this.productos.set(producto.id, producto);
  }

  listar(): Producto[] {
    return [...this.productos.values()];
  }

  buscar(id: string): Producto | undefined {
    return this.productos.get(id);
  }
}

export function crearCatalogo(): Catalogo {
  const catalogo = new Catalogo();

  for (const variedad of VARIEDADES) {
    for (const tamano of TAMANOS) {
      catalogo.agregar(new Expreso(variedad, tamano));
      catalogo.agregar(new Filtrado(variedad, tamano));
    }
  }

  catalogo.agregar(new Pasteleria('Muffin de chocolate', 2500));
  catalogo.agregar(new Pasteleria('Torta selva negra', 4200));

  return catalogo;
}