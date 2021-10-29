 //importamos la libreria mongoose
 const mongoose = require('mongoose');

 //hacemos una función para la conexión de la base de datos
 const dbConnection = async() => {
     try {
         await mongoose.connect(process.env.MONGO_CNN, {
             useNewUrlParser: true,
             useUnifiedTopology: true,
         });
         console.log('Connected Database')
     } catch (err) {
         console.log(err)
         throw new Error('Error Connection DB')
     }
 }

 module.exports = {
     dbConnection
 }