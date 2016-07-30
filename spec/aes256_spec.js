describe("AES-256", function() {
  var aes = null;

  beforeEach(function() {
    aes = require('requirejs')('./aes256');
  });

  it("should encrypt/decrypt a line", function() {
    var line = aes.encrypt("key", "value");
    expect(line).toEqual(jasmine.any(String));
    expect(line).not.toEqual("value");
    expect(line).not.toEqual("value".toString("base64"));

    line = aes.decrypt("key", line);
    expect(line).toEqual("value");
  });

  it("should genreate an sha256 hash", function() {
    var line = aes.hash("test", "hex");

    expect("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08").toEqual(line);
  });
});
