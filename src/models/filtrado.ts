export type Variedad = 'Brasil' | 'Colombia' | 'Etiopia' ;
export type Tamano = 'pocillo' | 'mediano' | 'taza grande' ;

const PRECIO_POR_GRAMO: Record<Variedad, number> = {
  Brasil: 140,
  Colombia: 180,
  Etiopia: 240,
};

const GRAMOS: Record<Tamano, number> = {
  pocillo: 6,
  mediano: 15,
  'taza grande': 25,
};

export class Filtrado {
  readonly precioBase = 3200;

  constructor(
    private readonly variedad: Variedad,
    private readonly tamano: Tamano,
  ) {}

  calcularPrecio(): number {
    return this.precioBase + GRAMOS[this.tamano] * PRECIO_POR_GRAMO[this.variedad];
  }
}