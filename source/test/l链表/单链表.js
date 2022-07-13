// 什么是链表?
// 数据的一种存储结构，一个链表包含若干个节点，每个节点至少包含一个数据域和指针域
// JS实现链表 https://blog.csdn.net/m0_47109503/article/details/117566907

//

// 在创建链表时，需要创建两个类：指针类和节点类
class Node {
  constructor(data) {
    this.data = data; // 节点的数据域/数据成员
    this.next = null; // 节点的指针域/指针成员
  }
}
// 定义一个单向链表类
class singleLinked {
  constructor() {
    this.size = 0; // 记录单链表长度或节点个数
    this.head = new Node("head"); // 记录链表的头指针：主要作用记录链表的起始地址
    this.currentNode = "";
  }
  // 获取链表的长度
  getLength() {
    return this.size;
  }
  // 判断链表是否为空
  isEmpty() {
    return this.size === 0;
  }
  // 遍历链表：不重复访问链表中的每个节点
  displayList() {
    var list = "";
    var currentNode = this.head; // 指向链表的头指针
    while (currentNode) {
      // 如果当前节点不为空，则表明当前节点中存在数据
      list += currentNode.data;
      // 同时让当前节点的指针指向下一个节点
      currentNode = currentNode.next;

      if (currentNode) {
        // 如果当前节点的下一个节点不为空
        list += "->"; // 拼接后看起来像一个链表
      }
    }
    console.log(list);
  }

  // 获取链表的最后一个节点
  findLast() {
    var currentNode = this.head;
    while (currentNode.next) {
      currentNode = currentNode.next;
    }
    return currentNode;
  }

  // 采用尾插法在链表尾部添加元素，即创建一个链表
  appendNode(element) {
    var currentNode = this.findLast(); // 找到链表的最后一个节点
    var newNode = new Node(element); // 创建一个新节点
    currentNode.next = newNode; // 把新的节点放在链表里去（放在最后一个的后面）
    newNode.next = null; // 因为新节点已经是链表最后一个节点
    this.size++; // 因为新插入一个节点，让链表的长度+1
  }
  // 删除一个节点
  deleteNode(element) {
    var currentNode = this.head;
    while (currentNode.next.data !== element) {
      currentNode = currentNode.next;
    }
    // 将链的节点与另一个节点连上
    currentNode.next = currentNode.next.next;
    this.size--;
  }
}

// 上述链表代码的测试
// 最好使用循环，往里面加数据
var slist = new singleLinked();

var arr = [1001, 1234, 1006, 7788, 5512, 6129];
for (var i = 0; i < arr.length; i++) {
  slist.appendNode(arr[i]);
}
slist.displayList();
slist.deleteNode(1001);
slist.displayList();
