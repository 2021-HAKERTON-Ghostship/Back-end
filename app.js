const express = require('express');//함수나 객체 또는 변수가 할당된 모듈
const bodyParser = require('body-parser');//클라이언트 POST request data의 body로부터 파라미터를 편리하게 추출
const ejs = require("ejs");//ejs : 자바스크립트가 내장되어 있는 html 파일
const path = require('path');//경로 제공
const mysql = require('mysql');
const { Router } = require('express');
const { futimesSync } = require('fs');
const { get } = require('http');
const res = require('express/lib/response');
const { redirect } = require('express/lib/response');



const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'chec_que'
});

const app = express(); //const app = express();를 사용해서 만든 Express app 객체로 모든 서버의 일을 처리
app.use(bodyParser.urlencoded({ extended: false }));
// app.set('view engine', 'ejs');//뷰 엔진을 ejs로 설정
// app.set('views', './view');//뷰를 뷰로 사용

app.set('views',path.join(__dirname,'ejs'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs')

app.set('port', process.env.PORT || 3000);//포트를 3000을 설정

app.use(express.static('./src'))
app.use(bodyParser.json());

app.get('/', (req, res) => {//get : 미들웨어 함수가 적용되는 HTTP 메소드. '/' : 미들웨어 함수가 적용되는 경로(라우트). req : 미들웨어 함수에 대한 HTTP 요청 인수(일반적으로 "req"라 불림). res : 미들웨어 함수에 대한 HTTP 응답 인수(일반적으로 "res"라 불림).
  res.sendFile(path.join(__dirname, 'src/webpage/main.html'));//파일 보내기
});

// app.get("/user/register", function (req, res, next) {
//   res.render('main', { title: 'main' });
// });

app.post('/user/register', function (req, res) {

  const param = [req.body.id, req.body.password, req.body.name]
  console.log(param)

  var sql = "INSERT INTO user(id,password,name) values(?,?,?)";
  conn.query(sql, param, function (err, result, fields) {
    console.log(sql)
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error2')
    }
    console.log('inserted');
    res.redirect('/')
  })
});

app.post("/user/login", function (req, res) {
  const userid = req.body.id
  const userpw = req.body.password

  conn.query('select id, password from user where id=?', userid, function (err, result) {
    if (err) {
      console.log(err)
    }

    if (!result[0]) {
      console.log("존재하지 않는 ID")
    }
    else {
      if (result[0].password == userpw) {
        res.redirect("/main_menu");
      }
      else {
        console.log("존재하지 않는 비밀번호");
      }
    }
  })
});

var ran;
app.get("/qr", function (req, res) {
  const qr = req.query.qrcode;

  if (qr == 'rand')   //wep에서 rand변수 요청
  {
    ran = String(Math.floor((Math.random() * 10000000000)))
    res.send(ran)      //random으로 만들어진 pw전송
  }
  else                //raspberrypi에서 읽은 qr 보냄
  {
    if (ran == qr) {
      res.send("OK")
    } else {
      res.send("NO")
    }
  }
});









/*===========================================================================*/

app.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname+"src/webpage/main.html"));
});

app.get("/register", function (req, res, next) {
  res.sendFile(path.join(__dirname+"/src/webpage/register.html"));
});

app.get("/main_menu", function (req, res, next) {
  res.render(path.join(__dirname+"/src/webpage/main_menu.html"));
});
app.get("/reservation", function (req, res, next) {
  res.render(path.join(__dirname+"/src/webpage/reservation.html"));
});
app.get("/my_reservation", function (req, res, next) {
  res.render(path.join(__dirname+"/src/webpage/my_reservation.html"));
});

app.get("/hotel1", function (req, res, next) {
  res.render(path.join(__dirname+"/src/webpage/hotel1.html"));
});
app.get("/hotel1_room1", function (req, res, next) {
  res.render(path.join(__dirname+"/src/webpage/hotel1_room1.html"));
});

app.get("/qrpage", function (req, res, next) {
  res.render(path.join(__dirname+"/src/webpage/qr.html"));
});



app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
