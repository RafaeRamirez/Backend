import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { HttpError } from '../errors/http-error';
import { TaskService } from './task.service';

describe('TaskService CRUD', () => {
  let service: TaskService;

  beforeEach(() => {
    service = new TaskService(':memory:');
  });

  afterEach(() => {
    service.close();
  });

  it('crea y lista tareas', () => {
    const created = service.create({ title: 'Crear pruebas' });

    assert.equal(created.title, 'Crear pruebas');
    assert.equal(created.status, 'pending');
    assert.deepEqual(service.findAll(), [created]);
  });

  it('consulta una tarea por id', () => {
    const created = service.create({ title: 'Consultar tarea' });

    assert.deepEqual(service.findById(created.id), created);
  });

  it('actualiza una tarea', () => {
    const created = service.create({ title: 'Título inicial' });
    const updated = service.update(created.id, {
      title: 'Título actualizado',
      status: 'pending',
    });

    assert.equal(updated.title, 'Título actualizado');
    assert.deepEqual(service.findById(created.id), updated);
  });

  it('marca una tarea como completada', () => {
    const created = service.create({ title: 'Completar tarea' });
    const completed = service.complete(created.id);

    assert.equal(completed.status, 'completed');
    assert.equal(service.findById(created.id).status, 'completed');
  });

  it('elimina una tarea', () => {
    const created = service.create({ title: 'Eliminar tarea' });

    service.remove(created.id);

    assert.equal(service.findAll().length, 0);
    assert.throws(
      () => service.findById(created.id),
      (error: unknown) => error instanceof HttpError && error.statusCode === 404,
    );
  });
});
