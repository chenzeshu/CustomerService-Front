const news = [
  {
    id: 1,
    title: "云卫通服务平台",
    href: "#"
  },
  {
    id: 2,
    title: "转：方舱医院“开”进革命老区",
    href: "#"
  },
  {
    id: 3,
    title: "公司召开大会庆祝中国共产党97周年生日",
    href: "#"
  },
  {
    id: 4,
    title: "转：黄明与海南省应急管理厅主要负责人座谈",
    href: "#"
  },
  {
    id: 5,
    title: "中网卫星助力四川省卫生应急联合演练",
    href: "#"
  },
  {
    id: 6,
    title: "埃塞俄比亚工业园运营管理研修班中网参观",
    href: "#"
  },
  {
    id: 7,
    title: "第五届上海军民两用技术促进大会",
    href: "#"
  },
  {
    id: 8,
    title: "中网应邀参展2018年保密技术交流大会",
    href: "#"
  },
]
const available_lines = 5  //可改，新闻行数
const MAX_SINGLE_LINE_WORD_LONG = 28 + 1 + 4  //50 个字 + 1条分隔符 + 4个空格
const MAX_SINGLE_LINE_WORD_SHORT = 24 + 1 + 4  //50 个字 + 1条分隔符 + 4个空格
//fixme 看情况，如果空的多就4个空格，否则2个空格
//fixme 动态调整
const CHAR_SPLIT_LONG = "　　｜　　"
const CHAR_SPLIT_SHORT = "｜"

let renderNewsArr = []  //待渲染数组

//todo 标题长度从小到大排序
//todo 由于标题存在数字，数字渲染的宽度小于汉字，所以需要统计标题中数字数目，然后用总长度减去数字折半的长度
let sortNewsArr = news
  .map(n => {
    let num_match = n.title.match(/[0-9]+/, 'gi')
    let num_length = num_match === null ? 0 : num_match[0].length
    let _length = n.title.length - Math.floor((num_length / 2)) //只有1个数字，则计为1个汉字长度
    Reflect.set(n, '_length', _length)
    return n
  }).sort((a, b) => {
    return a._length - b._length
  })

//todo 从长度最小的标题开始，依次遍历匹配最长的标题，若达标，则放进待渲染数组renderNewsArr
for(let i = 0; i < sortNewsArr.length; i++){
  for(let j = sortNewsArr.length -1 ; j >= i; j--){
    //如果最后只剩下一个没有匹配的
    if(i === sortNewsArr.length - 1){
      renderNewsArr.push([
        sortNewsArr[i]
      ])
      break
    }

    //不能超过最长值
    if (sortNewsArr[i]._length + sortNewsArr[j]._length < MAX_SINGLE_LINE_WORD_LONG){
      renderNewsArr.push([
        sortNewsArr[i],
        sortNewsArr[j]
      ])
      sortNewsArr.splice(j, 1)
      break
    }
    //todo 如果匹配到最后都没有匹配成功
    if(j - i === 1){
      renderNewsArr.push([
        sortNewsArr[i]
      ])
    }
  }

}

console.log(renderNewsArr)
//todo 渲染，挂载DOM节点
//给个例子，这个根据网站自己写吧
renderNewsArr.forEach(item => {
  let render
  if(item.length > 1){
    if(item[0]._length + item[1]._length < MAX_SINGLE_LINE_WORD_SHORT){
      render = `${item[0].title }${CHAR_SPLIT_LONG}${item[1].title}`
    } else {
      render = `${item[0].title }${CHAR_SPLIT_SHORT}${item[1].title}`
    }
  }
  else {
    render = `${item[0].title}`
  }
  console.log(render)
})


