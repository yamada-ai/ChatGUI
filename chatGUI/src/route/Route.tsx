import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { About } from "../component/About";
// import { Contact } from "../component/Contact";
import { ChatGUI } from "../component/ChatGUI";
import { PatientSelector } from "../component/PatientSelector";
import { Observation } from "../component/Observation";
import { Login } from '../component/Login'

import { UserContextProvider } from "../contexts"

// 参考
// https://zenn.dev/bluetree/articles/a66546b56c2791
export const RouterConfig = () => {
    return (
        <>
            <UserContextProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/chat" element={<ChatGUI />} />
                        <Route path="/patient" element={<PatientSelector />} />
                        <Route path="/observation" element={<Observation />} />
                        <Route path="/login" element={<Login />} />
                        {/* <Route path="/room/:room_id" element={<ChatGUI />} /> */}
                    </Routes>
                </BrowserRouter>
            </UserContextProvider>
        </>
    );
};