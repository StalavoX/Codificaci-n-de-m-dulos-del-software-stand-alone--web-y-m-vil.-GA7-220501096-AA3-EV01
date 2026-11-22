// Definición de rutas del API REST para la entidad Cita
const express = require('express');
const router = express.Router();
const {
    obtenerCitas,
    crearCita,
    actualizarCita,
    eliminarCita
} = require('../controllers/citaController');

/**
 * Rutas para el recurso /api/citas
 */

// GET /api/citas - Obtiene todas las citas
router.get('/', obtenerCitas);

// POST /api/citas - Registra una nueva cita
router.post('/', crearCita);

// PUT /api/citas/:id - Actualiza los datos de una cita existente
router.put('/:id', actualizarCita);

// DELETE /api/citas/:id - Elimina una cita por su ID
router.delete('/:id', eliminarCita);

module.exports = router;
