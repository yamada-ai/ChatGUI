import { useContext, useState } from "react";
import { UserContext } from "../contexts";

import { postNewRoom } from "../api_wrapper";

export const NewChat = () => {

    const [isActive, setActive] = useState(false);

    const [newRoomTitle, setNewRoomTitle] = useState("");

    const {user_id, room_id, selectRoom} = useContext(UserContext)

    const clickNewChat = () => {
        console.log("clicked new chat")
        setActive(true);
    }
    const  createChatroom = async () => {
        if(newRoomTitle===""){
            return
        }
        else{
            setActive(false);
            const res = await postNewRoom(user_id, newRoomTitle);
            console.log("直後", res)
            if (res.room_id > 0){
                console.log(res)
                selectRoom(res.room_id)
                setNewRoomTitle("")
            }
            else{
                console.log(res)
            }
            
        }
    }
    const closeModal = () => {
        setActive(false);
    }
    
    return (
        <>
            <button className="button is-black m-3" style={{ width: "99%" }}>
                <p className="has-text-white is-size-4 p-1" style={{ border: "2px solid", width: "100%" }} onClick={() => clickNewChat()}>+  New Chat</p>
            </button>

            <div className={"modal "+(isActive? "is-active":"")} id="modal1">
                <div className="modal-background" onClick={()=>closeModal()}></div>
                <div className="modal-card">
                    <div className="modal-card-head">
                        新しいChatroomを作成する
                    </div>
                    <div className="modal-card-body has-background-white p-4">
                        <p>room title</p>
                        <input className="input" type="email" placeholder="input room title" value={newRoomTitle} onChange={(event) => setNewRoomTitle(event.target.value)}></input>
                    </div>
                    <div className="modal-card-foot">
                        <button className="button is-success" onClick={ ()=>createChatroom() }> Create</button>
                        <button className="button" onClick={ ()=>closeModal() }>Cancel</button>
                    </div>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={ ()=>closeModal() }></button>
            </div>
        </>
    );
};