/**
 * Created by fugang on 16/2/16.
 */

var common = require('./common');
var _ = require('underscore');
var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ port: 8081 });

var logger = common.logger;
var reqObj = common.reqObj;
wss.on('connection', function connection(ws) {
    common.wsPool.push(ws);

    logger.info('new ws comming,pool size:%d', common.wsPool.length);

    ws.on('message', function(message){
        //收到签名完成信息
        logger.info('get message %s', message);
        var resData = JSON.parse(message);
        var commandId = resData.commandId;
        var res = commandId && reqObj[commandId];
        if (res) {
            if(resData.command == 'heartbeat') {   //心跳请求
                ws.send(JSON.stringify({
                    command:"heartbeat"
                }));
            } else if(resData.command == 'sign') { //签名完成
                var sendData = JSON.stringify({
                    code:0,
                    data:resData.results
                });
                //返回client签名后的数据
                res.end(sendData, function(){
                    delete reqObj[commandId];
                });
            } else {
                ws.close();
            }
        }

    });

    ws.on('close', function(){
        common.wsPool = _.reject(common.wsPool, function(obj){ return obj==ws; });
        logger.info('close ws，pool size:%d', common.wsPool.length);
    });
});
