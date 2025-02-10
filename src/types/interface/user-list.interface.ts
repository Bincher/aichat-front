export default interface UserList {
    nickname: string;
    profileImage: string | null; // 프로필 이미지가 없을 수도 있으므로 null 허용
}