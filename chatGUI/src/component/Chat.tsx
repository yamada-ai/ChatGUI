

type Params = {
    text : string
    is_gpt : boolean
    turn : number

}

export const Chat = (params:Params) => {
    return (
        <>
            <div className={"my-5 is-flex "+(params.is_gpt?"is-flex-direction-row":"is-flex-direction-row-reverse")}>
                <div style={{width:"70%"}}>
                    <div className={"is-flex "+(params.is_gpt?"is-flex-direction-row":"is-flex-direction-row-reverse")}>
                        <div className="is-size-3 mx-3">
                            <i className={"fas "+(params.is_gpt?"fa-user":"fa-user-md")} ></i>
                        </div>
                        <div className={"py-3 px-4 is-size-6 is-family-sans-serif "+(params.is_gpt? "has-background-grey-darker has-text-white":"has-background-link has-text-white") } style={{borderRadius:"14px", maxWidth:"100%", wordBreak:"break-word", wordWrap:"break-word", whiteSpace:"pre-wrap"}}>
                            {params.text}
                        </div> 
                    </div>
                    
                </div>
            </div>
        </>
    );
};