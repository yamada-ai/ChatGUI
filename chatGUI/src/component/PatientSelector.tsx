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
        list.push(
            <div className="columns is-centered">
                <div className="column is-three-fifths my-3 py-1">
                    <PatientroomTitle title={r.room_title} room_id={r.room_id} is_end={r.is_end} key={r.room_id} />
                </div>
            </div>
            
        );
    }

    return(
        <>
            <div className="has-background-primary  py-4 pl-5">
                <p className="has-text-white is-size-4 pb-3">
                    患者を選択してください
                </p>
            </div>
            
            <div className="has-background-black" style={{width:"100%"}}>
                {/* <div className="columns">
                    
                </div> */}
                {list}
            </div>
        </>
    )
}