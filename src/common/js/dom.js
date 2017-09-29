export function addClass(el, className) {
  if(hasClass(el, className)){
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')  //className可以为空或空格，后面也可以为空或空格
  return reg.test(el.className)
}

/**
 * 用于listView组件的get边栏字母的Index
 * 使用element.setAttritute('foo', val)||element.getAttribute('foo')方法来获取dom节点上指定的属性
 * @param el
 * @param name
 * @param val
 */
export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if(val){
    return el.setAttribute(name, val)
  }
  else{
    return el.getAttribute(name)
  }
}

/**
 * 能力检测
 */
let elementStyle = document.createElement('div').style
//看看这个elementStyle 支持哪些特性
    //todo 看看厂商有哪些
let vendor = (()=>{
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    Opera: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'  //标准，什么都没有
  }

  for(let key in transformNames){
    if(elementStyle[transformNames[key]] !== undefined){
      return key
    }
  }
  //如果所有都不支持
  return false
})()

export function prefixStyle(style) {
  switch(vendor){
    case false:
      return
      break
    case 'standard':
      return style
    default:
      return vendor + style.charAt(0).toUpperCase() + style.substr(1)
  }
}
