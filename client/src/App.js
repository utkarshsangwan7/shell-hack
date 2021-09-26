import React,{useState,useEffect,useRef} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './Pages/Login'
import Editor from './Pages/Editor/Editor'
import Socketio from 'socket.io-client';

const socket = Socketio(`${process.env.REACT_APP_SERVER_URL}`,{ transports: ['websocket', 'polling', 'flashsocket'] });
function App() {
  return (
    // <h1>Hello World</h1>
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/compiler">
          <Editor />
        </Route>
      </Switch>
  </Router>
  )
}

export default App;
