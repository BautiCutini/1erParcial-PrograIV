import {Producto} from './producto';

export class Pasteleria extends Producto {
    constructor(
        public readonly nombre: string,
        public readonly precioBase: number,
    ) {
        super();
    }
    get id(): string {
        return this.nombre.toLowerCase().replaceAll(' ', '-');
    }

    calcularPrecio(): number {
        return this.precioBase;
    }
}

