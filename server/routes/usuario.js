const express = require('express');
const bodyParser = require('body-parser');
const UsuarioModel = require('../models/usuario');
const _ = require('underscore');
const bcrypt = require('bcryptjs');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.get('/usuario', (req, res) => {
	const desde = Number(req.query.desde || 0);
	const limite = Number(req.query.limite || 5);
	UsuarioModel
		.find({estado: true}, 'nombre email estado role img google')
		.limit(limite)
		.skip(desde)
		.exec((err, usuarios) => {
			if(err){
				return res.status(400).json({
					ok: false,
					err
				})
			}
			UsuarioModel
				.countDocuments({estado: true}, (err, conteo) => {
					res.json({
						usuarios,
						cuantos: conteo
				})
			})
		});
});

app.post('/usuario', (req, res) => {
	const {body} = req;
	const usuario = new UsuarioModel({
		nombre: body.nombre,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		role: body.role
	});
	usuario.save((err, usuarioDB) => {
		if(err){
			return res.status(400).json({
				ok: false,
				err
			})
		}
		res.json({
			ok: true,
			usuario: usuarioDB
		});
	})
});

app.put('/usuario/:id', (req, res) => {
	const { id } = req.params;
	const body = _.pick(req.body, ['nombre', 'email', 'role', 'img', 'estado']);
	UsuarioModel.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
		if(err){
			return res.status(400).json({
				ok: false,
				err
			})
		}
		res.json({
			ok: true,
			usuario: usuarioDB
		})
	})
});

app.delete('/usuario/:id', (req, res) => {
	const { id } = req.params;
	const body = {
		estado: false
	}
	UsuarioModel.findOneAndUpdate(id, body, {new: true}, (err, usuarioBorrado) => {
		if(err){
			return res.json({
				ok: false,
				err
			})
		}
		if(usuarioBorrado === null){
			return res.json({
				ok: false,
				message: 'Usuario no encontrado'
			})
		}
		res.json({
			ok: true,
			usuario: usuarioBorrado
		})
	})
})

module.exports = app;