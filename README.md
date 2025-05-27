# 수원대학교 동아리 FLAG 프로젝트  -  우리학교 동아리 다 모임 '동구라미'

[![Vue.js](https://img.shields.io/badge/Vue.js-3.4.21-42b883?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vue CLI](https://img.shields.io/badge/Vue%20CLI-5.0.8-42b883?style=for-the-badge&logo=vue.js&logoColor=white)](https://cli.vuejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white)](https://www.javascript.com/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

수원대학교 학생들의 편리한 동아리 활동을 위한 서비스인 '동구라미' 서비스의 관리자 및 개발자 페이지를 제작.

## 팀원
1. 팀장 : 24 반영진
2. 팀원 : 21 박준석, 24 이재윤

전 개발자 : 20 이동수, 20 박성재, 22 김수민, 22 노경미

## ✨ 주요 기능

- 👨🏻‍💼 **회장단 페이지**:
  
    - 첫 로그인 및 동아리장 이름 변경 후 이용 약관 동의 팝업
    - 동아리정보 수정
    - 동아리 회원 추가
    - 중복 회원 추가
    - 회원 퇴출
    - 비회원 가입 요청 목록
    - 동아리 소개/모집글 조회 (팝업창)
    - 동아리 소개/모집글 작성
    - 동아리 지원 합격 처리
    - 동아리 지원 추가 합격 처리
    - 공지사항 조회

- 👨🏻‍💻 **운영팀 페이지**:
  
    - 동아리 정보 조회
    - 동아리 삭제
    - 동아리 리스트 페이지네이션
    - 동아리 위치 정보 수정
    - 동아리 카테고리 설정
    - 동아리 추가
    - 공지사항 작성, 수정, 삭제

## 🏗️ 프로젝트 구조 (Frontend - vue.js)
```
USW-Circle-Link-Web/
│
├── public/                  # 이미지 에셋
│
└── src/
    ├── assets/              # CSS 에셋
    ├── components/          # 페이지 컴포넌트
    │   │
    │   ├── Admin/           # 운영팀 페이지 컴포넌트
    │   ├── ClubLeader/      # 회장단 페이지 컴포넌트
    │   ├── Login            # 로그인 페이지 컴포넌트
    │   ├── User             # 사용자 페이지 컴포넌트 (미배포)
    │   └── departments.js   # 학과 정보 데이터
    │
    ├── router/              # 메인 라우팅 설정
    ├── store/               # Vuex를 활용한 상태 관리(store) 설정 파일
    ├── App.js               # 메인 애플리케이션 컴포넌트
    ├── axios.js             # 인증 토큰을 자동 처리, 토큰 만료 시 재발급 후 재요청, Axios HTTP 클라이언트 설정 파일
    ├── main.js              # 애플리케이션 진입점
    └── index.html

```

## 🚀 설치 및 실행 방법

### 준비물

- Node.js (v18.x 이상 권장)
- npm

### 설치 단계

1.  **저장소 클론하기**
    ```bash
    git clone https://github.com/USW-Circle-Link/USW-Circle-Link-Web.git
    cd USW-Circle-Link-Web
    ```
    
2.  **필요한 패키지 설치**
    ```bash
    npm install
    npm install axios core-js firebase googleapis readline-sync router sortablejs vue@3.2.13 vue-router@4.4.5 vuex@4.1.0 vuedraggable xlsx
    npm install -D @babel/core@7.12.16 @babel/eslint-parser@7.12.16 @vue/cli-plugin-babel@5.0.0 @vue/cli-plugin-eslint@5.0.0 @vue/cli-plugin-router@5.0.0 @vue/cli-service@5.0.0 eslint@7.32.0 eslint-plugin-vue@8.0.3
    ```

3.  **서버 실행**
    ```bash
    npm run serve
    ```
    실행 후 브라우저에서 `http://localhost:8080/`로 접속하여 웹사이트를 확인할 수 있습니다.




## 💻 개발자 주의사항

###  ⚠️ 메인서버, 테스트 서버 도메인 주소 절대 유출 금지! ⚠️

### 테스트 브랜치 CORS 정책 API 호출 오류
![image](https://github.com/user-attachments/assets/b7f9e4cf-060d-444d-afda-27845c633bbd)

1. **터미널에 CORS 정책이 꺼져잇는 chrome 브라우저 실행**
   
   - 윈도우
    ```bash
    "C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="C:\chrome_dev_test" --disable-web-security
    ```

    - 맥 OS
    ```bash
    open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
    ```
2. **실행 후 브라우저에서 `http://localhost:8080/`로 접속**



### 🗓️ WBS 

WBS 파일 링크

- 개발은 팀장 주도하에 [WBS](https://docs.google.com/spreadsheets/d/1tSMb79A4PfXSgETxUzMoIX7tVdOsJ6x-/edit?usp=sharing&ouid=110955271822501467624&rtpof=true&sd=true)에 작업 내용 명시하고 일정 계획 수립

- 팀원들은 팀장이 분담한 일정 계획에 맞게 개발 진행


## 👬 협업 도구(Collaboration Tools)

1. **피그마(Figma)**
 
   <img src="https://github.com/user-attachments/assets/f0846afa-a6d7-4d65-af14-c56a7e3db06d" width="200"/>

   웹, 어플 디자인은 디자인팀에서 [피그마](https://www.figma.com/design/N9HN3sbO5PejV2UmdQwv4y/-FLAG--%EB%8F%99%EA%B5%AC%EB%9D%BC%EB%AF%B8?node-id=3294-676&p=f&t=K5a79XklLQOub8wV-0)에 작업을 진행한다.

2. **미로(Miro)**
 
   <img src="https://github.com/user-attachments/assets/dc3c8464-6c6b-4ac2-ac03-9bd6d89b8461" width="150"/>

   기획팀에서 [미로 캔버스](https://miro.com/welcomeonboard/eWVkMUhrdUVUdzZ0LzVFdHpwcDhzZFo0M1huMnhDVzBmZXQzRlVHbGFzT3pBV1ZUd093YkVUbW5MeVgwS2Q5dWxjMzBEY0JDd2tqNkNuaHlFaDROM3JPV2VRVGVya2w0K1BWR21obXU0NXE1dGRwVXFOU2lGOCtSb3RTOVJhQmphWWluRVAxeXRuUUgwWDl3Mk1qRGVRPT0hdjE=?share_link_id=922831810663)에 동구라미 서비스의 기획서와 기능 명세서가 명시되어있음

3. **포스트맨(Postman)**
   
   <img src="https://github.com/user-attachments/assets/9279e414-9981-4e83-949e-51b1872ddd93" width="200"/>
   
   백앤드 서버의 api 링크가 명시되어있는 [api 명세서](https://documenter.getpostman.com/view/29405740/2sA3s6Doda#9af345e5-4f9a-41b2-a819-517093e07448)



## 🎤 동구라미 주간 회의

- 동구라미 프로젝트는 매주 일요일 22:00에 동구라미 팀장 주도하에 FLAG 디스코드 체널에서 회의가 진행됨.







