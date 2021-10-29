require('dotenv').config();
const cors = require('cors');
const express = require('express');
const port = process.env.Port;
const { dbConnection } = require('./database/db');


class Server {

    constructor() {
        this.app = express()

        this.connectDB();

        this.middleware();

        this.routes();
    }
    async connectDB() {
        await dbConnection();
    }

    listen() {
        this.app.listen(port, () => {
            console.log(`Listening at the port http://localhost:${port}`)
        })
    }

    middleware() {
        this.app.use(cors())

        //lectura parse del body
        this.app.use(express.json())

        //cargamos el cors para que nos permita las peticiones desde el frontend
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
        });

    }

    routes() {
        //hacemos llamado a nuestras rutas
        this.app.use('/API/users', require('../API/routes/user'));
        this.app.use('/API/publications', require('../API/routes/publication'));
    }


}

module.exports = Server;