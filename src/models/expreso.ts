import {Cafe, Tamano } from './cafe';

export class Expreso extends Cafe {
    readonly nombre = 'Expreso';
    readonly precioBase = 2500;

    protected readonly gramosPorTamano: Record<Tamano, number> = {
        pocillo: 18,
        mediano: 27,
        'taza grande': 36,
    };
}

