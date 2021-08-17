var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//================================================ socketTest 에서 server.js 와 같은 역할임
app.io = require('socket.io')();
let namecount = 1;

app.io.on('connection', function(socket){
  console.log('user connected : ', socket.id);
  let name = 'Joy' + namecount++;
  socket.name = name;

  app.io.to(socket.id).emit('create name', name);

  app.io.emit('enter message', '[SYSTEM]:' + name + '님이 입장하셨습니다.');

  socket.on('disconnect', function(){
    console.log('user disconnected:' + socket.id + ' ' + socket.name);
  })

  socket.on('send message', function(text){
    let msg = {name: socket.name, text: text};
    console.log('name :' + socket.name, 'text:' + text);
    app.io.emit('receive message', msg);
  })

  socket.on('change name', function(name){
    console.log(name);
    socket.name = name;
  })
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
