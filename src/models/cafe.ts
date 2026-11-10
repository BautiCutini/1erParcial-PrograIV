import { Producto, type DatosProducto } from './producto';
import { generarId } from '../utils/generar-id';

export type Variedad = 'Brasil' | 'Colombia' | 'Etiopia';
export type Tamano = 'pocillo' | 'mediano' | 'taza grande';

// el precio por gramo depende solo de la variedad, es igual en todas las maquinas
const PRECIO_POR_GRAMO: Record<Variedad, number> = {
  Brasil: 140,
  Colombia: 180,
  Etiopia: 240,
};

const DESCRIPCION_POR_VARIEDAD: Record<Variedad, string> = {
  Brasil: 'Acidez baja, cuerpo intenso y notas a chocolate y frutos secos',
  Colombia: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
  Etiopia: 'Acidez alta, cuerpo ligero y notas frutales y florales',
};

// lo que la API muestra de un cafe, ademas de los datos de cualquier producto
export interface DatosCafe extends DatosProducto {
  tamanio: Tamano;
  gramosCafe: number;
  variedad: { nombre: Variedad; descripcion: string };
}

export abstract class Cafe extends Producto {
  // lo que cambia según la maquina, cada hija tiene que definirlo
  protected abstract readonly gramosPorTamano: Record<Tamano, number>;

  constructor(
    protected readonly variedad: Variedad,
    protected readonly tamano: Tamano,
  ) {
    super();
  }

  // es un getter (y no se arma en el constructor) porque "nombre" lo define la
  // clase hija, y todavia no existe cuando corre el constructor del padre
  get id(): string {
    return generarId(this.nombre, this.tamano, this.variedad);
  }

  calcularPrecio(): number {
    return this.precioBase + this.gramosPorTamano[this.tamano] * PRECIO_POR_GRAMO[this.variedad];
  }

  // suma a los datos de cualquier producto los que solo tiene un cafe
  override describir(): DatosCafe {
    return {
      ...super.describir(),
      tamanio: this.tamano,
      gramosCafe: this.gramosPorTamano[this.tamano],
      variedad: {
        nombre: this.variedad,
        descripcion: DESCRIPCION_POR_VARIEDAD[this.variedad],
      },
    };
  }
}