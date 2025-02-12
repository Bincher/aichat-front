export const MAIN_PATH =()=> '/'
export const AUTH_PATH =()=> '/auth'
export const MY_CHAT_PATH =()=> '/mychat'
export const USER_PATH =(userEmail: string)=> `/user/${userEmail}`
export const CHAT_PATH =(chatRoomId: string)=> `/chatroom/${chatRoomId}`
export const CHAT_DETAIL_PATH =(chatId: number)=> `/chat/detail/${chatId}`