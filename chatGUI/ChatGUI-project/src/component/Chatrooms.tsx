// import React from "react";
import { ChatroomTitle } from "./ChatroomTitle"

import { UserContext } from "../contexts";
import { useContext, useEffect, useState } from "react";

import {getRooms} from "../api_wrapper";


const titles = ["お題1", "お題2", "お題3"];
import "./component.css"

export const Chatrooms = () => {
    const list = [];
    const {user_id, room_id} = useContext(UserContext)

    const [rooms, setRooms] = useState([])

    const [toggleDeleted, switchDeleted] = useState(false)
    

    useEffect(() => {
        const getRooms_async = async() => {
            const got_rooms = await getRooms(user_id)
            setRooms(got_rooms)
            console.log("response", getRooms)
        }
		// axios.get(urlAPI+"room/"+String(user_id))
		// 	.then( response => {
		// 		setRooms(JSON.parse(response.data))
		// 		// console.log("posts", posts)
		// 		console.log("response", response.data)
		// 	})
        getRooms_async();
	}, [room_id, toggleDeleted])

    const handleDeleteRoom = (rKey:number) => {
        setRooms(rooms.filter(key => key !== rKey));
        console.log(rooms)
        switchDeleted(!toggleDeleted)
    }

    for (const r of rooms) {
        list.push(<ChatroomTitle title={r.room_title} room_id={r.room_id} onDelete={() =>  handleDeleteRoom(r.room_id)} key={r.room_id} />);
    }
    
    return (
        <>
            <div style={{overflowY:"scroll"}}>
                {list}
            </div>
        </>
    );
};