import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts";
import { Chat } from "./Chat";
import { postChat, getChats, postAudio } from "../api_wrapper";
import { ReactMic } from "react-mic";

export const Chatroom = () => {
    // const [rooms, setRooms] = useState([])
    const [userInput, setUserInput] = useState("")

    
    const list = [];
    const [chat_json, setChatJson] = useState([])
    const [chat_temp, setChat_temp] = useState([])
    const {user_id, room_id} = useContext(UserContext)

    // 録音関係
    const [isRecording, setIsRecording] = useState(false);
    const [recordedData, setRecordedData] = useState(null);

    const [toggleSend, switchSend] = useState(false);

    

    const clickRecordButton = async () => {
        // 録音中=>停止
        console.log("clicked")
        if(isRecording){
            setIsRecording(false);
            console.log("停止")
            // 音声認識開始
            await onRecognize();
        }
        // 停止=>録音開始
        else{
            setIsRecording(true);
            console.log("録音開始")
        }
    }
    const onData = (recordedData) => {
        setRecordedData(recordedData);
    };

    const onRecognize = async () => {
        const formData = new FormData();
        console.log("recordedData is ", recordedData)
        formData.append('audio_blob', recordedData, 'recording.wav');

        const response = await postAudio(formData)
        // const transcription = response.transcription
        setUserInput(response.transcription)
    }

    const clickSendButton = async () => {
        // list.push(<Chat text={userInput} is_gpt={false} key={"dummy"}/>)
        setChat_temp([<Chat text={userInput} is_gpt={false} key={"dummy"}/>])
        let next_turn = -1
        if(chat_json.length==0){
            next_turn = 1
        }
        else{
            next_turn = chat_json[chat_json.length-1].turn + 1
        }
        console.log(user_id, room_id, next_turn, userInput, get_contexts(next_turn))
        
        
        const res = await postChat(user_id, room_id, next_turn, userInput, get_contexts(next_turn))
        if (res.chat_id > 0){
            setUserInput("")
            switchSend(!toggleSend)
        }
    }

    const get_contexts = (until_turn:number) => {
        const context = []
        for (const c of chat_json){
            if(c.turn === until_turn){
                break
            }
            // context = context + "/user/" + c.user_text + "/gpt/" + c.gpt_text
            context.push({"role":"user", "content": c.user_text})
            context.push({"role":"assistant", "content": c.gpt_text})
        }
        return JSON.stringify({"context": context})
    }

    useEffect(() => {
        setChat_temp([])
        if(room_id < 0){
            console.log("おそらく初期画面")
            return
        }

        const getChats_async = async() => {
            const got_chats = await getChats(user_id, room_id)
            setChatJson(got_chats)
            console.log("response", got_chats)
        }

		// axios.get(urlAPI+"chat/"+String(user_id)+"/"+String(room_id))
		// 	.then( response => {
		// 		setChatJson(JSON.parse(response.data))
		// 		// console.log("posts", posts)
		// 		console.log("response", response.data)
		// 	})
        getChats_async();
	}, [room_id, toggleSend])

    for (const c of chat_json) {
        // list.push(<p>{c.user_text}  {c.gpt_text}</p>);
        list.push(<Chat text={c.user_text} is_gpt={false} turn={c.turn} key={String(c.chat_id)+"-0"} />)
        list.push(<Chat text={c.gpt_text} is_gpt={true} turn={c.turn} key={String(c.chat_id)+"-1"}/>);
        
    }

    

    if(room_id < 0){
        return <></>
    }
    return (
        <div style={{width:"100%", height:"100%"}}>
            {/* AIとユーザが対話する部分 */}
            <div style={{width:"100%", height:"80%"}}>
                <div className="columns is-centered my-5" style={{height:"100%"}} >
                    <div className="column is-9 has-background-success-light" style={{height:"100%", borderRadius:"10px", overflowY:"scroll"}}>
                        {list}
                        {chat_temp}
                    </div>
                </div>
                
            </div>
            {/* 入力部分 */}
            <div className="mt-3" style={{width:"60", height:"120"}}>
                <div className="columns is-centered my-2" >
                    <div className=" column is-three-fifths my-0">
                        <div className="columns" >
                            {/* 入力フォーム */}
                            <input className="input column mt-3 mr-3" type="text" value={userInput} onChange={(event) => setUserInput(event.target.value)}>
                                
                            </input>
                            {/* 録音 */}
                            <div className="column is-narrow">
                                <button className ={"button  icon is-rounded "+(isRecording? "has-background-danger":"has-background-info ")} style={{width:"40px", height:"40px"}} onClick={ () => clickRecordButton()}>
                                    <i className={"fas fa-"+(isRecording? "stop":"microphone")}></i>
								</button>
                                <div style={{display:"none"}}>
                                    <ReactMic
                                        record={isRecording}
                                        onData={onData}
                                        onStop={onData}
                                        mimeType="audio/wav"
                                    />
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="level" >
                    <div className="level-item m-0 ">
                        <button className ="button icon has-background-primary is-rounded has-text-white is-size-5" style={{width:"120px", height:"40px"}} onClick={()=>clickSendButton()}>
                            {/* <i className ="fas fa-user"></i> */}
                            <i className="fas fa-paper-plane"></i>
                            <p className="ml-3 ">send</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};