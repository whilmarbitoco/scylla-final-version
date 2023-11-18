let queues = [];

function queue(data) {
  let existDataIndex = -1;

  for (let i = 0; i < queues.length; i++) {
    if (queues[i].id === data) {
      existDataIndex = i;
      break;
    }
  }

  if (existDataIndex !== -1) {
    const timePassed = Date.now() - queues[existDataIndex].date;
    if (timePassed > 10000) {
      queues.splice(existDataIndex, 1);
      return false;
    } else {
      return true;
    }
  } else {
    queues.push({
      id: data,
      date: Date.now(),
    });
    return false;
  }
}

module.exports = queue;
