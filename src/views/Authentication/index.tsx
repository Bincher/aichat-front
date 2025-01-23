import { useState,KeyboardEvent, useRef, ChangeEvent, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import InputBox from "../../components/InputBox";
import './style.css';
import { SignInResponseDto } from "../../apis/response/auth";
import ResponseDto from "../../apis/response/Response.dto";
import { MAIN_PATH } from "../../constant";
import { signInRequest, signUpRequest } from "../../apis";
import { SignInRequestDto, SignUpRequestDto } from "../../apis/request/auth";

// component: 인증 화면 컴포넌트 //
export default function Authentication() {

    // state: 화면 상태 //
    const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');

    // state: 쿠키 상태 //
    const [cookies, setCookie] = useCookies();

    // function: 네비게이트 함수 //
    const navigate = useNavigate();

    // component: sign in card 컴포넌트 //
    const SignInCard =()=>{

        // state: 아이디 요소 참조 상태 //
        const loginIdRef = useRef<HTMLInputElement | null>(null);
    
        // state: 패스워드 요소 참조 상태 //
        const passwordRef = useRef<HTMLInputElement | null>(null);
    
        // state: 아이디 상태 //
        const [loginId, setLoginId] = useState<string>('');
    
        // state: 패스워드 상태 //
        const [password, setPassword] = useState<string>('');
    
        // state: 패스워드 타입 상태 //
        const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
    
        // state: 패스워드 버튼 아이콘 상태 //
        const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');
        
        // state: 에러 상태 //
        const [error, setError] = useState<boolean>(false);
    
        // function: sign in response 처리 함수 //
        const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null)=>{
            if(!responseBody){
                alert('네트워크 이상입니다.');
                return;
            }
            const{code} = responseBody;
            if(code === 'DBE')alert('데이터베이스 오류입니다.');
            if(code === 'SF' || code === 'VF') setError(true);
            if(code !== 'SU') return;
        
            const {token, expirationTime} = responseBody as SignInResponseDto;
            const now = new Date().getTime();
            const expires = new Date(now + expirationTime * 1000);
        
            setCookie('accessToken', token, {expires, path: MAIN_PATH()});
            navigate(MAIN_PATH());
        }
    
        // event handler: 아이디 변경 이벤트 처리 //
        const onLoginIdChangeHandler =(event: ChangeEvent<HTMLInputElement>)=>{
            setError(false);
            const {value} = event.target;
            setLoginId(value);
        }
    
        // event handler: 패스워드 변경 이벤트 처리 //
        const onPasswordChangeHandler =(event: ChangeEvent<HTMLInputElement>)=>{
            setError(false);
            const {value} = event.target;
            setPassword(value);
        }
    
        // event handler: 로그인 버튼 클릭 이벤트 처리 //
        const onSignInButtonClickHandler =()=>{
            const requestBody: SignInRequestDto = {
                loginId, password
            }
            signInRequest(requestBody).then(signInResponse);
        }
    
        // event handler: 회원가입 링크 클릭 이벤트 처리 //
        const onSignUpButtonClickHandler=()=>{
            setView('sign-up');
        }
    
        // event handler: 패스워드 버튼 클릭 이벤트 처리 //
        const onPasswordButtonClickHandler=()=>{
            if(passwordType === 'text'){
                setPasswordType('password');
                setPasswordButtonIcon('eye-light-off-icon');
            }else{
                setPasswordType('text');
                setPasswordButtonIcon('eye-light-on-icon');
            }
        }
    
        // event handler: 아이디 인풋 키 다운 이벤트 처리 //
        const onLoginIdKeyDownHandler=(event: KeyboardEvent<HTMLInputElement>)=>{
            if(event.key !== 'Enter') return;
            if(!passwordRef.current) return;
            passwordRef.current.focus();
        }
    
        // event handler: 패스워드 인풋 키 다운 이벤트 처리 //
        const onPasswordKeyDownHandler=(event: KeyboardEvent<HTMLInputElement>)=>{
            if(event.key !== 'Enter') return;
            onSignInButtonClickHandler();
        }
    
        // render: sign in card 컴포넌트 렌더링 //
        return (
            <div className='auth-card'>
                <div className='auth-card-box'>
                    <div className='auth-card-top'>
                        <div className='auth-card-title-box'>
                            <div className='auth-card-title'>{'로그인'}</div>
                        </div>
                        <InputBox ref={loginIdRef} label='아이디' type='text' placeholder='아이디를 입력해주세요' error={error} value={loginId} onChange={onLoginIdChangeHandler} onKeyDown={onLoginIdKeyDownHandler}/>
                        <InputBox ref={passwordRef} label='패스워드' type={passwordType} placeholder='비밀번호를 입력해주세요' error={error} value={password} onChange={onPasswordChangeHandler} icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler}/>
                    </div>
                    <div className='auth-card-bottom'>
                        {error &&
                            <div className='auth-sign-in-error-box'>
                                <div className='auth-sign-in-error-message'>
                                    {'아이디 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해주세요.'}
                                </div>
                            </div>
                        }
                        <div className='black-large-full-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>
                        <div className='auth-description-box'>{'신규 사용자이신가요? '}
                            <span className='auth-description-link' onClick={onSignUpButtonClickHandler}>{" 회원가입"}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // component: sign up card 컴포넌트 //
    const SignUpCard =()=>{

        // state: 아이디 요소 참조 상태 //
        const loginIdRef = useRef<HTMLInputElement | null>(null);
    
        // state: 패스워드 요소 참조 상태 //
        const passwordRef = useRef<HTMLInputElement | null>(null);
        
        // state: 패스워드 확인 요소 참조 상태 //
        const passwordCheckRef = useRef<HTMLInputElement | null>(null);
    
        // state: 닉네임 요소 참조 상태 //
        const nicknameRef = useRef<HTMLInputElement | null>(null);

        // state: 이메일 요소 참조 상태 //
        const emailRef = useRef<HTMLInputElement | null>(null);

        // state: 이메일 인증 번호 참조 상태 //
        const certificationNumberRef = useRef<HTMLInputElement | null>(null);
    
        // state: 약관 동의 요소 참조 상태 //
        const agreedPersonalRef = useRef<HTMLInputElement | null>(null);
    
        // state: 페이지 번호 상태 //
        const [page, setPage] = useState<1 | 2>(1); 

        // state: 아이디 상태 //
        const [loginId, setLoginId] = useState<string>('');
    
        // state: 패스워드 상태 //
        const [password, setPassword] = useState<string>('');
    
        // state: 패스워드 확인 상태 //
        const [passwordCheck, setPasswordCheck] = useState<string>('');
    
        // state: 닉네임 상태 //
        const [nickname, setNickname] = useState<string>('');

        // state: 이메일 상태 //
        const [email, setEmail] = useState<string>('');

        // state: 이메일 인증 번호 상태 //
        const [certificationNumber, setCertificationNumber] = useState<string>('');
    
        // state: 약관 동의 상태 //
        const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);
    
        // state: 패스워드 타입 상태 //
        const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
    
        // state: 패스워드 체크 타입 상태 //
        const [passwordCheckType, setPasswordCheckType] = useState<'text' | 'password'>('password');

        // state: 아이디 에러 상태 //
        const [isLoginIdError, setLoginIdError] = useState<boolean>(false);
    
        // state: 패스워드 에러 상태 //
        const [isPasswordError, setPasswordError] = useState<boolean>(false);
    
        // state: 패스워드 확인 에러 상태 //
        const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);

        // state: 이메일 에러 상태 //
        const [isEmailError, setEmailError] = useState<boolean>(false);

        // state: 이메일 인증 번호 에러 상태 //
        const [isCertificationNumberError, setCertificationNumberError] = useState<boolean>(false);
    
        // state: 닉네임 에러 상태 //
        const [isNicknameError, setNicknameError] = useState<boolean>(false);
    
        // state: 개인 정보 동의 에러 상태 //
        const [isAgreedPersonalError, setAgreedPersonalError] = useState<boolean>(false);
    
        // state: 아이디 에러 메세지 상태 //
        const [loginIdErrorMessage, setLoginIdErrorMessage] = useState<string>('');
    
        // state: 패스워드 에러 메세지 상태 //
        const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
    
        // state: 패스워드 확인 에러 메세지 상태 //
        const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>('');

        // state: 이메일 에러 메세지 상태 //
        const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');

        // state: 이메일 인증 번호 에러 메세지 상태 //
        const [certificationNumberErrorMessage, setCertificationNumberErrorMessage] = useState<string>('');
    
        // state: 닉네임 에러 메세지 상태 //
        const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>('');
    
        // state: 패스워드 버튼 아이콘 상태 //
        const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');
    
        // state: 패스워드 확인 버튼 아이콘 상태 //
        const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');
    
    
        // function: sign up response 처리 함수 //
        const signUpResponse = () => {
            setView('sign-in');
        }

        // event handler: 아이디 변경 이벤트 처리 //
        const onLoginIdChangeHandler = (event:ChangeEvent<HTMLInputElement>) =>{
            const {value} = event.target;
            setLoginId(value);
            setLoginIdError(false);
            setLoginIdErrorMessage('');
        }
    
        // event handler: 패스워드 변경 이벤트 처리 //
        const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>)=>{
            const {value} = event.target;
            setPassword(value);
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
    
        // event handler: 패스워드 변경 체크 이벤트 처리 //
        const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>)=>{
            const {value} = event.target;
            setPasswordCheck(value);
            setPasswordCheckError(false);
            setPasswordCheckErrorMessage('');
        }

        // event handler: 이메일 변경 이벤트 처리 //
        const onEmailChangeHandler = (event:ChangeEvent<HTMLInputElement>) =>{
            const {value} = event.target;
            setEmail(value);
            setEmailError(false);
            setEmailErrorMessage('');
        }

        // event handler: 이메일 인증 번호 변경 이벤트 처리 //
        const onCertificationNumberChangeHandler = (event:ChangeEvent<HTMLInputElement>) =>{
            const {value} = event.target;
            setCertificationNumber(value);
            setCertificationNumberError(false);
            setCertificationNumberErrorMessage('');
        }
    
        // event handler: 닉네임 변경 체크 이벤트 처리 //
        const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>)=>{
            const {value} = event.target;
            setNickname(value);
            setNicknameError(false);
            setNicknameErrorMessage('');
        }
    
        // event handler: 개인 정보 동의 체크 박스 클릭 이벤트 처리 //
        const onAgreedPersonalClickHandler =()=>{
            setAgreedPersonal(!agreedPersonal);
            setAgreedPersonalError(false);
        }
    
        // event handler: 패스워드 버튼 클릭 이벤트 처리 //
        const onPasswordButtonClickHandler =()=>{
            if(passwordButtonIcon === 'eye-light-off-icon'){
            setPasswordButtonIcon('eye-light-on-icon');
            setPasswordType('text');
            }else{
            setPasswordButtonIcon('eye-light-off-icon');
            setPasswordType('password');
            }
        }
    
        // event handler: 패스워드 확인 버튼 클릭 이벤트 처리 //
        const onPasswordCheckButtonClickHandler =()=>{
            if(passwordCheckButtonIcon === 'eye-light-off-icon'){
            setPasswordCheckButtonIcon('eye-light-on-icon');
            setPasswordCheckType('text');
            }else{
            setPasswordCheckButtonIcon('eye-light-off-icon');
            setPasswordCheckType('password');
            }
        }
    
    
        // event handler: 다음 버튼 클릭 이벤트 처리 //
        const onNextButtonClickHandler=()=>{
    
            // const emailPattern = /^[a-zA-Z0-9]*@([-,]?[a-zA-Z0-9])*\.[a-zA-z]{2,4}$/;
    
            // const isEmailPattern = emailPattern.test(email);
            // if(!isEmailPattern){
            //     setEmailError(true);
            //     setEmailErrorMessage('이메일 주소 포맷이 맞지 않습니다.');
            // }
    
            const isCheckedPassword = password.trim().length >= 8;
            if(!isCheckedPassword){
                setPasswordError(true);
                setPasswordErrorMessage('비밀번호를 8자 이상으로 설정해야합니다.');
            }
    
            const isEqualPassword = password === passwordCheck;
            if(!isEqualPassword){
                setPasswordCheckError(true);
                setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다');
            }
    
            if(!isCheckedPassword || !isEqualPassword) return;
    
            setPage(2);
        }
    
        // event handler: 회원 가입 버튼 클릭 이벤트 처리 //
        const onSignUpButtonClickHandler =()=>{
            const emailPattern = /^[a-zA-Z0-9]*@([-,]?[a-zA-Z0-9])*\.[a-zA-z]{2,4}$/;

            const isEmailPattern = emailPattern.test(email);
            if(!isEmailPattern){
                setEmailError(true);
                setEmailErrorMessage('이메일 주소 포맷이 맞지 않습니다.');
            }

            const isCheckedPassword = password.trim().length >= 8;
            if(!isCheckedPassword){
                setPasswordError(true);
                setPasswordErrorMessage('비밀번호를 8자 이상으로 설정해야합니다.');
            }

            const isEqualPassword = password === passwordCheck;
            if(!isEqualPassword){
                setPasswordCheckError(true);
                setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다');
            }

            if(!isEmailPattern || !isCheckedPassword || !isEqualPassword){
                setPage(1);
                return;
            };

            const hasNickname = nickname.trim().length !== 0;
            if(!hasNickname){
                setNicknameError(true);
                setNicknameErrorMessage('닉네임을 입력해주세요');
            }

            if(!agreedPersonal){
                setAgreedPersonalError(true);
            }

            if(!hasNickname || !agreedPersonal) return;

            const requestBody: SignUpRequestDto = {
                loginId, password, email, nickname, certificationNumber, agreedPersonal
            }

            signUpRequest(requestBody).then(signUpResponse);
        }
    
        // event handler: 로그인 링크 클릭 이벤트 처리 //
        const onSignInLinkClickHandler =()=>{
            setView('sign-in');
        }

        // event handler: 이메일 키 다운 이벤트 처리 //
        const onLoginIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>)=>{
            if(event.key !== 'Enter') return;
            if(!passwordRef.current) return;
            passwordRef.current.focus();
        }
    
        // event handler: 패스워드 키 다운 이벤트 처리 //
        const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>)=>{
            if(event.key !== 'Enter') return;
            if(!passwordCheckRef.current) return;
            passwordCheckRef.current.focus();
        }
    
        // event handler: 패스워드 확인 키 다운 이벤트 처리 //
        const onPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>)=>{
            if(event.key !== 'Enter') return;
            onNextButtonClickHandler();

        }

        // event handler: 이메일 키 다운 이벤트 처리 //
        const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>)=>{
            if(event.key !== 'Enter') return;
            if(!certificationNumberRef.current) return;
            certificationNumberRef.current.focus();
        }

        // event handler: 이메일 인증 번호 키 다운 이벤트 처리 //
        const onCertificationNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>)=>{
            if(event.key !== 'Enter') return;
            if(!nicknameRef.current) return;
            nicknameRef.current.focus();
        }

        // event handler: 닉네임 키 다운 이벤트 처리 //
        const onNicknameKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>)=>{
            if(event.key !== 'Enter') return;
            onSignUpButtonClickHandler();
        }
    
        // effect: 2페이지로 넘어갈때마다 실행될 함수 //
        useEffect(()=>{
            if(page === 2){
                if(!emailRef.current) return;
                emailRef.current.focus();
            }
        }, [page])
    
        // render: sign up card 컴포넌트 렌더링 //
        return (
            <div className='auth-card'>
            <div className='auth-card-box'>
                <div className='auth-card-top'>
                <div className='auth-card-title-box'>
                    <div className='auth-card-title'>{'회원가입'}</div>
                    <div className='auth-card-page'>{`${page}/2`}</div>
                </div>
                {page === 1 && (
                    <>
                    <InputBox ref={loginIdRef} label='아이디*' type='text' placeholder='아이디를 입력해주세요.' value={loginId} onChange={onLoginIdChangeHandler} error={isLoginIdError} message={loginIdErrorMessage} onKeyDown={onLoginIdKeyDownHandler}/>
                    <InputBox ref={passwordRef} label='비밀번호*' type={passwordType} placeholder='비밀번호를 입력해주세요.' value={password} onChange={onPasswordChangeHandler} error={isPasswordError} message={passwordErrorMessage} icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler}/>
                    <InputBox ref={passwordCheckRef} label='비밀번호 확인*' type={passwordCheckType} placeholder='비밀번호를 다시 입력해주세요.' value={passwordCheck} onChange={onPasswordCheckChangeHandler} error={isPasswordCheckError} message={passwordCheckErrorMessage} icon={passwordCheckButtonIcon} onButtonClick={onPasswordCheckButtonClickHandler} onKeyDown={onPasswordCheckKeyDownHandler}/>
                    </>
                )}
                {page === 2 &&(
                    <>
                    <InputBox ref={emailRef} label='이메일 주소*' type='text' placeholder='이메일 주소를 입력해주세요.' value={email} onChange={onEmailChangeHandler} error={isEmailError} message={emailErrorMessage} onKeyDown={onEmailKeyDownHandler}/>
                    <InputBox ref={certificationNumberRef} label='이메일 인증 번호*' type='text' placeholder='이메일 인증 번호를 입력해주세요.' value={email} onChange={onCertificationNumberChangeHandler} error={isCertificationNumberError} message={certificationNumberErrorMessage} onKeyDown={onCertificationNumberKeyDownHandler}/>
                    <InputBox ref={nicknameRef} label='닉네임*' type='text' placeholder='닉네임을 입력해주세요.' value={nickname} onChange={onNicknameChangeHandler} error={isNicknameError} message={nicknameErrorMessage} onKeyDown={onNicknameKeyDownHandler}/>
                    </>
                )}
                </div>
                <div className='auth-card-bottom'>
                {page === 1 && (
                    <div className='black-large-full-button' onClick={onNextButtonClickHandler}>{'다음단계'}</div>
                )}
                {page === 2 && (
                    <>
                    <div className='auth-consent-box'>
                        <div className='auth-check-box' onClick={onAgreedPersonalClickHandler}>
                        <div className={`icon ${agreedPersonal ? 'check-round-fill-icon' : 'check-ring-round-icon'}`}></div>
                        </div>
                        <div className={isAgreedPersonalError ? 'auth-consent-title-error' : 'auth-consent-title'}>{'개인정보 동의'}</div>
                        <div className='auth-consent-link'>{'더보기 >'}</div>
                    </div>
                    <div className='black-large-full-button' onClick={onSignUpButtonClickHandler}>{'회원가입'}</div>
                    </>
                )}
                <div className='auth-description-box'>{'이미 계정이 있으신가요? '}
                    <span className='auth-description-link' onClick={onSignInLinkClickHandler}>{"로그인"}</span>
                </div>
                </div>
            </div>
            </div>
        );
    }

    // render: 인증 화면 렌더링 //
    return (
        <div id="auth-wrapper">
            <div className='auth-container'>
            <div className='auth-jumbotron-box'>
                <div className='auth-jumbotron-contents'>
                <div className='auth-logo-icon'></div>
                <div className='auth-jumbotron-text-box'>
                    <div className='auth-jumbotron-text'>{'CHAT with AI Secretary'}</div>
                    <div className='auth-jumbotron-text'>{''}</div>
                    <div className='auth-jumbotron-text'>{'지금 회원가입하고'}</div>
                    <div className='auth-jumbotron-text'>{'무료로 이용해보세요'}</div>
                </div>
                </div>
            </div>
            {view === 'sign-in' && <SignInCard />}
            {view === 'sign-up' && <SignUpCard />}
            </div>
        </div>
    )
}