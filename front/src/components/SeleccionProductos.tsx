import type { Producto } from '../schemas/producto';
import { ListaPasteleria } from './ListaPasteleria';
import { SelectorCafe } from './SelectorCafe';

type Props = {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
};

export function SeleccionProductos({ productos, onAgregar }: Props) {
  return (
    <div className="row g-4">
      <div className="col-12 col-md-7">
        <h2 className="h4">Café</h2>
        <SelectorCafe productos={productos} onAgregar={onAgregar} />
      </div>
      <div className="col-12 col-md-5">
        <h2 className="h4">Pastelería</h2>
        <ListaPasteleria productos={productos} onAgregar={onAgregar} />
      </div>
    </div>
  );
}