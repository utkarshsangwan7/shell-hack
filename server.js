require('dotenv').config();
const express= require('express');
const socketio = require('socket.io');
const http = require('http');
const mongoose = require("mongoose");
const app= express();
const cors=require('cors');
require("./config/passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")
const path = require("path");
const server = http.createServer(app);
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const {messages,
  All_participants,
  insert_participants,
  remove_participant,
  insert_Messages,
  filter_Messages,
  filter_Users} = require('./chat.js');

const io = socketio(server,{cors:true}); 
const id = uuidv4();

// * DB Connection
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.log("Connection to MongoDB failed.\n", err);
    return console.log("Connected to MongoDB");
  }
);

// * Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    // store: MongoStore.create({ mongooseConnection: mongoose.connection }),
    secret: process.env.COOKIESECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000, /*secure: true,*/ httpOnly: true },
  })
);
app.use(cookieParser());
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
app.use(passport.initialize());
app.use(passport.session());


// ** Sockets **

io.on('connection',(socket)=>{
	let GID = '';
	socket.emit('Welcome','Welcome to the meet');
	socket.on('Join',(groupId,streamID/*,UserId,VideoID,ScreenID*/)=>{
    if(groupId){
      socket.join(groupId);
      console.log('ping for new user',streamID);
      insert_participants(/*UserId,*/groupId,socket.id,streamID);
      io.sockets.in(groupId).emit('NewUser','A new User joined');
      socket.to(groupId).emit('CallNewUser',streamID);
      GID = groupId;
      insert_Messages('BOT',`@UserId jumped in!!`,groupId);
      const groupChat = filter_Messages(groupId);
      const group_list = filter_Users(groupId);
      io.sockets.in(groupId).emit('GroupChat',groupChat);
      io.sockets.in(groupId).emit('UpdateParticipants',group_list);
    }
	});
  socket.on('conversation',(message,groupId,UserId)=>{
		insert_Messages(UserId,message,groupId);
		const groupChat = filter_Messages(groupId);
		io.sockets.in(groupId).emit('GroupChat',groupChat);
	});
  socket.on('diconnect',()=>{
    console.log('user disconnected');
		const user = remove_participant(socket.id);
		if(user){
			insert_Messages('BOT',`@UserID Left the meet`,user.groupId);
			const groupChat = filter_Messages(user.groupId);
			const group_list = filter_Users(user.groupId);
			io.sockets.in(user.groupId).emit('GroupChat',groupChat);
			io.sockets.in(user.groupId).emit('RemoveParticipantLeft',user);
			io.sockets.in(user.groupId).emit('UpdateParticipants',group_list);
		}
  });
});

// ** Routes importing **

app.use('/code',require('./routes/code'));
app.use("/api/user", require('./routes/auth'));

app.get('/',(req,res)=>{
    res.send('Hello World!');
})

app.get('/join-room/:rid',(req,res)=>{
    const Roomid = req.params.rid; 
})

server.listen(port,()=>{
    console.log(`server started on ${port}`)
})

if (process.env.NODE_ENV === "production") {
  console.log("production", envConfig);
  app.use(express.static(path.resolve(__dirname, "Client", "build")));
  app.get("/*", function (req, res) {
    // this -->
    res.cookie("XSRF-TOKEN", req.csrfToken());
    res.sendFile(path.resolve(__dirname, "Client", "build", "index.html"));
  });
}

app.use("/static", express.static(__dirname + "\\Client\\src\\assets"));
console.log(__dirname + "\\Client");

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
});

process.on("uncaughtException", (err, promise) => {
  console.log(`Error: ${err.message}`);
});