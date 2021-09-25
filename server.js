const express= require('express');
const socketio = require('socket.io');
const http = require('http');
const app= express();
const server = http.createServer(app);
const io = socketio(server); 
const port = process.env.PORT || 5000;
require('./sockets')(io);


app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use('/code',require('./routes/code'));

app.get('/',(req,res)=>{
    res.send('Hello World!');
})

app.get('/join-room/:rid',(req,res)=>{
      
})

server.listen(port,()=>{
    console.log(`server started on ${port}`)
})