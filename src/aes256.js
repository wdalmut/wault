var aes256 = {},
  crypto = require('crypto'),
  algorithm = 'aes-256-ctr';

aes256.hash = function(key, type) {
  var sha256 = crypto.createHash('sha256');
  return sha256.update(key, 'utf8').digest(type);
};

aes256.encrypt = function (key, data) {
  var iv = crypto.randomBytes(16),
    plaintext = new Buffer(data),
    cipher = crypto.createCipheriv(algorithm, aes256.hash(key), iv),
    ciphertext = cipher.update(plaintext);
  ciphertext = Buffer.concat([iv, ciphertext, cipher.final()]);

  return ciphertext.toString('base64');
};

aes256.decrypt = function (key, data) {
  var input = new Buffer(data, 'base64'),
    iv = input.slice(0, 16),
    ciphertext = input.slice(16),
    decipher = crypto.createDecipheriv(algorithm, aes256.hash(key), iv),
    plaintext = decipher.update(ciphertext);
  plaintext += decipher.final();

  return plaintext;
};

define([], function() {
  return aes256;
});
