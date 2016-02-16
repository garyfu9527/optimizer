/**
 * Created by fugang on 16/2/10.
 */
var WebSocket = require('ws');
var ws = new WebSocket('ws://sign.blueshen.cn:8080');

var heartbeatTimer;
ws.on('open', function open() {
    heartbeatTimer = setInterval(function() {
        ws.send(JSON.stringify({
            command:"heartbeat"
        }));
    }, 15000);
});

ws.on('message', function(data, flags) {
    // flags.binary will be set if a binary data is received.
    // flags.masked will be set if the data was masked.
    console.info('receive data from server %s', data);
    var dataObj = JSON.parse(data);
    var sendData = JSON.stringify({
        command:'sign',
        commandId:dataObj.commandId,
        results:dataObj.resource
    });
    console.info('send data %s', sendData);

    ws.send(sendData);
});

ws.on('close', function(){
    console.warn('receive close message!');
    if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
    }
})

process.on('exit', function() {
    console.log('Got SIGINT.  Press Control-D/Control-C to exit.');
});

// uncaughtException 避免程序崩溃
process.on('uncaughtException', function (err) {
    console.error(err.stack);
});
