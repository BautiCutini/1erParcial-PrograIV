import { useMenu } from '../hooks/useMenu';
import type { Producto } from '../schemas/producto';
import { SeleccionProductos } from './SeleccionProductos';

type Props = {
  onAgregar?: (producto: Producto) => void;
};

export function Menu({ onAgregar = () => {} }: Props) {
  const menu = useMenu();

  if (menu.estado === 'cargando') {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando menú…</span>
        </div>
      </div>
    );
  }

  if (menu.estado === 'error') {
    return (
      <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
        <span>{menu.mensaje}</span>
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={menu.reintentar}>
          Reintentar
        </button>
      </div>
    );
  }

  return <SeleccionProductos productos={menu.productos} onAgregar={onAgregar} />;
}