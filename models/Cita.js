// Modelo de datos Mongoose para la entidad Cita del salón/spa Style Luna Azul
const mongoose = require('mongoose');

/**
 * Esquema de Mongoose que define los atributos, tipos de datos y reglas
 * de validación para las citas agendadas en Style Luna Azul.
 */
const CitaSchema = new mongoose.Schema(
    {
        nombreCliente: {
            type: String,
            required: [true, 'El nombre del cliente es un campo obligatorio.'],
            trim: true,
            minlength: [2, 'El nombre del cliente debe tener al menos 2 caracteres.'],
            maxlength: [100, 'El nombre del cliente no puede superar los 100 caracteres.']
        },
        servicio: {
            type: String,
            required: [true, 'El servicio a realizar es un campo obligatorio.'],
            trim: true,
            maxlength: [120, 'El servicio no puede superar los 120 caracteres.']
        },
        fechaCita: {
            type: String,
            required: [true, 'La fecha programada para la cita es obligatoria.'],
            match: [/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato YYYY-MM-DD.']
        },
        horaCita: {
            type: String,
            required: [true, 'La hora programada para la cita es obligatoria.'],
            match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'La hora debe tener el formato HH:MM.']
        },
        estado: {
            type: String,
            enum: {
                values: ['Pendiente', 'Confirmada', 'Cancelada', 'Completada'],
                message: 'El estado "{VALUE}" no es válido. Debe ser: Pendiente, Confirmada, Cancelada o Completada.'
            },
            default: 'Pendiente'
        }
    },
    {
        // Genera de forma automática los campos de auditoría createdAt y updatedAt
        timestamps: true
    }
);

// Definición del modelo en UpperCamelCase
const Cita = mongoose.model('Cita', CitaSchema);

module.exports = Cita;
