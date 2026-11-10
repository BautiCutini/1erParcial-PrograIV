import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { cafeBrasilPocillo, muffinChocolate } from './fixtures';

export const productosMock = [cafeBrasilPocillo, muffinChocolate];

export const server = setupServer(
  http.get('*/productos', () => HttpResponse.json(productosMock)),
);