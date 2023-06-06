var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const jsonParser= bodyParser.json();

const mysqlDB = require('../database/maria');


router.get('/list', function(req, res, next) {
  res.redirect('/board/list/1');
});


router.get('/list/:page', function(req, res, next){ // 게시글 리스트에 :page가 추가된것임
  var page = req.params.page; // 현재 페이지는 params 을 req 요청받아옴
  var sql =  "select id, author, title, date_format(time,'%Y-%m-%d %H:%i:%s') time from board";  // select 구절 그대로

  mysqlDB.query(sql, function(err, rows){
      if (err) console.err("err : " + err);
      res.render('page.ejs', {title : '글목록', rows:rows, page:page, length:rows.length-1, page_num:10, pass:true}); 
      // length 데이터 전체넘버 랜더링,-1을 한이유는 db에서는1부터지만 for문에서는 0부터 시작 ,page_num: 한페이지에 보여줄 갯수
      console.log(rows.length-1);
  });
});
    
    
router.get('/write', function(req, res, next) {
  res.render('write.ejs', { title: '글쓰기' });
});

/* board insert db */
router.post('/write', function (req, res, next) {

  var author = req.body.author;
  var title = req.body.title;
  var content = req.body.content;
  var id=req.body.content;
  var datas = [author,title, content, id];
  
  var sql = "insert into board(author, title, content, time, id) values (?,?,?,now(),?)";
  mysqlDB.query(sql, datas, function (err, rows) {
        if (err) console.error("err : " + err);
        console.log(req.body);
        res.redirect('/board/list/1');
    });
});

router.get('/read/:id', function(req, res, next){ // board/read/idx숫자 형식으로 받을거
  var id = req.params.id; // :idx 로 맵핑할 req 값을 가져온다
  var sql = "SELECT id, author, title, content, date_format(time, '%Y-%m-%d %H:%i:%s') time from board where id=?";
      mysqlDB.query(sql,[id], function(err, rows){  // 한개의 글만조회하기때문에 마지막idx에 매개변수를 받는다
      if(err) console.error("err : " + err);
      res.render('read', {title : '글 상세보기', rows:rows[0]}); // 첫번째행 한개의데이터만 랜더링 요청
  });
});



router.post('/delete/:id', function(req,res,next){
  
  var id= req.params.id;
  var sql = "DELETE from board WHERE id=?";
   
  mysqlDB.query(sql, [id], function(err, result) {
      if(err) 
        conseole.error('연결 오류', err);
      else{
        
          res.redirect('/board/list');
      }
  });
});

module.exports = router;