import { useMenu } from '../hooks/useMenu';

const formatoPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export function Menu() {
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

  return (
    <ul className="list-group">
      {menu.productos.map((p) => (
        <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            {p.nombre}
            <small className="text-muted d-block">{p.id}</small>
          </div>
          <span className="fw-semibold">{formatoPrecio.format(p.precio)}</span>
        </li>
      ))}
    </ul>
  );
}