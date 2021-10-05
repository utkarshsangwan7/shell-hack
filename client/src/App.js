import React,{useState,useEffect, useContext} from 'react';
import Peer from 'peerjs';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './Pages/Login'
import Editor from './Pages/Editor/Editor'
import Socketio from 'socket.io-client';
import RoomContext from './store/RoomContext';

const obj = {
  socket:null,
  message:[],
  setMessage:(mess)=>{}
}
export const SocketContext = React.createContext(obj);
function App() {
  const roomCtx = useContext(RoomContext);
  const [streamID,setStreamID] = useState('');
  const [myStream,setMyStream] = useState(null);
  const [otherStreams,setOtherStreams] = useState([]);
  const [message,setMessage] = useState([]);
  const socket= Socketio(`${process.env.REACT_APP_SERVER_URL}`,{ transports: ['websocket', 'polling', 'flashsocket'] });
 
  const my_peer = new Peer();

  useEffect(()=>{
  navigator.mediaDevices.getUserMedia({audio:true})
    .then((stream)=>{
      setMyStream(stream);
    }).catch(console.log)
  },[]);

  useEffect(()=>{
  console.log('IN the useEffect of mystream',myStream);
  if(!myStream)return;
  socket.on('Welcome',(message)=>{
    console.log(message);
  });
  my_peer.on('open',(id)=>{
    setStreamID(id);
    socket.emit('Join',roomCtx.Roomid,id);
  });
  socket.on('NewUser',(message)=>{
    console.log(message);
  });
  socket.on('CallNewUser',(user_streamID)=>{
      console.log('this is the new stream in the old',user_streamID);
      const call = my_peer.call(user_streamID,myStream);
      call.on('stream',(remoteStream)=>{
      console.log(`getting back stream`,remoteStream);
      setOtherStreams([...otherStreams,remoteStream]);
      });
  });
  my_peer.on('call',(call)=>{
        console.log('this is the new stream in the new',myStream);
        call.answer(myStream);
        call.on('stream',(remoteStream)=>{
          if(remoteStream!==null){ 
            console.log('i am the oldest not getting back stream in the new',remoteStream);
            setOtherStreams([...otherStreams,remoteStream]);
          }
        });
  });
  socket.on('GroupChat',(Message)=>{
    console.log('GroupCHat message',Message);
    setMessage(Message);
  });
  },[myStream]);

  useEffect(()=>{
    if(otherStreams.length){
      const audioElement = document.createElement('audio');
      audioElement.srcObject = otherStreams[otherStreams.length-1];
      audioElement.onloadeddata = ()=>{
        audioElement.play();
      };
    }
  },[otherStreams]);
  
  return (
    // <h1>Hello World</h1>
    
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/compiler/:id">
          <SocketContext.Provider value={{socket,message,setMessage}}>
          <Editor />
          </SocketContext.Provider>
        </Route>
      </Switch>
  </Router>

  )
}

export default App;
