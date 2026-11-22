const test = require('node:test');
const assert = require('node:assert/strict');
const Cita = require('../models/Cita');

test('valida una cita completa', () => {
    const cita = new Cita({
        nombreCliente: 'Laura Gómez',
        servicio: 'Corte de Cabello y Estilo',
        fechaCita: '2026-12-01',
        horaCita: '10:30',
        estado: 'Pendiente'
    });

    const error = cita.validateSync();
    assert.equal(error, undefined);
});

test('rechaza campos obligatorios ausentes', () => {
    const cita = new Cita({});
    const error = cita.validateSync();

    assert.equal(error.errors.nombreCliente.kind, 'required');
    assert.equal(error.errors.servicio.kind, 'required');
    assert.equal(error.errors.fechaCita.kind, 'required');
    assert.equal(error.errors.horaCita.kind, 'required');
});

test('rechaza fecha y hora con formatos inválidos', () => {
    const cita = new Cita({
        nombreCliente: 'Laura Gómez',
        servicio: 'Corte de Cabello y Estilo',
        fechaCita: '01-12-2026',
        horaCita: '25:99'
    });

    const error = cita.validateSync();

    assert.equal(error.errors.fechaCita.kind, 'regexp');
    assert.equal(error.errors.horaCita.kind, 'regexp');
});
