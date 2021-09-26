const express= require('express');
const socketio = require('socket.io');
const http = require('http');
const app= express();
const server = http.createServer(app);
const io = socketio(server,{cors:true}); 
const port = process.env.PORT || 5000;
const { v4: uuidv4 } = require('uuid');
const id = uuidv4();
require('./sockets')(io,id);

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use('/code',require('./routes/code'));

app.get('/',(req,res)=>{
    res.send('Hello World!');
})

app.get('/join-room/:rid',(req,res)=>{
    const Roomid = req.params.rid; 
})

server.listen(port,()=>{
    console.log(`server started on ${port}`)
})