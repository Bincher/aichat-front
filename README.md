![Image](https://github.com/user-attachments/assets/15f80fc4-c1c4-4ad1-8efb-1252cfdad1cb)

<br/>
<br/>

# 1. Project Overview (프로젝트 개요)
- 프로젝트 이름: Chat with AI Secretary
- 프로젝트 설명: AI 비서 기능이 포함되어있는 웹 채팅 서비스
- 상세 정보(노션) : https://bincher.notion.site/AI-173ee2939d998095be62d57686e61c0c?pvs=74

<br/>
<br/>

# 2. Team Members (참여 인원)
| 김성빈 |
|:------:|
| <img src="https://github.com/user-attachments/assets/ac57804b-89b1-46f4-a7c0-afe2000f1d67" alt="김성빈" width="150"> |
| -- |
| [GitHub](github.com/Bincher) |

<br/>
<br/>

# 3. Key Features (주요 기능)
- **회원가입**:
  - 회원가입시 아이디, 비밀번호, 이메일을 입력하여 DB에 저장합니다.
  - 개인정보 제공 동의란에 동의를 해야합니다.
  - 중복되지 않은 이메일을 통해 인증을 받아야됩니다.

- **로그인**:
  - 사용자 인증 정보를 통해 로그인 합니다.

- **나의 채팅방**:
  - 로그인 후 내가 속해있는 채팅방의 목록이 나열됩니다.
  - 각 채팅방에는 채팅방의 이름과 소속 인원들의 닉네임 및 프로필 사진이 나옵니다.
  - 채팅방을 클릭하면 해당 채팅방으로 접속합니다.

- **친구 초대**:
  - 채팅방을 만들때 친구를 초대해야합니다.
  - 친구를 초대하기 위해선 "친구 초대 버튼"을 클릭합니다.
  - 그리고 원하는 유저의 닉네임(의 일부)을 입력합니다.
  - 해당 유저가 나오면 친구 추가를 클릭합니다.
  - 만약 상대가 미리 친구 요청을 날렸었다면 아래 요청 수락 및 거절과 상관없이 바로 친구가 됩니다.

- **친구 요청 수락 및 거절**:
  - 친구 요청을 받은 상대방은 친구 요청 목록에 상대방의 정보가 나오게 됩니다.
  - 친구 요청을 수락하면 그때부터 친구가 됩니다.
  - 친구 요청을 거부하면 친구가 되지 않습니다.

- **친구 목록 보기**:
  - "친구 목록"을 클릭하면 현재 본인의 친구 목록을 볼 수 있습니다.
  - 만약 삭제하고 싶은 친구가 있으면 삭제버튼을 클릭하면 됩니다.

- **채팅방 만들기**:
  - "채팅방 만들기"를 클릭하여 채팅방을 만들 수 있습니다.
  - 채팅방의 이름과 참여할 친구들을 선택하고 생성합니다.

- **채팅**:
  - 웹에서 채팅을 즐길 수 있습니다.
  - 나의 채팅은 오른쪽에 있으며 그외의 채팅은 왼쪽에 있습니다.

- **AI 비서**:
  - 각 채팅 옆에 "Fact Check" 버튼이 있습니다.
  - "Fact Check" 버튼을 클릭하면 해당 채팅이 거짓인지 AI가 판별하고 여러분께 말씀드립니다.
  - 입력창 옆 "AI Secretary" 버튼을 클릭하시면 4가지 옵션이 있습니다.
  - "맞춤법 검사"는 현재 쓸려는 채팅이 맞춤법에 맞는지 AI가 설명해줍니다.
  - "팩트 체크"는 현재 쓸려는 채팅이 거짓인지 AI가 판별해줍니다.
  - "채팅 내용 요약"은 현재 채팅방의 내용들을 AI가 요약해줍니다.
  - "상황에 맞는 추천 답변"은 지금까지의 채팅을 분석하여 적절한 대답을 AI가 조언해줍니다. 

<br/>
<br/>

# 4. Tasks & Responsibilities (작업 및 역할 분담)
|  |  |  |
|-----------------|-----------------|-----------------|
| 김성빈    |  <img src="https://github.com/user-attachments/assets/ac57804b-89b1-46f4-a7c0-afe2000f1d67" alt="김성빈" width="100"> | <ul><li>프로젝트 계획 및 관리</li><li>서비스 분석 및 설계</li><li>API 개발 및 외부 API 관리</li></ul>     |

<br/>
<br/>

# 5. Technology Stack (기술 스택)
## 5.1 Language
|  |  |
|-----------------|-----------------|
| Typescript    |  <img src="https://github.com/user-attachments/assets/3b24fc71-71b8-4336-be20-ef9bf59ad860" alt="Typescript" width="100"> | 
| Java    |  <img src="https://github.com/user-attachments/assets/63495fd3-7605-4127-b3f0-f1e966e0a531" alt="Java" width="100"> | 

<br/>

## 5.2 Frotend
|  |  |
|-----------------|-----------------|
| React    |  <img src="https://github.com/user-attachments/assets/3781c483-07f6-4763-8a71-83ad8d7e4687" alt="React" width="100"> |

<br/>

## 5.3 Backend
|  |  |
|-----------------|-----------------|
| Spring    |  <img src="https://github.com/user-attachments/assets/6fa30d55-4333-4ee6-ba6b-6a809d29bfa6" alt="Spring" width="100">    |

<br/>

## 5.4 Database
|  |  |
|-----------------|-----------------|
| mySQL    |  <img src="https://github.com/user-attachments/assets/2aa67111-bcd8-4d75-8e92-dd4e69a4c01a" alt="mySQL" width="100">    |
| mongoDB    |  <img src="https://github.com/user-attachments/assets/b4ed1853-2e31-4cdd-8418-482942cbf1f6" alt="mongoDB" width="100">    |

<br/>
