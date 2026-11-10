import { Menu } from './components/Menu';
import { Carrito } from './components/Carrito';
import { CarritoProvider, useCarrito } from './context/CarritoContext';

function ContenidoApp() {
  const { agregar } = useCarrito();

  return (
    <>
      <header className="encabezado py-4 mb-4 shadow-sm">
        <div className="container">
          <h1 className="h2 mb-1">Cafetería Origen</h1>
          <p className="encabezado__subtitulo mb-0">
            Café de especialidad · Pedí desde tu mesa
          </p>
        </div>
      </header>

      <main className="container flex-grow-1 mb-4">
        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3 p-md-4">
            <Menu onAgregar={agregar} />
          </div>
        </section>

        <section className="card border-0 shadow-sm">
          <div className="card-body p-3 p-md-4">
            <Carrito />
          </div>
        </section>
      </main>

      <footer className="pie py-3 mt-auto">
        <div className="container text-center small">
          <p className="mb-0">
            Cafetería Origen · Colombia, Etiopía y Brasil en tu taza
          </p>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <CarritoProvider>
      <ContenidoApp />
    </CarritoProvider>
  );
}