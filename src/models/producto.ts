export abstract class Producto {
    abstract readonly id: string;
    abstract readonly nombre: string;
    abstract readonly precioBase: number;
    
    abstract calcularPrecio(): number;
}