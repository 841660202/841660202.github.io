// @link: https://blog.csdn.net/dingshao1114/article/details/105340579
/**
 * 双向链表节点
 * 包含三个值：当前节点的值和分别指向前后节点的链接
 */

class Node {
  constructor(element) {
    this.element = element;
    this.next = null;
    this.prev = null;
  }
}

/**双向链表*/

class DoublyLinkedList {
  constructor() {
    this.head = null;
  }
  /**在链表末尾添加一个元素 */
  add(element) {
    const node = new Node(element);
    if (this.head === null) {
      // 一个节点不会有双向，最少两个节点才会有双向
      this.head = node;
      return;
    }
    let current = this.head;
    while (current.next) {
      // 两个以上节点
      current = current.next;
    }
    current.next = node; // （当前遍历到的节点）的下一个节点为新增的节点
    node.prev = current; // 新增节点的上一个节点为（当前遍历到的节点）
  }
  /**删除 */
  remove(element) {
    if (this.head === null) {
      return false;
    }
    let current = this.head;
    if (current.element === element) {
      if (this.head.next) {
        // 如果是首部，之后有节点，则需要调整第二个节点，指针
        this.head = this.head.next;
        this.head.prev = null;
      } else {
        this.head = null; // 之后没有节点，直接令head = null,相当于回到初始化
      }
      return true;
    }

    let prev;
    // 当找到要删除的节点时候，while的body没有执行，此时 【prev节点】=【current节点】=【next节点】
    while (current !== null && current.element !== element) {
      prev = current;
      current = current.next;
    }

    if (current) {
      prev.next = current.next || null; // 删除操作
      if (current.next) { // 将下一个节点的prev接到prev节点
        current.next.prev = prev;
      }
      return true
    }
    return false
  }
}
