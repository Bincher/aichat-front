import { create } from "zustand";

interface ChatStore{
    roomName: string;
    setRoomName: (roomName: string) => void;
};

const useChatStore = create<ChatStore>(set =>({
    roomName: '',
    setRoomName: (roomName) => set(state => ({...state, roomName})),
}))

export default useChatStore;