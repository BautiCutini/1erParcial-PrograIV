
import { useState } from 'react';
import { useCarrito } from '../context/CarritoContext';
import { formatearPrecio } from '../utils/formatearPrecio';
import { crearPedido } from '../api/pedidos';

export function Carrito() {
    const { items, incrementar, decrementar, quitar, vaciar } = useCarrito();
    
    const [pedidoId, setPedidoId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cargando, setCargando] = useState(false);
    const [mesaId, setMesaId] = useState('');
    const total = items.reduce(
        (acumulado, item) =>
            acumulado + item.producto.precio * item.cantidad,
        0,
    );
    
    const confirmarPedido = async () => {
        setError(null);
        setCargando(true);
        
        try {
            const pedido = await crearPedido({
                mesaId: Number(mesaId),
                items: items.map((item) => ({
                productoId: item.producto.id,
                cantidad: item.cantidad,
            })),
            });
            
            setPedidoId(pedido.id);
            vaciar();
        } catch (error) {
            console.error('Error al confirmar pedido:', error);
            setError('No se pudo confirmar el pedido. Intentá nuevamente.');
        } finally {
            setCargando(false);
        }
    };
    
    return (
        <section>
            <h2>Carrito</h2>
            
            {pedidoId !== null && (
                <p role="status">
                    ¡Pedido {pedidoId} confirmado correctamente!
                </p>
            )}
            
            {error && (
                <p role="alert">{error}</p>
            )}
            
            {items.length === 0 ? (
                <p>Carrito vacío</p>
            ) : (
                <>
                    {items.map((item) => (
                        <article key={item.producto.id}>
                            <h3>{item.producto.nombre}</h3>
                            
                            <p>
                                Precio: {formatearPrecio(item.producto.precio)}
                            </p>
                            
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
                                {formatearPrecio(
                                    item.producto.precio * item.cantidad,
                                )}
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
                    <div>
                    <label htmlFor="mesaId">Número de mesa</label>
                    <input
                        id="mesaId"
                        type="number"
                        min="1"
                        value={mesaId}
                        onChange={(e) => setMesaId(e.target.value)}
                        placeholder="Ingresá tu número de mesa"
                    />
                    </div>
                    
                    <button
                        type="button"
                        onClick={confirmarPedido}
                        disabled={cargando || !mesaId || Number(mesaId) <= 0}
                    >
                        {cargando ? 'Confirmando...' : 'Confirmar pedido'}
                    </button>
                </>
            )}
        </section>
    );
}