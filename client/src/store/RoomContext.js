import React,{useState,useContext} from 'react';

const RoomContext = React.createContext({
    Roomid:null,
    idGen: (id) =>{}
});

export const RoomContextProvider = (props)=>{  
    const [id,setID] = useState(null);
    const RoomIdHandler = (id)=>{
        setID(id);
    }
    const contextValue = {
        Roomid:id,
        idGen:RoomIdHandler
    }
    return <RoomContext.Provider value={contextValue}>
        {props.children}
    </RoomContext.Provider>
}

export default RoomContext;
