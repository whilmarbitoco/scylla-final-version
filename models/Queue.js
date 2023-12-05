class Queue {
  constructor() {
    this.queues = [];
  }

  check(data) {
    let existDataIndex = -1;

    for (let i = 0; i < this.queues.length; i++) {
      if (this.queues[i].id === data) {
        existDataIndex = i;
        break;
      }
    }

    if (existDataIndex !== -1) {
      const timePassed = Date.now() - this.queues[existDataIndex].date;
      if (timePassed > 30000) {
        this.queues.splice(existDataIndex, 1);
        return false;
      } else {
        return true;
      }
    } else {
      this.queues.push({
        id: data,
        date: Date.now(),
      });
      return false;
    }
  }
}

const sharedQueue = new Queue();
module.exports = sharedQueue;
