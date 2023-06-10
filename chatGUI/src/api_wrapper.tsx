import axios, {AxiosInstance} from 'axios';
import { URL_API } from './setting';

export const urlAPI = URL_API

const client: AxiosInstance = axios.create({
    baseURL: urlAPI,
    headers: { 'Content-Type': 'application/json' },
    responseType: 'json',
  });

export async function getRooms(user_id:number):Promise<any>{
    const response = await client.get("/room/"+String(user_id))
    const rooms = JSON.parse(response.data)
    return rooms
}

export async function postNewRoom(user_id:number, room_title:string):Promise<any>{
    const body = {
        "user_id" : user_id,
        "room_title" : room_title
    }
    const status = await client.post("/room", body)
        .then( res => {
            return 0
        })
        .catch( res => {
            return -1
        })
    
    if(status===0){
        const response = await client.get("/room/"+String(user_id))
        const rooms = JSON.parse(response.data)
        const latest_room = rooms[rooms.length-1]
        return {"room_id":latest_room.room_id}
    }
    else{
        return {"room_id":-1}
    }
    
}

export async function deleteRoom(user_id:number, room_id:number):Promise<any>{
    const status = await client.delete("/room/"+String(user_id)+"/"+String(room_id))
        .then( res => {
            return 0
        })
        .catch( res => {
            return -1
        })
    return status
}

export async function updateRoom(user_id:number, room_id:number, new_room_title:string):Promise<any>{
    const body = {
        "user_id" : user_id,
        "room_id" : room_id,
        "new_room_title" : new_room_title
    }
    const status = await client.put("/room", body)
        .then( res => {
            return 0
        })
        .catch( res => {
            return -1
        })
    return status
}

export async function updatePatient(user_id:number, room_id:number, end_status:number):Promise<any>{
    const body = {
        "user_id" : user_id,
        "room_id" : room_id,
        "is_end" : end_status
    }
    const status = await client.put("/patient", body)
        .then( res => {
            return 0
        })
        .catch( res => {
            return -1
        })
    return status
}

export async function getChats(user_id:number, room_id:number):Promise<any>{
    const response = await client.get("/chat/"+String(user_id)+"/"+String(room_id))
    const chats = JSON.parse(response.data)
    return chats
}

export async function postChat(user_id:number, room_id:number, turn:number, user_text:string, context:string):Promise<any>{
    const body = {
        "user_id" : user_id,
        "room_id" : room_id,
        "turn" : turn,
        "user_text" : user_text,
        "context" : context
    }
    const status = await client.post("/chat", body)
        .then( res => {
            return 0
        })
        .catch( res => {
            return -1
        })

    if(status===0){
            const response = await client.get("/chat/"+String(user_id)+"/"+String(room_id))
            const chats = JSON.parse(response.data)
            const latest_chat = chats[chats.length-1]
            return {
                "chat_id": latest_chat.chat_id,
                "gpt_text":latest_chat.gpt_text
            }
        }
        else{
            return {
                "chat_id": -1,
                "gpt_text": ""
            }
        }
}

export async function postObservation(user_id:number, room_id:number, user_text:string):Promise<any>{
    const body = {
        "user_id" : user_id,
        "room_id" : room_id,
        "user_text" : user_text,
    }
    const status = await client.post("/observation", body)
        .then( res => {
            return 0
        })
        .catch( res => {
            return -1
        })

    if(status===0){
            const response = await client.get("/observation/"+String(user_id)+"/"+String(room_id))
            const observations = JSON.parse(response.data)
            const latest_observation = observations[observations.length-1]
            return {
                "obs_id": latest_observation.obs_id,
                "gpt_text":latest_observation.gpt_text
            }
        }
        else{
            return {
                "obs_id": -1,
                "gpt_text": ""
            }
        }
}

export async function postUser(user_name:string):Promise<any>{
    const body = {
        "user_name" : user_name
    }
    const status = await client.post("/user", body)
        .then( res => {
            return 0
        })
        .catch( res => {
            return -1
        })

    if(status===0){
            const response = await client.get("/user/"+String(user_name))
            const user_id = Number(JSON.parse(response.data)["user_id"])
            return {
                "user_id": user_id
            }
        }
        else{
            return {
                "user_id": -1
            }
        }
}

export async function getUserID(user_name:string):Promise<any>{
    const response = await client.get("/user/"+String(user_name))
    const user_id = Number(JSON.parse(response.data)["user_id"])
    return {
        "user_id": user_id
    }
}


const client2: AxiosInstance = axios.create({
    baseURL: urlAPI,
    // headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'json',
  });

export async function postAudio(body):Promise<any>{
    const response = await axios.post(urlAPI+"transcribe", body, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    const transcription = JSON.parse(response.data)
    if("transcription" in transcription){
        return transcription
    }
    else{
        return {
            "transcription" : "Error : <認識に失敗しました>"
        }
    }
}