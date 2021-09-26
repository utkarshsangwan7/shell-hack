const express= require('express');
const socketio = require('socket.io');
const http = require('http');
const app= express();
const cors=require('cors');
const server = http.createServer(app);
const io = socketio(server,{cors:true}); 
const port = process.env.PORT || 5000;
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const id = uuidv4();
require('./sockets')(io,id);

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use(cors({ origin: `${process.env.CLIENT_URL}`, credentials: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", `${process.env.CLIENT_URL}`);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

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