const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

const rolesValues = {
	values: ['USER_ROLE', 'ADMIN_ROLE', 'SUPER_ADMIN'],
	message: '{VALUE} no es un role válido'
}

const usuarioSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es requerido']
	},
	email:{
		type: String,
		required: [true, 'El correo es requerido'],
		unique: true
	},
	password:{
		type: String,
		required: [true, 'La contraseña es requerido']
	},
	role:{
		type: String,
		default: 'USER_ROLE',
		enum: rolesValues
	},
	estado:{
		type: Boolean,
		default: true
	},
	google: {
		type: Boolean,
		default: false
	},
	img:{
		type: String,
		required: false
	}
});

usuarioSchema.methods.toJSON = function(){
	const userObject = this.toObject();
	delete userObject.password;
	return userObject;
}

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} no disponible'});

module.exports = mongoose.model('usuarios', usuarioSchema);