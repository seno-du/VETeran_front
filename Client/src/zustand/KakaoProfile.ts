import { create } from "zustand";

interface Profile {
    username: string;
    userNum: number;
    token: string;
    userEmail: string;
    setUsername : (username : string) => void;
    setUserNum : (userNum : number) => void;
    setToken : (token : string) => void;
    setUserEmail: (email : string) => void;
}
export const useProfileStore = create<Profile>()(set => ({
    username: "",
    userNum: -1,
    token: "",
    userEmail:"",
    setUsername : (username : string) => set({username}),
    setUserNum : (userNum : number) => set({userNum}),
    setToken : (token : string) => set({token}),
    setUserEmail : (userEmail : string) => set({userEmail})
}))