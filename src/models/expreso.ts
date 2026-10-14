export type Variedad = 'Brasil' | 'Colombia' | 'Etiopía' ;
export type Tamano = 'pocillo' | 'mediano' | 'taza grande' ;

const PRECIO_POR_GRAMO: Record<Variedad, number> = {
  Brasil: 140,
  Colombia: 180,
  Etiopia: 240,
};

const GRAMOS: Record<Tamano, number> = {
  pocillo: 18,
  mediano: 27,
  'taza grande': 36,
};

export class Expreso {
  readonly precioBase = 2500;

  constructor(
    private readonly variedad: Variedad,
    private readonly tamano: Tamano,
  ) {}

  calcularPrecio(): number {
    return this.precioBase + GRAMOS[this.tamano] * PRECIO_POR_GRAMO[this.variedad];
  }
}