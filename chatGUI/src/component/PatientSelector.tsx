import { PatientroomTitle } from "./PatientroomTitle"

import { UserContext } from "../contexts";
import { useContext, useEffect, useState } from "react";


import {getRooms} from "../api_wrapper";

export const  PatientSelector = () => {
    const list = [];
    const {user_id, room_id} = useContext(UserContext)

    const [rooms, setRooms] = useState([])

    useEffect( ()=>{
        const getRooms_async = async() => {
            const got_rooms = await getRooms(user_id)
            setRooms(got_rooms)
            console.log("response", getRooms)
        }
        getRooms_async();
    }, [])

    for (const r of rooms) {
        list.push(<PatientroomTitle title={r.room_title} room_id={r.room_id} is_end={r.is_end} key={r.room_id} />);
    }

    return(
        <>
            <div style={{overflowY:"scroll"}}>
                {list}
            </div>
        </>
    )
}