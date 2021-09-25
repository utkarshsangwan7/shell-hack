import React,{useState,useEffect} from 'react';
import AceEditor from "react-ace";
import './App.css';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools"
import "ace-builds/src-noconflict/theme-monokai";
import Sidebar from './Components/Sidebar/Sidebar';
import InputOuput from './Components/InputOutput/InputOutput';
import { Box } from '@mui/material';
import Socketio from 'socket.io-client';

const socket = Socketio(`${process.env.REACT_APP_SERVER_URL}`,{ transports: ['websocket', 'polling', 'flashsocket'] });
function App() {
  const [code,setCode] = useState(`function onLoad(editor) {
    console.log("i've loaded");
  }`);
  const [language,setLanguage] = useState('javascript');
  const [Theme,setTheme] = useState('monokai');
  const [Input,setInput] = useState('');
  const [Output,setOutput] = useState('');
  const [RoomID,setRoomID] = useState('');
  const onChange = (newValue)=>{
    console.log("change", newValue);
    setCode(newValue);
  }
  
  const onLoad = (editor)=>{
    console.log("The editor is loaded!!");
  }

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

  return (
    <div className="App">
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box gridColumn="span 12">
              <h1>Code, Compile & Run</h1>
            </Box>
            <Box gridColumn="span 12">
              <Sidebar language={language} theme={Theme} setLanguage={setLanguage} setTheme={setTheme} RoomID={RoomID}/>
            </Box>
            <Box gridColumn="span 12">
                <AceEditor
                placeholder="Placeholder Text"
                mode="javascript"
                width='75vw'
                height='60vh'
                theme={Theme}
                name="blah2"
                onLoad={onLoad}
                onChange={onChange}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={`${code}`}
                setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
                }}/>
            </Box>
            <Box gridColumn="span 12">
              <InputOuput Input={Input} Output={Output} setInput={setInput} setOutput={setOutput}/>
            </Box>
      </Box>
    </div>
  );
}

export default App;
