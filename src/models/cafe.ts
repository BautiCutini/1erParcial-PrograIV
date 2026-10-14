export type Variedad = 'Brasil' | 'Colombia' | 'Etiopia' ;
export type Tamano = 'pocillo' | 'mediano' | 'taza grande' ;

const PRECIO_POR_GRAMO: Record<Variedad, number> = {
  Brasil: 140,
  Colombia: 180,
  Etiopia: 240,
};

export abstract class Cafe {
    // cada hija tiene que definirlo
    abstract readonly precioBase: number;
    protected abstract readonly gramosPorTamano: Record<Tamano, number>;

    constructor(
        protected readonly variedad: Variedad,
        protected readonly tamano: Tamano,
    ) {}

    calcularPrecio(): number {
        return this.precioBase + this.gramosPorTamano[this.tamano] * PRECIO_POR_GRAMO[this.variedad];
    }
}