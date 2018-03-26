let str = '"exp":1522029887'
console.log(1, str)
let reg = /(\d+)/
let result = reg.exec(str)
console.log(2, result[1])

//
// var str = "deleteChild(236737)";
// var result = /\((\d+)\)/.exec(str);

// if(result.length > 1) {　　//加这个判断是以防字符串中没有匹配的内容，那么result[1]会抛错！
//   console.log("您想要的结果是：" +result[1]); //输出 236737。
// } else {
//   console.log("字符串中没有符合条件的数字");
// }
