import { useEffect, useState } from 'react';
import { getImg_test } from "../api_wrapper";

type Params = {
    text : string
    is_gpt : boolean
    turn : number
    imageSrc:string
}

export const Chat = (params:Params) => {
    // const [imageSrc, setImageSrc] = useState('');

    // useEffect( () => {

        // const get_img_test_async = async() => {
        //     const url = await getImg_test()
        //     setImageSrc(url)
        //     console.log(typeof(imageSrc))
        // }
        // get_img_test_async();
    // }, [])

    if(params.is_gpt){
        return(
            <div className={"my-5 is-flex is-flex-direction-row "}>
            <div style={{width:"70%"}}>
                <div className={"is-flex is-flex-direction-row"}>
                    <div className="is-size-3 mx-3" style={{ flexShrink:"0"}}>
                        {/* <i className={"fas "+(params.is_gpt?"fa-user":"fa-user-md")} ></i> */}
                        <img src={params.imageSrc}  width="50" height="50"/>
                    </div>
                    <div className={"py-3 px-4 is-size-6 is-family-sans-serif has-background-grey-darker has-text-white"} style={{borderRadius:"14px", maxWidth:"100%", wordBreak:"break-word", wordWrap:"break-word", whiteSpace:"pre-wrap"}}>
                        {params.text}
                    </div> 
                </div>
                
            </div>
        </div>
        )
    }else{
        return(
            <div className={"my-5 is-flex is-flex-direction-row-reverse"}>
                <div style={{width:"70%"}}>
                    <div className={"is-flex is-flex-direction-row-reverse"}>
                        <div className="is-size-3 mx-3">
                            <i className={"fas "+(params.is_gpt?"fa-user":"fa-user-md")} ></i>
                        </div>
                        <div className={"py-3 px-4 is-size-6 is-family-sans-serif has-background-link has-text-white" } style={{borderRadius:"14px", maxWidth:"100%", wordBreak:"break-word", wordWrap:"break-word", whiteSpace:"pre-wrap"}}>
                            {params.text}
                        </div> 
                    </div>
                    
                </div>
            </div>
        )
    }
};