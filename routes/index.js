var express = require('express');
var router = express.Router();
var easypost = require('easypost');
var _ = require('underscore');
var common = require('../common');

var logger = common.logger;
var reqObj = common.reqObj;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var commandId = 0;
router.post('/signurl', function(req, res, next) {
  /*
  res.on('finish', function(){
    logger.info('finish message');
  });
  */
  res.on('close', function(){
    logger.info('close message');
    for (var k in reqObj) {
      if (reqObj[k] == res) {
        delete  reqObj[k];
        break;
      }
    }
  });

  var urls = req.body['urls'];
  if (typeof urls === 'object') {
    urls = JSON.stringify(urls);
  }

  if (common.wsPool.length <= 0) {
    res.end();
  } else {
    //get a online websocket
    var poolSize = common.wsPool.length;
    var index = Math.floor(Math.random()*poolSize)%poolSize || 0;
    logger.info('current ws index is %d, poolSize is %d', index, poolSize);
    var ws = common.wsPool[index];

    //发送签名数据
    var dataSend = {
      'command':'sign',
      'commandId':++commandId,
      'resource':urls
    };
    reqObj[commandId] = res;
    ws.send(JSON.stringify(dataSend));
  }

});

module.exports = router;
