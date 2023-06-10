import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from 'react';

import {getUserID, postUser } from "../api_wrapper";

import { UserContext } from '../contexts';

export const Login = () => {

	const [user_id, setUserID] = useState(-1);

	const [newUserName, setNewUserName] = useState("");

	const [user_name, setUserName] = useState("");

	const [isActive, setActive] = useState(false);

	const navigation = useNavigate()

	const { login } = useContext(UserContext);

	// useEffect(() => {
	// 	axios.get(urlAPI)
	// 		.then( response => {
	// 			setPosts(JSON.parse(response.data))
	// 			// console.log("posts", posts)
	// 			// console.log("response", response.data)
	// 		})
	// }, [])

	// function aa(){
	// 	console.log("posts2", posts)
	// 	return <h1>{posts[0]}</h1>;
	// }

	const handleLogin = async () => {
		if (user_name===""){
			alert("User Name が入力されていません")
			return
		}
		const getUserID_async = async() => {
			const got_user_id = await getUserID(user_name);
			return got_user_id["user_id"]
		}
		// axios.get(urlAPI+"user/"+user_name)
		// 	.then( response => {
		// 		const user_id_ = Number(JSON.parse(response.data)["user_id"])
		// 		setUserID(Number(JSON.parse(response.data)["user_id"]))
		// 		if(user_id_ > 0){
		// 			console.log("exist");
		// 			navigation("/chat/")
		// 			login(user_id_);
		// 		}else{
		// 			console.log("not found")
		// 			alert("ユーザが見つかりませんでした．初めての場合は Sign up して下さい")
		// 			setUserName("");
		// 		}
		// 	})
		const user_id_ = await getUserID_async()
		console.log("getUserID:", user_id_)
		if(user_id_ > 0){
			console.log("exist");
			// navigation("/chat/")
			navigation("/patient/")
			login(user_id_);
		}
		else{
			console.log("not found")
			alert("ユーザが見つかりませんでした．初めての場合は Sign up して下さい")
			setUserName("");
		}
	}

	const clickSignUp = () => {
        setActive(true);
    }

	const closeModal = () => {
        setActive(false);
    }

	const  createUser = async () => {
		if(newUserName === ""){
			alert("User Name が入力されていません")
			return;
		}
		// ユーザが存在するか
		const user_check = await getUserID(newUserName);
		if(user_check.user_id >= 0){
			alert("このユーザ名は既に使われています")
			return
		}
		const user = await postUser(newUserName)
		if(user.user_id > 0 ){
			navigation("/patient/")
			login(user.user_id);
		}

	}

	return (
		<div className="mx-0">
			{/* ヘッダー */}
			<div className="columns">
				<div className="has-background-primary px-2 py-2 column  is-full">
					<p className="has-text-white is-size-1 pl-2">Welcome ChatGUI</p>
				</div>
			</div>
			

			<div style={{height:100}}>
			{/* {
				posts.map((post, i) => (
					<div key={i}>{post.user_text}</div>
				))
			} */}

			</div>
			<div>
				<div className="columns is-centered">
					<div className="has-background-light column is-half">
						<div className="field px-6 pt-3">
						<label className="label">User Name</label>
							<p className="control has-icons-left">
								<input className="input" type="email" placeholder="input User Name" value={user_name} onChange={(event) => setUserName(event.target.value)}></input>
								<span className ="icon is-small is-left">
								<i className ="fas fa-user"></i>
								</span>
							</p>
						</div>
					</div>
				</div>
				<div className="columns is-centered">
					<div className="has-background-light column is-half">
						<div className="is-flex ">
							
							<div className="ml-6 py-1">
								<button className="button is-primary" onClick={() => clickSignUp()} >Sign up</button>
							</div>
							<div className="ml-4 py-1 ">
								<button className="button is-dark" onClick={handleLogin} >Login</button>
							</div>
						</div>
					</div>
				</div>
			</div>


			<div className={"modal "+(isActive? "is-active":"")} id="modal1">
                <div className="modal-background" onClick={()=>closeModal()}></div>
                <div className="modal-card">
                    <div className="modal-card-head">
                        新しいユーザを作成する
                    </div>
                    <div className="modal-card-body has-background-white p-4">
                        <p>User Name</p>
                        <input className="input" type="email" placeholder="input user name" value={newUserName} onChange={(event) => setNewUserName(event.target.value)}></input>
                    </div>
                    <div className="modal-card-foot">
                        <button className="button is-success" onClick={ ()=>createUser() }> Create</button>
                        <button className="button" onClick={ ()=>closeModal() }>Cancel</button>
                    </div>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={ ()=>closeModal() }></button>
            </div>

		</div>
	);
};