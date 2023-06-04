import { createContext, useState} from 'react';

// type LoginContextValue = {
//     user_id: number | null;
// };

// export const LoginContext = createContext<LoginContextValue>({} as LoginContextValue);

// export const AuthProvider = ({children}) => {
//     const [user_id, setAuthToken] = useState(-1);
//     const login = (token) => {
//         setAuthToken(token);
//     };
    
//     const logout = () => {
//         setAuthToken(null);
//     };
//     return (
//         <LoginContext.Provider value={{ user_id, login, logout }}>
//             {children}
//         </LoginContext.Provider>
//     );

// }

// type RoomContextID = {
//     room_id: number;
// };

// export const SelectedRoomID = createContext<RoomContextID>({} as RoomContextID);

// export const RoomProvider = ({children}) => {
//     const [room_id, setRoomID] = useState(-1);
//     const selectRoom = (id) => {
//         setRoomID();
//     };
    
//     const logout = () => {
//         setAuthToken(null);
//     };
//     return (
//         <LoginContext.Provider value={{ user_id, login, logout }}>
//             {children}
//         </LoginContext.Provider>
//     );

// }

type UserContextValue = {
    user_id: number
    room_id: number
};

export const UserContext = createContext<UserContextValue>({} as UserContextValue);

export const UserContextProvider = ({children}) => {
    const [user_id, setAuthToken] = useState(-1);
    const [room_id, setRoomID] = useState(-1);

    const login = (token:number) => {
        setAuthToken(token);
    };
    
    const logout = () => {
        setAuthToken(-1);
    };
    const selectRoom = (id:number) => {
        setRoomID(id);
    };
    return (
        <UserContext.Provider value={{ user_id, login, logout, room_id, selectRoom}}>
            {children}
        </UserContext.Provider>
    );

}