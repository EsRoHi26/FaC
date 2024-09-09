const mongoose = require('mongoose');

const esquemaProyecto = mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        auto: true
    },
    codigoP: {
        type: String,
        required: true
    },
    correoResponsable: {
        type: String,
        required: true
    },
    pName: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    objetivoF: {
        type: Number, 
        required: true
    },
    montoReca: {
        type: Number, 
        required: true
    },
    fechaLimite: {
        type: Date, 
        required: true
    },
    categoriaP: {
        type: String,
        required: true
    },
    mediaItems: {
        type: [String], 
        required: true
    },
    donaciones: {
        type: [String], 
        required: true
    }
});

module.exports = mongoose.model('Proyecto', esquemaProyecto);
