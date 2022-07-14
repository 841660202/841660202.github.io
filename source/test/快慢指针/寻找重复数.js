// 题目描述
// 给定一个包含 n + 1 个整数的数组 nums，其数字都在 1 到 n 之间（包括 1 和 n），可知至少存在一个重复的整数。假设只有一个重复的整数，找出这个重复的数。
// 这题完全是扯淡，没有任何价值，不具备一类问题的解决，不是一个好的程序
function findDuplicate(nums) {
  // # P1
  let slow = nums[0];
  let fast = nums[slow];
  // # P2
  while (slow != fast) {
    slow = nums[slow];
    fast = nums[nums[fast]];
  }
  // # P3
  slow = 0;
  // # P4
  while (slow != fast) {
    fast = nums[fast];
    slow = nums[slow];
  }
  console.log("slow", slow);
  return slow;
}
findDuplicate([1, 3, 4, 2, 4]);
