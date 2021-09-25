const get_socket_function = require('./socket_functions');
const { v4: uuidv4 } = require('uuid');

let Roomid = null;
const io_utils = (io)=>{
    io.on('connection',(socket)=>{
        const id = uuidv4();
        socket.emit('Welcome',id);
        const {} = get_socket_function
        socket.on('join',(id)=>{
            Roomid = id;
            socket.join(id);
            socket.emit('JoinedRoom','Congratulations on Joining the room');
        });
        socket.on('disconnect',()=>{
            console.log('The User left');
        });
    });
}


module.exports = io_utils;