const sharedQueue = require("../models/Queue.js");

class Auth {
  constructor(mid) {
    this.myID = mid;
  }

  check(eid) {
    const isQueued = sharedQueue.check(eid);
    if (!isQueued || eid === this.myID) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = Auth;
