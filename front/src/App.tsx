import { Menu } from './components/Menu';

export default function App() {
  return (
    <>
      <header className="encabezado py-4 mb-4 shadow-sm">
        <div className="container">
          <h1 className="h2 mb-1">Cafetería Origen</h1>
          <p className="encabezado__subtitulo mb-0">Café de especialidad · Pedí desde tu mesa</p>
        </div>
      </header>

      <main className="container flex-grow-1 mb-4">
        <section className="card border-0 shadow-sm">
          <div className="card-body p-3 p-md-4">
            {/* Cuando exista el carrito, se conecta acá: <Menu onAgregar={agregarAlCarrito} /> */}
            <Menu />
          </div>
        </section>
      </main>

      <footer className="pie py-3 mt-auto">
        <div className="container text-center small">
          <p className="mb-0">Cafetería Origen · Colombia, Etiopía y Brasil en tu taza</p>
        </div>
      </footer>
    </>
  );
}