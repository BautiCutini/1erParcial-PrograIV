import {Cafe, Tamano } from './cafe';

export class Filtrado extends Cafe {
    readonly nombre = 'Filtrado';
    readonly precioBase = 3200;

    protected readonly gramosPorTamano: Record<Tamano, number> = {
        pocillo: 6,
        mediano: 15,
        'taza grande': 25,
    };
}

