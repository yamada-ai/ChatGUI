// import { makeStyles, createStyles } from '@material-ui/styles'; 

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts";

import { deleteRoom, updateRoom } from "../api_wrapper";


type Props = {
    room_id : number
	title: string
    onDelete : Function
};



// const useStyle = makeStyles(theme =>
//     createStyles({
//       roomTitle: {
//         color: '#202123',
//         '&:hovor' : {
//             color : "#2A2B32"
//         }
//       },
//     }),
//   );


export const ChatroomTitle = (prop:Props) => {
    // const clsx = useStyle();

    const {user_id, room_id, selectRoom} = useContext(UserContext)

    const [roomTitle, setRoomTitle] = useState(prop.title)
    const [roomTitle_temp, setRoomTitle_temp] = useState(prop.title)

    const [isActive, setActive] = useState(false);

    const clickRoom = (room_id:number) => {
        selectRoom (room_id)
        console.log("pushed room_id:", room_id)
    }

    const clickWrench = () => {
        console.log("clicked wrench")
        setActive(true);
    }

    const closeModal = () => {
        setActive(false);
    }
    
    const  clickUpdateRoom = async () => {
        const res = await updateRoom(user_id, prop.room_id, roomTitle);
        if(res===0){
            setRoomTitle(roomTitle_temp)            
        }
        setActive(false);
    }

    const clickDeleteRoom = async () => {
        const res = await deleteRoom(user_id, prop.room_id);
        if(res===0){
            prop.onDelete()
            
        }
        setActive(false);
        
    }

    return (
        <>
            {/* <div className={clsx.roomTitle}> */}
            <div className="columns my-4 pl-3" style={{width:"100%"}}>
                
                <button className={"button pl-3 py-1 pr-1 column mr-2  "+(prop.room_id === room_id? "is-primary" : "is-dark")} style={{minWidth :"80px", height:"40px"}} onClick={() => clickRoom(prop.room_id)}>
                    <div className=" is-flex  is-size-6" style={{width:"99%"}}>
                        <i className="far fa-comment pt-1 pr-4"></i>
                        <p style={{
                            whiteSpace : "nowrap", 
                            overflow:"hidden", 
                            textOverflow:"ellipsis"
                        }}>
                            {roomTitle}</p>
                    </div>
                </button>

                <div className="column is-narrow p-0 ">
                    <button className ="button is-dark " style={{width:"40px", height:"40px"}} onClick={ () => clickWrench()}>
                            <i className="fas fa-wrench"></i>
					</button>
                </div>
                
            </div>

            <div className={"modal "+(isActive? "is-active":"")} id="modal1">
                <div className="modal-background" onClick={()=>closeModal()}></div>
                <div className="modal-card">
                    <div className="modal-card-head">
                        Room を編集する
                    </div>
                    <div className="modal-card-body has-background-white p-4">
                        <p>room title</p>
                        <input className="input" type="email" placeholder="input room title" value={roomTitle_temp} onChange={(event) => setRoomTitle_temp(event.target.value)}></input>
                    </div>
                    <div className="modal-card-foot">
                        <button className="button is-success" onClick={ ()=> clickUpdateRoom() }> update</button>
                        <button className="button has-background-danger has-text-white mr-6" onClick={ ()=> clickDeleteRoom() }> delete</button>
                        <button className="button" onClick={ ()=>closeModal() }>Cancel</button>
                    </div>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={ ()=>closeModal() }></button>
            </div>
        </>
    );
};