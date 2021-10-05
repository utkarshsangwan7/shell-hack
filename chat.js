const messages = [];
const All_participants = [];


const insert_participants = (/*user,*/groupId,socketID,VideoID)=>{
	All_participants.push({/*name:user,*/groupId,socketID,VideoID});
}

const remove_participant = (socketID)=>{
	const index = All_participants.findIndex((user)=>{
		return user.socketID===socketID;
	});
	const user = All_participants.splice(index,1);
	return user[0];
}
const insert_Messages = (sender,message,groupId)=>{
	messages.push({name:sender,message,groupId});
}

const filter_Messages = (groupId)=>{
	const group_messages = messages.filter((message)=>{
		return groupId===message.groupId;
	});
	return group_messages;
}
const filter_Users = (groupId)=>{
	const group_Users = All_participants.filter((user)=>{
		return groupId===user.groupId;
	});
	return group_Users;
}

module.exports = {
    messages,
    All_participants,
    insert_participants,
    remove_participant,
    insert_Messages,
    filter_Messages,
    filter_Users
}