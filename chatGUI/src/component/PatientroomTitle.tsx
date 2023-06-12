import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts";

type Props = {
    room_id : number
	title: string
    is_end : number
};

export const PatientroomTitle = (prop:Props) => {
    const {user_id, room_id, selectRoom} = useContext(UserContext)
    const [roomTitle, setRoomTitle] = useState(prop.title)
    const navigation = useNavigate()

    const clickRoom = (room_id:number) => {
        selectRoom (room_id)
        console.log("pushed room_id:", room_id)
        navigation("/chat/")
    }

    const clickObsIcon = (room_id:number) => {
        selectRoom (room_id)
        console.log("pushed room_id:", room_id)
        navigation("/observation/")
    }

    return (
        <>
            <div className="columns my-1 pl-3" style={{width:"100%"}}>  
                <button className={"button column  mr-2 p-0 "+(prop.is_end? "is-black":"is-dark")} disabled={prop.is_end? true:false} 
                onClick={ ()=> clickRoom(prop.room_id)}>
                    <p>{roomTitle}</p>
                </button>

                <div className="column is-narrow p-0 ">
                    <button className ="button is-dark " style={{width:"40px", height:"40px"}} onClick={ () => clickObsIcon(prop.room_id)} disabled={prop.is_end? false:true}>
                        <i className="fas fa-file"></i>
					</button>
                </div>
            </div>
        </>
    )
}