const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use(require('./server/routes/index'));

require('./server/config/config');

mongoose.connect(process.env.URLDB, (err, res) => {
	if(err)
		throw new Error(err);
	console.log('Base de datos en linea');
})


app.listen(process.env.PORT, () => console.log(`Servidor corriendo en ${ process.env.PORT }`)); 