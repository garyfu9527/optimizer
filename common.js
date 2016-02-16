/**
 * Created by fugang on 16/2/16.
 */

var log4js = require('log4js');

log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'logs/optimizer.log', category: 'optimizer', maxLogSize:1000000 }
    ]
});

var logger = log4js.getLogger('optimizer');
logger.setLevel('info');

var reqObj = {};    //key:requestId  value:ServerResponse
var wsPool = [];  //websocket pool


module.exports = {
    logger:logger,
    reqObj:reqObj,
    wsPool:wsPool
}