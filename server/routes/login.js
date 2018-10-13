const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

//Configuración de google
const verify = async token => {
	const ticket = await client.verifyIdToken({
    	idToken: token,
      	audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  	});
  	const payload = ticket.getPayload();
  	return {
  		nombre: payload.name,
  		email: payload.email,
  		img: payload.picture,
  		google: true
  	}
}

app.post('/google', async (req, res) => {
	const {idtoken} = req.body;
	console.log(idtoken);
	const googleUser = await verify(idtoken)
						.catch(e => res.status(403).json({
							ok: false,
							err: e
						}));
	UsuarioModel.findOne({email: googleUser.email}, (err, usuarioDB) => {
		if(err){
			return res.status(500).json({
				ok: false,
				err :{
					message: ' Error idiota'
				}
			})
		}
		if(usuarioDB){
			if(usuarioDB.google === false){
				return res.status(400).json({
					ok: false,
					err: {
						message: 'Debes registrarse con tus credeciales normales'
					}
				})
			}
			else{
				const token = jwt.sign({
					usuario: usuarioDB
				}, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});
				return res.json({
					ok: true,
					usuario: usuarioDB,
					token
				})
			}
		}
		else{
			//Si el usuario no existe en nuestra base de datos
			const usuario = new UsuarioModel({
				nombre: googleUser.nombre,
				email: googleUser.email,
				password: ':)',
				google: true,
				img: googleUser.img
			});

			usuario.save((err, usuarioDB) => {
				if(err){
					return res.status(500).json({
						ok: false,
						err
					})
				}
				const token = jwt.sign({
					usuario: usuarioDB
				}, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});
				return res.json({
					ok: true,
					usuario: usuarioDB,
					token
				})
			})
		}
	})
})


module.exports = app;