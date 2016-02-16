/**
 * Created by fugang on 16/2/10.
 */
var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:8081');

ws.on('open', function open() {
});

ws.on('message', function(data, flags) {
    // flags.binary will be set if a binary data is received.
    // flags.masked will be set if the data was masked.
    console.info('receive data from server %s', data);
    var dataObj = JSON.parse(data);
    var sendData = JSON.stringify({
        commandId:dataObj.commandId,
        results:dataObj.resource
    });
    console.info('send data %s', sendData);

    ws.send(sendData);
});

process.on('exit', function() {
    console.log('Got SIGINT.  Press Control-D/Control-C to exit.');
});