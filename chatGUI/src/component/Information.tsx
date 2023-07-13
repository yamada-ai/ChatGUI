import { UserContext } from "../contexts";
import { useContext, useEffect, useState } from "react";

import { getPatientBacicInfo } from "../api_wrapper";

export const Information = () => {

    const { user_id, room_id } = useContext(UserContext)
    const [basicInfo, setBasicInfo] = useState({});

    useEffect(() => {
        const getPatientBacicInfo_async = async () => {
            const gotBasicInfo = await getPatientBacicInfo(user_id, room_id)
            setBasicInfo(gotBasicInfo)
            console.log("response", gotBasicInfo)
        }
        getPatientBacicInfo_async()
    }, [])

    return (
        <div className="column" style={{ height: "100%" }}>
            {/* <p>医療面接の流れ!"!</p> */}
            <div className="coulmns is-centered mt-6" style={{ height: "100%" }}>
                <div className="coulumn is-11 has-background-success-light p-2" style={{ height: "70%", borderRadius: "10px" }}>
                    <div className="m-1 p-1 has-background-info-light" style={{ border: "2px dashed #3273dc" }}>
                        <div className="level has-background-link my-2 mx-3">
                            <p className="level-item has-text-white">
                                医療面接の流れ
                            </p>
                        </div>
                        <p>1. 挨拶</p>
                        <p>2. 名前の確認と自己紹介</p>
                        <p>3. 主訴と現病歴について質問</p>
                        <p>4. 補足事項を質問</p>
                        <p>5. 要約，確認</p>
                        <p>6. 診断と治療方針の伝達</p>
                        <p>7. クロージング</p>
                    </div>
                    <div className="mx-1 p-1 has-background-info-light mt-3" style={{ border: "2px dashed #23D160" }}>
                        <div className="level has-background-success my-2 mx-3">
                            <p className="level-item has-text-white">
                                患者情報
                            </p>
                        </div>
                        <p>名前:{basicInfo.name}</p>
                        <p>性別:{basicInfo.sex}</p>
                        <p>年齢:{basicInfo.age}</p>
                        <p>場面:{basicInfo.config}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}