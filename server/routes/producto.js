const express = require('express');
const {verificarToken} = require('../middlewares/authentication');
const ProductoModel = require('../models/producto.js');
const _ = require('underscore');
const app = express();

//Obtiene todos los productos
app.get('/productos', verificarToken, (req, res) => {
	//Trae todos los productos
	//populate usuario y categoria
	//paginado
	const limite = Number(req.query.limite) || 5;
	const desde = Number(req.query.desde) || 0;
	ProductoModel
		.find({disponible: true})
		.limit(limite)
		.skip(desde)
		.exec((err, productoDB) => {
			if(err){
				return res.status(500).json({
					ok: false,
					err
				})
			}

			if(!productoDB){
				return res.status(400).json({
					ok: false,
					err: {
						message: 'Producto no encontrado'
					}
				})
			}
			ProductoModel
				.countDocuments({disponible: true}, (err, conteo) => {
					res.json({
						ok: true,
						producto: productoDB,
						cuantos: conteo
					})
				})
		})
});

//Obtiene un producto a partir de un ID
app.get('/producto/:id', verificarToken, (req, res) => {
	const {id} = req.params;
	ProductoModel
		.find({_id: id, disponible: false})
		.populate('usuario', 'nombre email')
		.populate('categoria', 'description')
		.exec((err, productoDB) => {
			if(err){
				return res.status(500).json({
					ok: false,
					err
				})
			}

			if(!productoDB){
				return res.status(400).json({
					ok: false,
					err: {
						message: 'Producto no encontrado'
					}
				})
			}
			res.json({
				ok: true,
				producto: productoDB
			})
		})
});

app.get('/producto/buscar/:termino', verificarToken, (req, res) => {
	const { termino } = req.params;
	const regex = new RegExp(termino, 'i');
	ProductoModel
		.find({nombre: regex, disponible: true})
		.populate('usuario', 'nombre email')
		.populate('categoria', 'description')
		.exec((err, productoDB) => {
			if(err){
				return res.status(500).json({
					ok: false,
					err
				})
			}

			if(!productoDB){
				return res.status(400).json({
					ok: false,
					err: {
						message: 'Producto no encontrado'
					}
				})
			}
			res.json({
				ok: true,
				producto: productoDB
			})
		})
})

//Crear un nuevo producto
app.post('/producto', verificarToken, (req, res) => {
	//Grabar un usuario
	//Grabar la categoria
	const { body } = req;
	const producto = new ProductoModel({
		nombre: body.nombre,
		precioUni: body.precio,
		categoria: body.categoria,
		description: body.description,
		usuario: req.usuario._id
	});
	producto.save((err, productoDB) => {
		if(err){
			return res.json({
				ok: false,
				err
			})
		}
		res.json({
			ok: true,
			producto: productoDB
		})
	})
});

//Actualizar un nuevo producto
app.put('/producto/:id', verificarToken, (req, res) => {
	const {id} = req.params;
	const body = _.pick(req.body, ['nombre', 'precioUni', 'description', 'categoria']);
	ProductoModel.findByIdAndUpdate(id, body, {new: true}, (err, productoDB) => {
		if(err){
			return res.status(500).json({
				ok: false,
				err
			})
		}

		if(!productoDB){
			return res.status(400).json({
				ok: false,
				err: {
					message: 'Producto no encontrado'
				}
			})
		}
		res.json({
			ok: true,
			producto: productoDB
		})
	})
});

app.delete('/producto/:id', verificarToken, (req, res) => {
	//Actualizar disponible a false
	const { id } = req.params;
	const body = {
		disponible: false
	}
	ProductoModel.findByIdAndUpdate(id, body, (err, productoDB) => {
		if(err){
			return res.status(500).json({
				ok: false,
				err
			})
		}
		if(!productoDB){
			return res.status(400).json({
				ok: true,
				err: {
					message: 'Producto no encontrado'
				}
			})
		}

		res.json({
			ok: true,
			producto: productoDB
		})
	})
})

module.exports = app;

