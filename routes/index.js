var express = require('express');
var router = express.Router();
var easypost = require('easypost');
var _ = require('underscore');

var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/optimizer.log', category: 'optimizer', maxLogSize:1000000 }
  ]
});

var logger = log4js.getLogger('optimizer');
logger.setLevel('info');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var reqObj = {};
var commandId = 0;
var wsPool = [];  //websocket pool
router.post('/signurl', function(req, res, next) {
  easypost.get(req, res, function(data){
    logger.info('signurl post data is %s', data);

    if (wsPool.length <= 0) {
      res.end();
    } else {
      //get a online websocket
      var poolSize = wsPool.length;
      var index = Math.floor(Math.random()*poolSize)%poolSize || 0;
      logger.info('current ws index is %d, poolSize is %d', index, poolSize);
      var ws = wsPool[index];

      //发送签名数据
      var dataSend = {
        'command':'sign',
        'commandId':++commandId,
        'resource':data
      };
      reqObj[commandId] = res;
      ws.send(JSON.stringify(dataSend));
    }
  });
});

var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ port: 8081 });

wss.on('connection', function connection(ws) {
  wsPool.push(ws);
//  ws.send('connect ok!');

  logger.info('new ws comming,pool size:%d', wsPool.length);

  ws.on('message', function(message){
    //收到签名完成信息
    logger.info('get message %s', message);
    var resData = JSON.parse(message);
    var commandId = resData.commandId;
    var res = commandId && reqObj[commandId];
    if (res) {
      //返回client签名后的数据
      res.end(resData.results, function(){
        delete reqObj[commandId];
      });
    }

  });

  ws.on('close', function(){
    wsPool = _.reject(wsPool, function(obj){ return obj==ws; });
    logger.info('close ws，pool size:%d', wsPool.length);
  });
});

// uncaughtException 避免程序崩溃
process.on('uncaughtException', function (err) {
  logger.error(err.stack);
});

module.exports = router;
