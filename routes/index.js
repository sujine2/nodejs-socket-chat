var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('kakao'); //view 밑에 있는 chat 파일 읽음
});

module.exports = router;
