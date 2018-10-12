const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {
	const { body } = req;

	UsuarioModel.findOne({email: body.email}, (err, usuarioDB) => {
		if(err){
			return res.status(500).json({
				ok: false,
				err
			})
		}
		if(!usuarioDB){
			return res.status(400).json({
				ok: false,
				err:{
					message: 'Usuario o contraseña incorrecta'
				}
			})
		}
		if(!bcrypt.compareSync(body.password, usuarioDB.password)){
			return res.status(400).json({
				ok: false,
				err:{
					mensaje: 'Usuario o contraseña incorrecta'
				}
			})
		}
		const token = jwt.sign({
			usuario: usuarioDB
		}, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

		res.json({
			ok: true,
			usuario: usuarioDB,
			token
		})
	})
})


module.exports = app;