import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {RoomContextProvider} from './store/RoomContext'
import {ChatContextsProvider} from './store/ChatContexts';

ReactDOM.render(
  <RoomContextProvider>
  <ChatContextsProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </ChatContextsProvider>
  </RoomContextProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
