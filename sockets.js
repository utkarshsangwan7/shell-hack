const get_socket_functions = require('./socket_functions');
let Roomid = null;
const io_utils = (io,id)=>{
    io.on('connection',(socket)=>{
        socket.emit('Welcome',id);
        const {join_room} = get_socket_functions(socket);
        socket.on('join',join_room);
        socket.on('disconnect',()=>{
            console.log('The User left');
        });
    });
}

module.exports = io_utils;