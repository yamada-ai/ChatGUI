import {NewChat} from "./NewChat"
import { Chatrooms } from "./Chatrooms";
// import {UserInfo} from "./UserInfo"

export const ChatHeader = () => {
    return (
        <>
            <div className="columns">
                <div className="column is-full px-2 py-2">
                    <NewChat/> 
                </div> 
            </div>
            <div className="columns">
                <div className="column is-full px-2 py-2" >
                    <Chatrooms/> 
                </div> 
            </div>
            {/* <div> <UserInfo/> </div> */}
        </>
    );
};