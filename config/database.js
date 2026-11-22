// Módulo de configuración y conexión a la base de datos MongoDB usando Mongoose
const mongoose = require('mongoose');

/**
 * Función asíncrona para establecer la conexión con MongoDB.
 * Utiliza la cadena de conexión provista en process.env.MONGODB_URI.
 */
const conectarBaseDatos = async () => {
    const uriConexion = process.env.MONGODB_URI;

    if (!uriConexion) {
        throw new Error('MONGODB_URI no está configurada.');
    }

    await mongoose.connect(uriConexion);
    console.log('Conexión establecida con MongoDB.');
};

module.exports = conectarBaseDatos;
