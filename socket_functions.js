module.exports = (socket)=>{
    const join_room = (id)=>{
            socket.join(id);
            socket.emit('JoinedRoom','Congratulations on Joining the room');
        };
    return{
        join_room
    };
};