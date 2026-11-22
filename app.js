// Archivo principal de la aplicación: configuración de Express y servidor HTTP
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const conectarBaseDatos = require('./config/database');
const citaRutas = require('./routes/citaRoutes');

// Inicialización de la aplicación Express
const app = express();

// Puerto de ejecución del servidor
const puerto = process.env.PORT || 3000;

// Configuración de Middlewares globales
const origenPermitido = process.env.CORS_ORIGIN;
app.use(cors(origenPermitido ? { origin: origenPermitido } : {}));
app.use(morgan('dev')); // Registro de peticiones HTTP en consola
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));

// Servir archivos estáticos del cliente (frontend) desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Registro de las rutas de la API REST
app.use('/api/citas', citaRutas);

// Ruta de diagnóstico del servicio
app.get('/api/estado', (solicitud, respuesta) => {
    return respuesta.status(200).json({
        exito: true,
        mensaje: 'Servicio Web de Style Luna Azul en funcionamiento.',
        fechaHora: new Date().toISOString()
    });
});

// Middleware para manejo de rutas no encontradas (404)
app.use((solicitud, respuesta) => {
    return respuesta.status(404).json({
        exito: false,
        mensaje: 'La ruta solicitada no fue encontrada en este servidor.'
    });
});

// Manejo centralizado de errores inesperados
app.use((error, solicitud, respuesta, siguiente) => {
    if (respuesta.headersSent) {
        return siguiente(error);
    }

    console.error('Error inesperado:', error);
    return respuesta.status(500).json({
        exito: false,
        mensaje: 'Error interno del servidor.'
    });
});

const iniciarServidor = async () => {
    try {
        await conectarBaseDatos();
        app.listen(puerto, () => {
            console.log(`Servidor iniciado en http://localhost:${puerto}`);
            console.log(`API disponible en http://localhost:${puerto}/api/citas`);
        });
    } catch (error) {
        console.error('No fue posible iniciar el servidor:', error.message);
        process.exitCode = 1;
    }
};

if (require.main === module) {
    iniciarServidor();
}

module.exports = app;
