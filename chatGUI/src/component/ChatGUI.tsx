// import { Link } from "react-router-dom";
import {ChatHeader} from "./ChatHeader"
import { Chatroom } from "./Chatroom";

type Props = {
    user_id : number
    room_id : number
}

export const ChatGUI = () => {
    return (
        <>
        <div style={{height:"99vh"}}>
            <div className="columns m-0" style={{height:'100%'}}>
                {/* <div className="column is-one-fifth has-background-black" style={{height:'100%'}}>
                    <ChatHeader/>
                </div> */}
                <div className="column is-full" style={{width:'100%', height:'100%', backgroundColor:"#343541"}}>
                    {/* chatroom */}
                    <Chatroom/>
                    {/* <div ></div> */}
                </div>
            </div>
        </div>            
        </>
        
    );
};
