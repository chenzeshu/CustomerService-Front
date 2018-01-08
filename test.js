var timer
function debounce(fn, delay){
  return function(){
    var self = this
    var args = arguments

    clearTimeout(timer)

    timer = setTimeout(function(){
      fn.apply(self, args)
    }, delay)
  }
}
let n = 1;

for(let i = 1; i < 5 ; i++){
  debounce(()=>{
    console.log(n++)
  }, 1000)()
}
