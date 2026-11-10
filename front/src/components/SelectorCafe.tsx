import { useState } from 'react';
import type { Producto } from '../schemas/producto';
import {
  ETIQUETAS_ORIGEN,
  ETIQUETAS_TAMANIO,
  ETIQUETAS_TIPO,
  ORIGENES,
  TAMANIOS,
  TIPOS,
  buscarCafe,
  preciosPorOrigen,
  type Cafe,
  type Origen,
  type Tamanio,
  type TipoCafe,
} from '../utils/catalogo';
import { formatearPrecio } from '../utils/formatearPrecio';

type OpcionProps = {
  name: string;
  valor: string;
  etiqueta: string;
  detalle?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
};

function Opcion({ name, valor, etiqueta, detalle, checked, disabled, onChange }: OpcionProps) {
  const id = `${name}-${valor}`;
  return (
    <>
      <input
        type="radio"
        className="btn-check"
        name={name}
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <label className="btn btn-outline-primary" htmlFor={id}>
        {etiqueta}
        {detalle && <span className="d-block small"> {detalle}</span>}
      </label>
    </>
  );
}

type Props = {
  productos: Producto[];
  onAgregar: (cafe: Cafe) => void;
};

export function SelectorCafe({ productos, onAgregar }: Props) {
  const [tipo, setTipo] = useState<TipoCafe>();
  const [tamanio, setTamanio] = useState<Tamanio>();
  const [origen, setOrigen] = useState<Origen>();

  const precios = tipo && tamanio ? preciosPorOrigen(productos, tipo, tamanio) : {};
  const cafe = tipo && tamanio && origen ? buscarCafe(productos, tipo, tamanio, origen) : undefined;

  const agregar = () => {
    if (!cafe) return;
    onAgregar(cafe);
    setTipo(undefined);
    setTamanio(undefined);
    setOrigen(undefined);
  };

  return (
    <section aria-label="Armá tu café">
      <fieldset className="mb-3">
        <legend className="h6">1. Bebida</legend>
        <div className="d-flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <Opcion
              key={t}
              name="bebida"
              valor={t}
              etiqueta={ETIQUETAS_TIPO[t]}
              checked={tipo === t}
              onChange={() => setTipo(t)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-3">
        <legend className="h6">2. Tamaño</legend>
        <div className="d-flex flex-wrap gap-2">
          {TAMANIOS.map((t) => (
            <Opcion
              key={t}
              name="tamanio"
              valor={t}
              etiqueta={ETIQUETAS_TAMANIO[t]}
              checked={tamanio === t}
              disabled={!tipo}
              onChange={() => setTamanio(t)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-3">
        <legend className="h6">3. Origen</legend>
        <div className="d-flex flex-wrap gap-2">
          {ORIGENES.map((o) => {
            const precio = precios[o];
            return (
              <Opcion
                key={o}
                name="origen"
                valor={o}
                etiqueta={ETIQUETAS_ORIGEN[o]}
                detalle={precio === undefined ? undefined : formatearPrecio(precio)}
                checked={origen === o}
                disabled={precio === undefined}
                onChange={() => setOrigen(o)}
              />
            );
          })}
        </div>
      </fieldset>

      <button type="button" className="btn btn-primary" disabled={!cafe} onClick={agregar}>
        Agregar al pedido
      </button>
    </section>
  );
}