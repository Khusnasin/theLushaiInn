const mongoose = require("mongoose");

var mongoURL = 'mongodb+srv://KhusnasinSultana:XJPtozAllah5oKhushF34uEMES@cluster0.xtvhuut.mongodb.net/Lushai-Inn-rooms'

mongoose.connect(mongoURL , {useUnifiedTopology: true , useNewUrlParser : true})

var connection = mongoose.connection

connection.on('error' , ()=>{
    console.log('MongoDB Connection failed')
})

connection.on('connected' , ()=>{
    console.log('MongoDB connection successful!')
})


module.exports = mongoose