module.exports = (socket,Roomid)=>{
    const join_room = ()=>{
        socket.on('join',(id)=>{
            Roomid = id;
            socket.join(id);
            socket.emit('JoinedRoom','Congratulations on Joining the room');
        });
    }
    return{
        join_room
    };
};