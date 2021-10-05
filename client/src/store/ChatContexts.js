import React,{useState,useContext} from 'react';

const ChatContexts = React.createContext({
    setInput:(e)=>{},
    setChatMessages:(message)=>{}
});

export const ChatContextsProvider = (props)=>{
      
    const [message,setMessages] = useState([]);
    const [input,setInput] = useState('');
    const ChatMessageHandler = (message)=>{
        setMessages(message);
    }
    const InputHandler = (e)=>{
        setInput(e);
    }
    const contextValue = {
        setInput:ChatMessageHandler,
        setChatMessages:InputHandler
    }
    return <ChatContexts.Provider value={contextValue}>
        {props.children}
    </ChatContexts.Provider>
}

export default ChatContexts;
