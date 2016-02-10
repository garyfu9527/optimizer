/**
 * Created by fugang on 16/2/5.
 */
var ctypto = require('ctypto');

exports.tripledesDecode = function(text, key) {
    //decrypt
    var desKey = new Buffer(key);
    var desIV = new Buffer(0);
    var decipher = crypto.createDecipheriv('des-ede3', desKey, desIV);
    decipher.setAutoPadding(true);
    var txtDecoded = decipher.update(text, 'base64', 'utf8');
    txtDecoded = decipher.final('utf8');
    return txtDecoded;
}

exports.tripledesEncode = function(text, key) {
    //enctrypt
    var desKey = new Buffer(key);
    var desIV = new Buffer(0);
    var cipher = crypto.createCipheriv('des-ede3', desKey, desIV);
    cipher.setAutoPadding(true);
    var txtEncoded = cipher.update(text, 'utf8', 'base64');
    txtEncoded += cipher.final('base64');
    return txtEncoded;
}