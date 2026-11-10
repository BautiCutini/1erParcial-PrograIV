import { useCarrito } from '../context/CarritoContext';
import { formatearPrecio } from '../utils/formatearPrecio';

export function Carrito() {
    const { items, incrementar, decrementar, quitar } = useCarrito();
    
    const total = items.reduce(
        (acumulado, item) =>
        acumulado + item.producto.precio * item.cantidad,
        0,
    );
    
    if (items.length === 0) {
        return (
            <section>
                <h2>Carrito</h2>
                <p>Carrito vacío</p>
            </section>
        );
    }
    
    return (
        <section>
            <h2>Carrito</h2>
            
            {items.map((item) => (
                <article key={item.producto.id}>
                <h3>{item.producto.nombre}</h3>
                
                <p>Precio: {formatearPrecio(item.producto.precio)}</p>
                
                <div>
                <button
                    type="button"
                    aria-label={`Disminuir cantidad de ${item.producto.nombre}`}
                    onClick={() => decrementar(item.producto.id)}
                >
                -
                </button>
                
                <span>{item.cantidad}</span>
                
                <button
                    type="button"
                    aria-label={`Aumentar cantidad de ${item.producto.nombre}`}
                    onClick={() => incrementar(item.producto.id)}
                >
                +
                </button>
                </div>
                
                <p>
                Subtotal:{' '}
                {formatearPrecio(item.producto.precio * item.cantidad)}
                </p>
                
                <button
                    type="button"
                    aria-label={`Quitar ${item.producto.nombre}`}
                    onClick={() => quitar(item.producto.id)}
                >
                Quitar
                </button>
                </article>
            ))}
            
            <h3>Total: {formatearPrecio(total)}</h3>
        </section>
    );
}