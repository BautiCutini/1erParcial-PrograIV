import { Menu } from './components/Menu';

export default function App() {
  return (
    <div className="container py-3">
      <header className="mb-4">
        <h1 className="h3 mb-0">Cafetería Origen</h1>
      </header>
      <main>
        {/* Cuando exista el carrito, se conecta acá: <Menu onAgregar={agregarAlCarrito} /> */}
        <Menu />
      </main>
    </div>
  );
}