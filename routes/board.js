var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const jsonParser= bodyParser.json();

const mysqlDB = require('../database/maria');


router.get('/list', function(req, res, next) {
  res.redirect('/board/list/1');
});

router.get('/list/:page', function (req, res, next) {

  var page = req.params.page;
  var sql= "select title, author, content, date_format(time,'%Y-%m-%d %H:%i:%s') time, id from board ";
  mysqlDB.query(sql, function (err, rows, fields) {
      if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error')
      } else {
        res.render('list.ejs', { title:'글 목록', rows: rows }); 
      }
  });
});

router.get('/page/:page', function(req, res, next){ // 게시글 리스트에 :page가 추가된것임
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

/* board insert mongo */
router.post('/write', function (req, res, next) {

  var author = req.body.author;
  var title = req.body.title;
  var content = req.body.content;
  var datas = [author,title, content];
  
  var sql = "insert into board(author, title, content, time) values (?,?,?,now())";
  mysqlDB.query(sql, datas, function (err, rows) {
        if (err) console.error("err : " + err);
        console.log(req.body);
        res.redirect('/board/list/1');
    });
});

module.exports = router;