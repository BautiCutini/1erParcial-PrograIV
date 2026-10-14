import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

// test de humo para confirmar que Vitest, supertest y la app están bien conectados

describe('app', () => {
  it('responde 404 en una ruta que no existe', async () => {
    const res = await request(app).get('/ruta-inexistente');
    expect(res.status).toBe(404);
  });
});