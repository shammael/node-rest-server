const express = require('express');
const CategoriaModel = require('../models/categoria');
const { verificarToken, checkRoleAdmin } = require('../middlewares/authentication');
const _ = require('underscore');
const app = express();

//Mostrar todas las categorias
app.get('/categoria', verificarToken, (req, res) => {
	const { id } = req.params;
	const limite = req.query.limite || 5;
	const desde = req.query.desde || 0;
	CategoriaModel
		.find({})
		.sort('description')
		.populate('usuario', 'nombre email')
		.exec((err, categoriaDB) => {
			if(err){
				return res.status(500).json({
					ok: false,
					err
				})
			}
			if(!categoriaDB){
				return res.status(400).json({
					ok: false,
					err: {
						message: 'Categoria no encontrada'
					}
				})
			}
			res.json({
				ok: true,
				categoria: categoriaDB
			})
		})
})

//Mostrar una categoria especifica
app.get('/categoria/:id', verificarToken, (req, res) => {
	const { id } = req.params;
	CategoriaModel
		.find({_id: id})
		.populate('usuario', 'nombre email')
		.exec((err, categoriaDB) => {
			if(err){
				return res.status(500).json({
					ok: false,
					err
				})
			}

			if(!categoriaDB){
				return res.status(400).json({
					ok: false,
					err:{
						message: 'Categoria no encontrada',
						err
					}
				})
			}
			res.json({
				ok: true,
				categoria: categoriaDB
			})
		})
})

//Crear categoria
app.post('/categoria', [verificarToken, checkRoleAdmin], (req, res) => {
	//Regresa la nueva categoria
	//usuario req.usuario._id;
	const { body } = req;
	const categoria = new CategoriaModel({
		description: body.description,
		usuario: req.usuario._id
	});

	categoria.save((err, categoriaDB) => {
		if(err){
			return res.status(500).json({
				ok: false,
				err
			})
		}

		if(!categoriaDB){
			return res.status(400).json({
				ok: false,
				err
			})
		}

		res.json({
			ok: true,
			categoria: categoriaDB
		})
	})
})

//Actualizar una categoria
app.put('/categoria/:id', [verificarToken, checkRoleAdmin], (req, res) => {
	const { id } = req.params;
	const body = _.pick(req.body, 'description');
	CategoriaModel.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, categoriaDB) => {
		if(err){
			return res.status(500).json({
				ok: false,
				err
			})
		}
		if(!categoriaDB){
			return res.status(400).json({
				ok: false,
				err:{
					message: 'Categoria no existe'
				}
			})
		}
		res.json({
			ok: true,
			categoria: categoriaDB
		})
	})
})

app.delete('/categoria/:id', [verificarToken, checkRoleAdmin], (req, res) => {
	//Solo un admin puede borrar una categoria
	const { id } = req.params;
	CategoriaModel.findOneAndRemove(id, (err, categoriaDB) => {
		if(err){
			return res.status(500).json({
				ok: false,
				err
			})
		}

		if(!categoriaDB){
			return res.status(400).json({
				ok: false,
				err:{
					message: 'Categoria no existe'
				}
			})
		}

		res.json({
			ok: true,
			categoria: categoriaDB
		})
	})
})
module.exports = app;