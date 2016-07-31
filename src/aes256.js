var algorithm = 'aes-256-ctr';

AES256 = function(crypto) {
  this.crypto = crypto;
};

AES256.prototype.hash = function(key, type) {
  var sha256 = this.crypto.createHash('sha256');
  return sha256.update(key, 'utf8').digest(type);
};

AES256.prototype.encrypt = function (key, data) {
  var iv = this.crypto.randomBytes(16),
    plaintext = new Buffer(data),
    cipher = this.crypto.createCipheriv(algorithm, this.hash(key), iv),
    ciphertext = cipher.update(plaintext);
  ciphertext = Buffer.concat([iv, ciphertext, cipher.final()]);

  return ciphertext.toString('base64');
};

AES256.prototype.decrypt = function (key, data) {
  var input = new Buffer(data, 'base64'),
    iv = input.slice(0, 16),
    ciphertext = input.slice(16),
    decipher = this.crypto.createDecipheriv(algorithm, this.hash(key), iv),
    plaintext = decipher.update(ciphertext);
  plaintext += decipher.final();

  return plaintext;
};

define(['crypto'], function(crypto) {
  return new AES256(crypto);
});
