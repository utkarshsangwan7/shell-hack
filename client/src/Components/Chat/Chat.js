import React,{useState,useContext,useEffect} from 'react';
import GroupChat from '../GroupChat/GroupChat';
import Participants from '../Participants/Participants';
import {SocketContext} from '../../App';


const Chat = ()=>{
    // const [message,setMessage] = useState([]);
    const [input,setInput] = useState('');
    const [MeetID,setMeetid] = useState('');
    const [UserID,setUserID] = useState('');
    const [Participants_list,setParticipants] = useState([]);
    const socket = useContext(SocketContext).socket;
    const message = useContext(SocketContext).message;
    const setMessage = useContext(SocketContext).setMessage;
    console.log(socket);

    // useEffect(()=>{
    // socket.on('GroupChat',(Message)=>{
    //         console.log('GroupCHat message',Message);
    //         setMessage(Message);
    //       });
    socket.on('UpdateParticipants',(user_list)=>{
            console.log(user_list);
            setParticipants(user_list);
          });
    // },[socket]);
    const onChangeInput = (e)=>{
        setInput(e.target.value);
    } 
    const onClickSend = ()=>{
        setMessage([
          ...message,
            {
              name:UserID,
              message:input
            }
        ]);
        socket.emit('conversation',input,MeetID,UserID);
        const inputfield = document.getElementById('message-input-field');
        inputfield.value = '';
    }

     const displayMessages = ()=>{
        const chat = document.getElementById('chat');
        const part = document.getElementById('Participants');
        chat.style.display = "grid";
        part.style.display = "none";
      }
    
      const displayParticipants = ()=>{
        const chat = document.getElementById('chat');
        const part = document.getElementById('Participants');
        chat.style.display = "none";
        part.style.display = "block";
      }
    return(
        <div>
            <div className='groupChat-wrapper'>
                <div className='groupChat'>
                {message?
                  <div className='chat-wrapper'>
                    <h1>Group Chat</h1>
                    <div>
                      <button onClick={displayMessages}>Messages</button>
                      <button onClick={displayParticipants}>Participants</button>
                    </div>
                    {/* <div className='Participants' id='Participants'><Participants participants={Participants_list}/></div> */}
                    <div id='chat'>
                      <div className='chat'><GroupChat socket={socket} message={message} UserID={UserID}/></div>
                      <div className='message-box'>
                        <input className='message-textbox' id='message-input-field' onChange={onChangeInput} placeholder='Write your message..'></input>
                        <button className='btn btn-outline-success' onClick={onClickSend}>Send</button>
                      </div>
                    </div>
                  </div>
                  :<div></div>
                }
                </div>
              </div>
        </div>
    );
}

export default Chat;