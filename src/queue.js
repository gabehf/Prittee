class Queue {
    constructor() {
      this.queue = [];
    }
  
    push(element) {
      this.queue.push(element);
    }
  
    pop() {
      return this.queue.shift();
    }
  
    peek() {
      return this.queue[0];
    }

    print() {
        console.log(this.queue)
    }

    size() {
        return this.queue.length
    }
}

export default Queue
  