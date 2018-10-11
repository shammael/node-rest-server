const app = require('./server/routes/usuario');
const mongoose = require('mongoose');
require('./server/config/config');

mongoose.connect(process.env.URLDB, (err, res) => {
	if(err)
		throw new Error(err);
	console.log('Base de datos en linea');
})


app.listen(process.env.PORT, () => console.log(`Servidor corriendo en ${ process.env.PORT }`)); 