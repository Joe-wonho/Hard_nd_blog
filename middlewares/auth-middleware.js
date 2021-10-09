const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  //앞에 app.js에서 미들웨어를 사용해 get을하는데 인증을 확인하기위해 지나치는 중간점이다
  //이곳에서 인증을 진행하는 코드를 작성한다.
  //프론트에서 헤더에있는 인증값을 대문자로 보내도 소문자로 알아서 변환되므로 아래 코드를 그냥 사용
  //헤더에서 인증정보 받아오기
  const { authorization } = req.headers;
  //받아온 인증정보는 bearer과 그 뒤에있는 데이터다. 그걸가져오기위한 코드
  //즉 bearer와 토큰만 분리하기 위한 코드, 배열(array)도 구조분해할당이 가능하다 아래처럼
  const [tokenType, tokenValue] = authorization.split(" ");
  //토큰타입을 확인해서 이제 토큰타입이 bearer일 때만 정상동작하게 하면된다.
  if (tokenType !== "Bearer") {
    // || tokenValue == null
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요",
    });
    return;
  }
  //try 문 안에서 에러가 발생하면 그걸 잡아서 catch문으로 넘겨준다
  try {
    const { userId } = jwt.verify(tokenValue, "wonho-secret-key");
    //res.locals.user = user;는 프로미스가 아니기에 사용못하지만 tnen으로 아래처럼
    //연결하면 사용가능해짐 하지만 await사용 불가능 왜냐하면 async함수가 아니기 때문
    User.findById(userId)
      .exec()
      .then((user) => {
        res.locals.user = user; //익스프레스에서 우리가 유틸리티하게 사용할수 있는 공간을 제공
        //우리 맘대로 쓸수 있는 공간이며 여기다 사용자 정보를 담아서 넘김. 엄청편해짐
        next(); // next 호출이 되면 다음 미들웨어, 라우터, 핸들러가 호출이 된다
      });

    //원래는토큰을 발급한 이후에 유저가 없는 경우 고려 (악성사용자, 회원탈퇴등)
    // if(!user){   ~ }
  } catch (error) {
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요",
    });
    return; //next 호출이 되면 안되기에 return 을 사용한다.
  }
};
