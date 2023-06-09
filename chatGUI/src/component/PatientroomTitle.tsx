import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts";

import { deleteRoom, updateRoom } from "../api_wrapper";


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

    return (
        <>
            <div>
                <button onClick={ ()=> clickRoom(prop.room_id)}>
                    <p>{roomTitle}</p>
                </button>
            </div>
        </>
    )
}