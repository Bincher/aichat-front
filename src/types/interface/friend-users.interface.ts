import UserList from "./user-list.interface";

export default interface FriendUsers {
    code: string;
    message: string;
    friends: UserList[]; 
}