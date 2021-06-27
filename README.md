# express 기반 SSR 방식의 YouTube

## ☑️ 개요

### Front-end

- pug

### Back-end

- express, pug를 사용한 SSR 구현
- express-session을 사용한 쿠키, 세션 방식의 로그인 구현

## ☑️ 사용한 기술

### Front-end

### Back-end

- `express`

### Deploy

## ☑️ 스크린샷

## ☑️ 프로젝트를 통해 배운 점

### Front-end

### Back-end

- MongoDB
  - mongoose를 사용한 DB 관리
  - Model 생성을 위한 schema 작성법
  - schema static method 사용법
  - ObjectID를 사용하여 Model 사이의 관계 설정
- pug
  - template inheritance, mixins 사용법
  - template에서 자바스크립트 사용법
- express
  - 로그인 여부에 따라 접속 가능한 페이지 제한하는 middleware 구현
  - multer를 사용한 local에 파일 업로드하는 법
  - 세션을 사용한 로그인 구현
    - express-session, MongoStore 사용
    - 로그인 시 세션 ID를 쿠키에 저장 / 로그인 상태, 유저 정보를 세션에 저장
    - 하루가 지나면 세션이 만료되도록 설정
    - middleware를 사용해 세션에 저장된 정보가 res.locals에 저장되도록 설정
    - res.locals를 통해 pug에서 변수에 접근
- GitHub 소셜 로그인 구현하는 방법
  - 지정 된 URL로 접속하여 토큰을 받아 유저의 email 정보 요청
  - 여러 email 중 primary, verifed email을 대표 email로 지정
  - GitHub 유저의 email이 기존 유저의 email과 같다면 계정을 생성하지 않음
  - GitHub 방식으로 회원가입 시 email로 회원가입한 유저와 구별하기 위해서 User Model에 social 필드 추가

### Deploy
