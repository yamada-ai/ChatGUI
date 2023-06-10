import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts";
import { useContext, useState } from "react";
import { postObservation } from "../api_wrapper";
// type Props = {
//     room_id : number
//     patient_id : number
// };

export const  Observation = () => {

    const {user_id, room_id} = useContext(UserContext)

    const [userInput, setUserInput] = useState("")
    const [gptOutput, setGptOutput] = useState("")

    const navigation = useNavigate()
    // const res = await updatePatient(user_id, room_id, 1);

    const clickSendButton = async() => {
        const res =  await postObservation(user_id, room_id, userInput)
        if (res.obs_id > 0) {
            setGptOutput(res.gpt_text)
        }
    }

    return(
        <>
        <div className="has-background-black" style={{height:"99vh"}}>
            <div className="columns is-centered">
                <div className="column is-three-fifths ">
                    <div  className="mt-4">
                        <p >所見を入力してください</p>
                    </div>
                    <div className="level m-0" >
                        <div className="level-right">
                            <p className="level-item has-text-white" >文字数 : {userInput.length}</p>
                        </div>
                    </div>
                    <div className="mt-1 py-1">
                        <textarea className="textarea" placeholder="" rows={10} value={userInput} onChange={(event) => setUserInput(event.target.value)}>
                        </textarea>
                    </div>
                    {/* ボタン1 */}
                    <div className="level" >
                        <div className="level-item mt-4 ">
                            <button className="button icon has-background-primary is-rounded has-text-white is-size-5" style={{ width: "120px", height: "40px" }} onClick={() => clickSendButton()}>
                                {/* <i className ="fas fa-user"></i> */}
                                <i className="fas fa-paper-plane"></i>
                                <p className="ml-3 ">Send</p>
                            </button>
                        </div>
                    </div>

                    <div  className="mt-4">
                        <p className="has-text-white">評価</p>
                    </div>
                    <div className="mt-1 py-1">
                        <textarea className="textarea" placeholder="" rows={10} value={gptOutput} readOnly>
                        </textarea>
                    </div>
                    {/* ボタン2 */}
                    <div className="columns is-centered mt-5">
                        <div className="column is-half ">
                            <div className="columns is-centered">
                                <button className="button is-light column is-four-fifths p-0">
                                    Cancel
                                </button>
                            </div>
                        </div>
                        <div className="column is-half ">
                            <div className="columns is-centered">
                                <button className="button is-danger column is-four-fifths p-0 has-text-white">
                                    Complete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}