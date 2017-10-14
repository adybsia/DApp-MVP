const util = {
  expectThrow: async promise => {
    try {
      let result = await promise;
      console.log(result);
    } catch (error) {
      const invalidJump = error.message.search('invalid JUMP') >= 0
      const invalidOpcode = error.message.search('invalid opcode') >= 0
      const outOfGas = error.message.search('out of gas') >= 0
      assert(invalidJump || invalidOpcode || outOfGas, "Expected throw, got '" + error + "' instead")
      return
    }
    assert.fail('Expected throw not received')
  },

  getTimestampPlusSeconds: (seconds) => {
    let date = new Date();
    date.setSeconds(date.getSeconds() + seconds)
    let timestamp = +date;
    timestamp = Math.ceil(timestamp / 1000);
    return timestamp;
  }
}


module.exports = util;
