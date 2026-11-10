import type { Producto } from '../schemas/producto';
import { esPasteleria, type Pasteleria } from '../utils/catalogo';
import { formatearPrecio } from '../utils/formatearPrecio';

type Props = {
  productos: Producto[];
  onAgregar: (pastel: Pasteleria) => void;
};

export function ListaPasteleria({ productos, onAgregar }: Props) {
  const pasteles = productos.filter(esPasteleria);

  if (pasteles.length === 0) {
    return <p className="text-muted">No hay pastelería disponible hoy.</p>;
  }

  return (
    <ul className="list-group" aria-label="Pastelería">
      {pasteles.map((pastel) => (
        <li
          key={pastel.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            {pastel.nombre}
            <small className="text-muted d-block">{formatearPrecio(pastel.precio)}</small>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            aria-label={`Agregar ${pastel.nombre}`}
            onClick={() => onAgregar(pastel)}
          >
            Agregar
          </button>
        </li>
      ))}
    </ul>
  );
}