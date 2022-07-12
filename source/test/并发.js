// 原理：将在用数量，限制在最大数量内的异步直接发，
// 限制外的现存到数组中，当在用数量减少时一个一个取出来运行
class LimitPromise {
  limit; // 最大限制数
  count; // 目前并发的数量
  taskQueue; // 如果并发数等于最大限制，则把新加的异步操作用数组存起来

  constructor(limit) {
    this.limit = limit;
    this.count = 0;
    this.taskQueue = [];
  }
  // 管理任务执行
  createTask(asyncFn, args, resolve, reject) {
    return () => {
      asyncFn(...args)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.count--; // 任务结束后，对任务队列进行出列，执行
          if (this.taskQueue.length) {
            let task = this.taskQueue.shift();
            task();
          }
        });

      this.count++; // 在执行的数量
    };
  }
  // 管理队列
  call(asyncFn, ...args) {
    return new Promise((resolve, reject) => {
      const task = this.createTask(asyncFn, args, resolve, reject);
      if (this.count >= this.limit) {
        // 大于限制的存起来
        this.taskQueue.push(task);
      } else {
        // 否则直接执行
        task();
      }
    });
  }
}

let limitP = new LimitPromise(3);

// 测试
function sleep(sec) {
  console.log("..............");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("等待了" + sec + "秒");
      resolve("");
    }, sec * 1000);
  });
}

limitP.call(sleep, 1);
limitP.call(sleep, 2);
limitP.call(sleep, 3);
limitP.call(sleep, 4);
limitP.call(sleep, 5);
limitP.call(sleep, 6);
