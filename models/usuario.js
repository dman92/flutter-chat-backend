const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    online: {
        type: Boolean,
        default: false,
    },

});

// Esta funcion se ejecuta cuando lo pasan al JSON, no se ven en el codigo
// pero es al responder en auth.js
UsuarioSchema.method('toJSON', function(){
    // Se extraen los valores que no queremos devolver
    const { __v, _id, password, ...object } = this.toObject();
    // Se añade un valor que queríamos renombrar
    object.uid = _id;
    return object;
}); 


module.exports = model('Usuario', UsuarioSchema ); //se utiliza en controller auth