//PORT
process.env.PORT = process.env.PORT || 3000;

//DATABASE

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB = '';

if(process.env.NODE_ENV === 'dev'){
	urlDB = 'mongodb://localhost:27017/cafe2';
}
else{
	urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// Vencimiento de token
process.env.CADUCIDAD_TOKEN = '48h';

//SEED
process.env.SEED = process.env.SEED || 'marvel-da-movie$-desarrollo'


//Google client

process.env.CLIENT_ID = process.env.CLIENT_ID || '847704354128-j7jp5ikgn725g239rhbra2k8ado6jfhu.apps.googleusercontent.com'

