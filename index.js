const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();



//Crear servidor/aplicación express

const app = express();

// Base de datos
dbConnection()

//Directorio Público
app.use(express.static('public'));


/* // GET

app.get('/', (req, res)=>{

    res.json({
        ok: true,
        msg: 'Todo salio bien',
        uid: 123455
    });
}); */


// CORS

app.use(cors());

// Lectura y parseo del body

app.use(express.json());





// RUTAS

app.use('/api/auth', require('./routes/auth'));



app.listen(process.env.PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
});