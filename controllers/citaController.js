// Controlador para la gestión de citas de Style Luna Azul
const mongoose = require('mongoose');
const Cita = require('../models/Cita');

/**
 * Obtiene todas las citas registradas en la base de datos.
 * Código HTTP de éxito: 200 OK.
 * Código HTTP de error: 500 Internal Server Error.
 */
const obtenerCitas = async (solicitud, respuesta) => {
    try {
        // Consultar todas las citas ordenadas descendentemente por fecha de creación
        const listaCitas = await Cita.find().sort({ createdAt: -1 });

        return respuesta.status(200).json({
            exito: true,
            total: listaCitas.length,
            datos: listaCitas
        });
    } catch (error) {
        console.error('Error al obtener la lista de citas:', error);
        return respuesta.status(500).json({
            exito: false,
            mensaje: 'Error interno en el servidor al intentar recuperar las citas.'
        });
    }
};

/**
 * Crea una nueva cita en la base de datos con los datos suministrados.
 * Código HTTP de éxito: 201 Created.
 * Código HTTP de validación: 400 Bad Request.
 * Código HTTP de error: 500 Internal Server Error.
 */
const crearCita = async (solicitud, respuesta) => {
    try {
        const { nombreCliente, servicio, fechaCita, horaCita, estado } = solicitud.body;

        // Validación inicial de campos obligatorios
        if (!nombreCliente || !servicio || !fechaCita || !horaCita) {
            return respuesta.status(400).json({
                exito: false,
                mensaje: 'Complete nombreCliente, servicio, fechaCita y horaCita.'
            });
        }

        // Creación de la nueva instancia del modelo Cita
        const nuevaCita = new Cita({
            nombreCliente,
            servicio,
            fechaCita,
            horaCita,
            estado: estado || 'Pendiente'
        });

        // Guardar el registro en la base de datos
        const citaGuardada = await nuevaCita.save();

        return respuesta.status(201).json({
            exito: true,
            mensaje: 'Cita agendada exitosamente para Style Luna Azul.',
            datos: citaGuardada
        });
    } catch (error) {
        console.error('Error al registrar la cita:', error);

        // Si es un error de validación de Mongoose, retornamos 400 Bad Request
        if (error.name === 'ValidationError') {
            return respuesta.status(400).json({
                exito: false,
                mensaje: 'Error de validación en los datos de la cita.'
            });
        }

        return respuesta.status(500).json({
            exito: false,
            mensaje: 'Error interno en el servidor al intentar registrar la cita.'
        });
    }
};

/**
 * Actualiza los datos de una cita existente mediante su identificador único (ID).
 * Código HTTP de éxito: 200 OK.
 * Código HTTP de validación: 400 Bad Request.
 * Código HTTP de no encontrado: 404 Not Found.
 * Código HTTP de error: 500 Internal Server Error.
 */
const actualizarCita = async (solicitud, respuesta) => {
    try {
        const { id } = solicitud.params;
        const camposPermitidos = ['nombreCliente', 'servicio', 'fechaCita', 'horaCita', 'estado'];
        const datosActualizacion = Object.fromEntries(
            Object.entries(solicitud.body || {}).filter(([campo]) => camposPermitidos.includes(campo))
        );

        if (Object.keys(datosActualizacion).length === 0) {
            return respuesta.status(400).json({
                exito: false,
                mensaje: 'No se proporcionaron campos válidos para actualizar.'
            });
        }

        // Validar si el ID recibido tiene la estructura correcta de un ObjectId de MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return respuesta.status(400).json({
                exito: false,
                mensaje: 'El identificador proporcionado no tiene un formato válido de MongoDB.'
            });
        }

        // Actualizar la cita y retornar el documento modificado con validadores activos
        const citaActualizada = await Cita.findByIdAndUpdate(
            id,
            datosActualizacion,
            { new: true, runValidators: true }
        );

        // Verificar si la cita existe en la base de datos
        if (!citaActualizada) {
            return respuesta.status(404).json({
                exito: false,
                mensaje: `No se encontró ninguna cita con el ID: ${id}`
            });
        }

        return respuesta.status(200).json({
            exito: true,
            mensaje: 'Cita actualizada exitosamente.',
            datos: citaActualizada
        });
    } catch (error) {
        console.error('Error al actualizar la cita:', error);

        if (error.name === 'ValidationError') {
            return respuesta.status(400).json({
                exito: false,
                mensaje: 'Error de validación al intentar actualizar la cita.'
            });
        }

        return respuesta.status(500).json({
            exito: false,
            mensaje: 'Error interno en el servidor al intentar actualizar la cita.'
        });
    }
};

/**
 * Elimina una cita de la base de datos según su identificador único (ID).
 * Código HTTP de éxito: 200 OK.
 * Código HTTP de validación: 400 Bad Request.
 * Código HTTP de no encontrado: 404 Not Found.
 * Código HTTP de error: 500 Internal Server Error.
 */
const eliminarCita = async (solicitud, respuesta) => {
    try {
        const { id } = solicitud.params;

        // Validar formato del ObjectId de MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return respuesta.status(400).json({
                exito: false,
                mensaje: 'El identificador proporcionado no tiene un formato válido de MongoDB.'
            });
        }

        // Buscar y eliminar el registro de la cita
        const citaEliminada = await Cita.findByIdAndDelete(id);

        if (!citaEliminada) {
            return respuesta.status(404).json({
                exito: false,
                mensaje: `No se encontró ninguna cita con el ID: ${id} para eliminar.`
            });
        }

        return respuesta.status(200).json({
            exito: true,
            mensaje: 'Cita eliminada correctamente del sistema.',
            datos: { id: citaEliminada._id }
        });
    } catch (error) {
        console.error('Error al eliminar la cita:', error);
        return respuesta.status(500).json({
            exito: false,
            mensaje: 'Error interno en el servidor al intentar eliminar la cita.'
        });
    }
};

module.exports = {
    obtenerCitas,
    crearCita,
    actualizarCita,
    eliminarCita
};
