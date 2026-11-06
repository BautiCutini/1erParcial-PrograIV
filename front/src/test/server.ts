import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const productosMock = [
  { id: 'expreso-pocillo-brasil', nombre: 'Expreso', precio: 5020 },
  { id: 'muffin-de-chocolate', nombre: 'Muffin de chocolate', precio: 2500 },
];

export const server = setupServer(
  http.get('*/productos', () => HttpResponse.json(productosMock)),
);