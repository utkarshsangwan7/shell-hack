import React,{useState,useEffect,useRef,useContext} from 'react';
import { CodemirrorBinding } from "y-codemirror";
import { UnControlled as CodeMirrorEditor } from "react-codemirror2";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { useParams } from 'react-router-dom';
import "./Editor.css";
import RandomColor from "randomcolor";

import "codemirror/mode/clike/clike";
import "codemirror/mode/python/python";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/go/go";
import "codemirror/mode/pascal/pascal";
import "codemirror/mode/lua/lua";
import "codemirror/mode/rust/rust";
import "codemirror/mode/perl/perl";
import "codemirror/mode/ruby/ruby";
import "codemirror/mode/php/php";
import "codemirror/mode/r/r";
import "codemirror/mode/ruby/ruby";
import "codemirror/mode/sql/sql";
import "codemirror/mode/swift/swift";
import "codemirror/mode/shell/shell";
import "codemirror/mode/rust/rust";
import "codemirror/mode/haskell/haskell";


import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/anyword-hint";

import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/comment-fold";
import "codemirror/addon/fold/foldgutter.css";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/ambiance.css";
import "codemirror/theme/material-darker.css";
import "codemirror/theme/material-palenight.css";
import "codemirror/theme/mdn-like.css";
import 'codemirror/theme/material.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/cobalt.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import InputOuput from '../../Components/InputOutput/InputOutput';
import RoomContext from '../../store/RoomContext';
import { Box } from '@mui/material';
import axios from 'axios';
import Chat from '../../Components/Chat/Chat';

const Editor=(props)=>{
const [EditorRef, setEditorRef] = useState(null);
  const [code, setCode] = useState("");
  const handleEditorDidMount = (editor) => {
    setEditorRef(editor);
  };
  let { id } = useParams();
  const roomCtx = useContext(RoomContext);
  
  useEffect(()=>{
    roomCtx.idGen(id);
  },[]);
  useEffect(() => {

    console.log(id);
    if (EditorRef) {
      const ydoc = new Y.Doc(); //create a ydoc 

      let provider = null;
      try {
        provider = new WebrtcProvider(id , ydoc, {
          signaling: [
            "wss://signaling.yjs.dev",
            'wss://y-webrtc-signaling-eu.herokuapp.com', 
            'wss://y-webrtc-signaling-us.herokuapp.com'
          ]
        });

        const yText = ydoc.getText("codemirror");
        
        const yUndoManager = new Y.UndoManager(yText);

        const awareness = provider.awareness; //awareness is what makes other user aware about your actions 
        
        const color = RandomColor(); //Provied any random color to be used for each user
        
        awareness.setLocalStateField("user", {
          name: "Users Name",
          color: color,
        });
        
        const getBinding = new CodemirrorBinding(yText, EditorRef, awareness, {
          yUndoManager,
        });
        
      } catch (err) {
        alert("error in collaborating try refreshing or come back later !");
      }
      return () => {
        
        if (provider) {
          provider.disconnect(); //We destroy doc we created and disconnect 
          ydoc.destroy();  //the provider to stop propagting changes if user leaves editor
        }
      };
    }
  }, [EditorRef]);
  const [options,setOptions] = useState({
    lineWrapping: true,
    smartIndent: true,
    lineNumbers: true,
    foldGutter: true,
    tabSize: 2,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    autoCloseTags: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    extraKeys: {
      "Ctrl-Space": "autocomplete",
    },
    mode: 'text/javascript',
    theme: 'monokai',
    lineNumbers: true,
    electricChars : true
  });
  const [Input,setInput] = useState('');
  const [Output,setOutput] = useState('');
  const [RoomID,setRoomID] = useState('');

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
            <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        fontSize: "20px",
        overflowY: "auto",
      }}
    >
      <CodeMirrorEditor
        onChange={(editor, data, value) => {
          setCode(value);
        }}
        autoScroll
        options={options}
        editorDidMount={(editor) => {
          handleEditorDidMount(editor);
          editor.setSize("100vw", "100%");
        }}
      />
    </div>
            </Box>
            <Box gridColumn="span 12">
              <InputOuput Input={Input} Output={Output} setInput={setInput} setOutput={setOutput}/>
            </Box>
            <Box gridColumn="span 12">
              <button onClick={handleCompile}>Compile</button>
            </Box>
            <Box gridColumn="span 12">
                <Chat/>
            </Box>
      </Box>
    </div>
  );
}

export default Editor