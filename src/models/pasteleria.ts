import {Producto} from './producto';
import {generarId} from '../utils/generar-id';

export class Pasteleria extends Producto {
    constructor(
        public readonly nombre: string,
        public readonly precioBase: number,
    ) {
        super();
    }
    get id(): string {
        return generarId(this.nombre);
    }

    calcularPrecio(): number {
        return this.precioBase;
    }
}

