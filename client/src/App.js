import React,{useState,useEffect} from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/cobalt.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import './App.css';
import Sidebar from './Components/Sidebar/Sidebar';
import InputOuput from './Components/InputOutput/InputOutput';
import { Box } from '@mui/material';
import axios from 'axios';
import Socketio from 'socket.io-client';

const socket = Socketio(`${process.env.REACT_APP_SERVER_URL}`,{ transports: ['websocket', 'polling', 'flashsocket'] });
function App() {
  const [code,setCode] = useState(`function onLoad(editor) {
    console.log("i've loaded");
  }`);
  const [options,setOptions] = useState({
    mode: 'javascript',
    theme: 'eclipse',
    lineNumbers: true
  });
  const [Input,setInput] = useState('');
  const [Output,setOutput] = useState('');
  const [RoomID,setRoomID] = useState('');

  useEffect(()=>{
    socket.on('Welcome',(id)=>{
      setRoomID(id);
      console.log(id);
      socket.emit('join',(id));
    });

    socket.on('JoinedRoom',(message)=>{
      console.log(message);
    });
  },[socket]);

  const handleCompile=async ()=>{
    const data={
      code : code,
      lang : options.mode,
      input : Input
    }
    console.log(data);
    const datares=await axios.post(`${process.env.REACT_APP_SERVER_URL}/code/submit`,data);
    console.log(datares);
    if(datares.data.err){
      return setOutput(datares.data.err)
    }
    return setOutput(datares.data.output)
  }

  return (
    <div className="App">
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box gridColumn="span 12">
              <h1>Code, Compile & Run</h1>
            </Box>
            <Box gridColumn="span 12">
              <Sidebar options={options} setOptions={setOptions} RoomID={RoomID}/>
            </Box>
            <Box gridColumn="span 12">
                <CodeMirror
                  value={code}
                  options={options}
                  onBeforeChange={(editor, data, value) => {
                    setCode(value);
                    console.log(value);
                  }}
                />
            </Box>
            <Box gridColumn="span 12">
              <InputOuput Input={Input} Output={Output} setInput={setInput} setOutput={setOutput}/>
            </Box>
            <Box gridColumn="span 12">
              <button onClick={handleCompile}>Compile</button>
            </Box>
      </Box>
    </div>
  );
}

export default App;
