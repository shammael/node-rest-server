//PORT
process.env.PORT = process.env.PORT || 3000;

//DATABASE

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB = '';

if(process.env.NODE_ENV === 'dev'){
	urlDB = 'mongodb://localhost:27017/cafe2'
}
else{
	urlDB = 'mongodb://cafe2-user:waleska2017@ds129393.mlab.com:29393/cafe2'
}

process.env.URLDB = urlDB;


