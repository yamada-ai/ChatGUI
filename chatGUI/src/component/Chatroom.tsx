import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../contexts";
import { Chat } from "./Chat";
import { postChat, getChats, postAudio, updatePatient, getImg } from "../api_wrapper";
import { ReactMic } from "react-mic";

export const Chatroom = () => {
    // const [rooms, setRooms] = useState([])
    const [userInput, setUserInput] = useState("")


    const list = [];
    const [chatJson, setChatJson] = useState([]);
    const [chatTemp, setChatTemp] = useState([]);
    const [imageSrc, setImageSrc] = useState('');
    const [wavFilename, setWavFilename] = useState('');

    const containerRef = useRef(null);

    const { user_id, room_id } = useContext(UserContext)

    // 録音関係
    const [isRecording, setIsRecording] = useState(false);

    const navigation = useNavigate()
    const [toggleSend, switchSend] = useState(false);

    const clickRecordButton = async () => {
        // 録音中=>停止
        console.log("clicked")
        if (isRecording) {
            setIsRecording(false);
            console.log("停止")
        }
        // 停止=>録音開始
        else {
            setIsRecording(true);
            console.log("録音開始")
        }
    }

    const onStop = async (recordedData) => {
        await onRecognize(recordedData.blob)
    }

    const onRecognize = async (recordedDataBlob) => {
        const formData = new FormData();
        formData.append('audio_blob', recordedDataBlob, 'recording.wav');
        const response = await postAudio(formData)
        // const transcription = response.transcription
        console.log(response.transcription,response.wav_filename )
        setUserInput(response.transcription)
        setWavFilename(response.wav_filename)
    }

    const clickSendButton = async () => {
        setChatTemp([<Chat text={userInput} is_gpt={false} key={"dummy"} />])
        let nextTurn = -1
        if (chatJson.length == 0) {
            nextTurn = 1
        }
        else {
            nextTurn = chatJson[chatJson.length - 1].turn + 1
        }
        console.log(user_id, room_id, nextTurn, userInput, get_contexts(nextTurn))


        const res = await postChat(user_id, room_id, nextTurn, userInput, get_contexts(nextTurn), wavFilename)
        if (res.chat_id > 0) {
            setUserInput("")
            switchSend(!toggleSend)
            setWavFilename("");
        }
    }

    const get_contexts = (until_turn: number) => {
        const context = []
        for (const c of chatJson) {
            if (c.turn === until_turn) {
                break
            }
            context.push({ "role": "user", "content": c.user_text })
            context.push({ "role": "assistant", "content": c.gpt_text })
        }
        return JSON.stringify({ "context": context })
    }

    useEffect(() => {
        setChatTemp([])
        if (room_id < 0) {
            console.log("おそらく初期画面")
            return
        }

        const getChats_async = async () => {
            const gotChats = await getChats(user_id, room_id)
            setChatJson(gotChats)
            console.log("response", gotChats)
        }
        const get_img_async = async() => {
            const url = await getImg(user_id, room_id)
            setImageSrc(url)
            console.log("url", url)
        }
        get_img_async();
        getChats_async();
    }, [room_id, toggleSend])

    for (const c of chatJson) {
        // list.push(<p>{c.user_text}  {c.gpt_text}</p>);
        list.push(<Chat text={c.user_text} is_gpt={false} turn={c.turn} key={String(c.chat_id) + "-0"} />)
        list.push(<Chat text={c.gpt_text} is_gpt={true} turn={c.turn} imageSrc={imageSrc} key={String(c.chat_id) + "-1"} />);

    }

    const clickFinish = async () => {

        console.log("click finish")
        navigation("/observation/")
        // if(res===0){
        //     setRoomTitle(roomTitle_temp)

        // }
    }
    containerRef?.current?.scrollIntoView();
    if (room_id < 0) {
        return <></>
    }
    return (
        <div className="columns" style={{ width: "100%", height: "100%" }}>
            <div className="column is-10" style={{ height: "100%" }}>
                <div style={{ width: "100%", height: "100%" }}>
                    {/* AIとユーザが対話する部分 */}
                    <div style={{ width: "100%", height: "80%" }}>
                        <div className="columns is-centered my-5" style={{ height: "100%" }} >
                            <div className="column is-9 has-background-success-light" style={{ height: "100%", borderRadius: "10px", overflowY: "scroll" }}>
                                {list}
                                {chatTemp}
                                <div ref={containerRef}/>
                            </div>
                        </div>

                    </div>
                    {/* 入力部分 */}
                    <div className="mt-3" style={{ width: "60", height: "120" }}>
                        <div className="columns is-centered my-2" >
                            <div className=" column is-three-fifths my-0">
                                <div className="columns" >
                                    {/* 入力フォーム */}
                                    <input className="input column mt-3 mr-3" type="text" value={userInput} onChange={(event) => setUserInput(event.target.value)}>

                                    </input>
                                    {/* 録音 */}
                                    <div className="column is-narrow">
                                        <button className={"button  icon is-rounded " + (isRecording ? "has-background-danger" : "has-background-info ")} style={{ width: "40px", height: "40px" }} onClick={() => clickRecordButton()}>
                                            <i className={"fas fa-" + (isRecording ? "stop" : "microphone")}></i>
                                        </button>
                                        <div style={{ display: "none" }}>
                                            <ReactMic
                                                record={isRecording}
                                                // onData={onData}
                                                onStop={onStop}
                                                mimeType="audio/webm"
                                            />
                                        </div>
                                    </div>
                                    {/* 終了ボタン */}
                                    <div className="column is-narrow">
                                        <button className="button has-background-danger-dark" style={{ width: "60px", height: "40px" }} onClick={() => clickFinish()}>
                                            <p className="has-text-white">finish</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="level" >
                            <div className="level-item m-0 ">
                                <button className="button icon has-background-primary is-rounded has-text-white is-size-5" style={{ width: "120px", height: "40px" }} onClick={() => clickSendButton()}>
                                    {/* <i className ="fas fa-user"></i> */}
                                    <i className="fas fa-paper-plane"></i>
                                    <p className="ml-3 ">Send</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 対話フロー説明領域 */}
            <div className="column" style={{ height: "100%" }}>
                {/* <p>医療面接の流れ!"!</p> */}
                <div className="coulmns is-centered mt-6" style={{ height: "100%" }}>
                    <div className="coulumn is-10 has-background-success-light p-4" style={{ height: "70%", borderRadius: "10px"}}>
                        <p>医療面接の流れ</p>
                        <p>1. 挨拶</p>
                        <p>2. 名前の確認と自己紹介</p>
                        <p>3. 主訴と現病歴について質問</p>
                        <p>4. 補足事項を質問</p>
                        <p>5. 要約，確認</p>
                        <p>6. 診断と治療方針の伝達</p>
                        <p>7. クロージング</p>
                    </div>
                </div>
            </div>
        </div>

    );
};