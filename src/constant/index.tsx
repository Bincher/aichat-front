export const MAIN_PATH =()=> '/'
export const AUTH_PATH =()=> '/auth'
export const USER_PATH =(userEmail: string)=> `/user/${userEmail}`
export const CHAT_PATH =(chatId: number)=> `/chat/${chatId}`
export const CHAT_DETAIL_PATH =(chatId: number)=> `/chat/detail/${chatId}`