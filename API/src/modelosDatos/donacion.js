const mongoose = require('mongoose');

const esquemaDonacion = mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        auto: true // Para que se genere automáticamente el ObjectId
    },
    monto: {
        type: Number, // Cambiado a Number para coincidir con el tipo de datos original
        required: true
    },
    correoDonante: {
        type: String,
        required: true
    },
    nombreDonante: {
        type: String,
        required: true
    },
    telefonoDonante: {
        type: String,
        required: true
    },
    proyectoId: {
        type: String,
        required: true
    },
    nombreProyecto: {
        type: String,
        required: true
    },
    fechaDonacion: {
        type: Date, // Cambiado a Date para manejar correctamente la fecha
        required: true
    }
});

module.exports = mongoose.model('Donacion', esquemaDonacion);
