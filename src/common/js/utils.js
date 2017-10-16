//延时节流函数
export function debounce(func, delay) {
  let timer

  return function (...args){
    if(timer){
      clearTimeout(timer)
    }
    timer = setTimeout(()=>{
      func.apply(this, args)
    }, delay)
  }
}


export function interval(func, delay) {
  let timer

  return function (...args){
    if(timer){
      clearInterval(timer)
    }
    timer = setInterval(()=>{
      func.apply(this, args)
    }, delay)
  }
}
