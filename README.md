# express 기반 SSR 방식의 YouTube

## ☑️ 개요

### Front-end

- pug
- 자바스크립트를 사용하여 커스텀 비디오 플레이어 구현
- 동영상 재생 완료 시 fetch를 사용하여 백엔드에 POST 요청 전송
-

### Back-end

- express, pug를 사용한 SSR 구현
- express-session을 사용한 세션 기반 로그인 구현

## ☑️ 사용한 기술

### Front-end

- `pug`, `tailwindcss`

### Back-end

- `express`, `express-session`, `express-flash`, `morgan`, `bcrypt`, `dotenv`, `mongoose`

### Development

- `babel`, `webpack`

### Deploy

- `heroku`, `MongoDB Atlas`

## ☑️ 스크린샷

## ☑️ 프로젝트를 통해 배운 점

### Front-end

- async, await 사용을 위한 regenerator-runtime

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

- local에서 사용한 환경변수를 heroku에 등록하는 법
- babel을 사용한 build
-

## ☑️ 문제점

- 동영상의 총 재생시간이 제대로 출력되지 않는 문제점 (loadedmetadata event 사용)

  - 기존 방식 : template의 video 태그에 src attribute 작성 `video(src=video.fileURL)`
    - HTML 파일을 파싱하면서 video가 script 파싱 이전에 로딩이 완료됨 -> script의 event 동작하지 않음
  - 변경 방식 : url을 dataset으로 전달 후 script에서 src attribute 추가 `video(data-url=video.fileURL)`
    - script 파싱 이후 video가 로딩되기 때문에 event가 제대로 동작하게 됨

- express-flash로 메세지 출력 후 뒤로가기하면 메세지가 다시 출력되는 문제점
  - 추후 수정
- multer error handling

  - 기존 방식 : multer 미들웨어 -> controller `uploadImg.single("avatar"), postMe`
    - 문제점 : 지정한 fileSize를 초과하는 파일 업로드 시 multer에서 발생한 오류가
      express에서 catch 되지 않아 서버 죽음
  - 변경 방식 : multer 자체에서 error handling 방식 사용 -> controller

    ```
      const upload = uploadImg.single("avatar");
      upload(req, res, (err) => {})
    ```

    - 문제점 : multer 미들웨어를 거치고 express에서 req.body 출력 시 undefined 문제

  - 최종 : 미들웨어를 거치지 않고 controller에서 multer error handling과 작업을 동시에 수행하는 것으로 해결
