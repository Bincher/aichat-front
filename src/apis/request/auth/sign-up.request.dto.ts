export default interface SignUpRequestDto{
    loginId: string;
    password: string;
    email: string;
    certificationNumber: string;
    nickname: string;
    agreedPersonal: boolean;
}