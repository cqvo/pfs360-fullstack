// cipher class test
const accessToken = {
    set plaintext(val) {
      this.ciphertext = val * 2;
    },
    get decrypt() {
        return this.ciphertext / 2;
    },
    ciphertext: [],
  };
  
  accessToken.plaintext = 2;
  console.log(accessToken.ciphertext);

  const obj = {
    log: ['a', 'b', 'c'],
    get latest() {
      return this.log[this.log.length - 1];
    },
  };
  
  console.log(obj.latest);
  // Expected output: "c"
  