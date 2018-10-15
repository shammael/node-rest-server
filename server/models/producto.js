const mongoose = require('mongoose');

const Schema = mongoose.Schema;

productoSchema = new Schema({
	nombre: {type: String, required: [true, 'El nombre es necesario']},
	precioUni: {type: Number, required: [true, 'El precio unitario es requerido']},
	description: {required: false, type: String},
	disponible:{type: Boolean, default: true, required: false},
	categoria:{type: Schema.Types.ObjectId, ref: 'Categoria', required: true},
	usuario:{type: Schema.Types.ObjectId, ref: 'Usuario'}
})

module.exports = mongoose.model('Producto', productoSchema);