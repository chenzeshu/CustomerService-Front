<template>
      <canvas id="canvas" class="canvas-clock"></canvas>
</template>

<script>
  import {digit} from 'common/js/digit'

  const WINDOW_WIDTH = 500
  const WINDOW_HEIGHT = 200
  const MARGIN_TOP = document.body.clientHeight / 30
  const MARGIN_LEFT = document.body.clientWidth / 30
  const RADIUS = 4
  const color = ['red', 'yellow', ' blue', 'green', 'pink', 'purple', 'black', 'brown', 'grey', 'rgb(5, 125, 154)']

  var curTime = {};

  var balls = []

    export default {
      mounted(){
        curTime = this.getCurrentTime()
        let ctx = this._initCanvas()
        let that = this
        this.$nextTick(()=>{
          setInterval(function() {
            that.render(ctx)
            that.update()
          }, 50)
        })
      },
      methods:{
        renderGit(x,y, num, ctx){
          ctx.strokeStyle = 'black'
          ctx.fillStyle = 'blue'
          for(let i = 0; i < digit[num].length; i++){
            for(let j = 0 ; j < digit[num][i].length; j++){
              if(digit[num][i][j] === 1){
                ctx.beginPath()
                ctx.arc(x + 2*j*RADIUS + RADIUS, y + 2*i*RADIUS + RADIUS, RADIUS, 0, 2*Math.PI)
                ctx.fill()
                ctx.stroke()
              }
            }
          }
        },
        render(ctx){
          ctx.clearRect(0, 0, 500, 200)

          this.renderGit(MARGIN_LEFT, MARGIN_TOP, parseInt(curTime.hours/10), ctx)
          this.renderGit(MARGIN_LEFT + 2 * 7 * RADIUS, MARGIN_TOP, parseInt(curTime.hours%10), ctx)
          this.renderGit(MARGIN_LEFT + 2 * 14 * RADIUS, MARGIN_TOP, 10, ctx)
          this.renderGit(MARGIN_LEFT + 2 * 18 * RADIUS, MARGIN_TOP, parseInt(curTime.mins/10), ctx)
          this.renderGit(MARGIN_LEFT + 2 * 25 * RADIUS, MARGIN_TOP, parseInt(curTime.mins%10), ctx)
          this.renderGit(MARGIN_LEFT + 2 * 32 * RADIUS, MARGIN_TOP, 10, ctx)
          this.renderGit(MARGIN_LEFT + 2 * 36 * RADIUS, MARGIN_TOP, parseInt(curTime.secs/10), ctx)
          this.renderGit(MARGIN_LEFT + 2 * 43 * RADIUS, MARGIN_TOP, parseInt(curTime.secs%10), ctx)

          for(let i = 0; i<balls.length; i++){
            ctx.fillStyle = balls[i].color
            ctx.beginPath()
            ctx.arc(balls[i].x, balls[i].y, RADIUS, 0, Math.PI *2)
            ctx.closePath()
            ctx.fill()
          }
        },
        getCurrentTime(){
          let time = new Date()
          let hours = time.getHours()
          let mins = time.getMinutes()
          let secs = time.getSeconds()

          let ret = {
            hours : hours,
            mins : mins,
            secs : secs
          }
          return ret
        },
        update(){
          var nextTime = new Date()
          nextTime = {
            hours:nextTime.getHours(),
            mins:nextTime.getMinutes(),
            secs: nextTime.getSeconds()
          }

          if(parseInt(nextTime.secs) !== parseInt(curTime.secs)){
            if(parseInt(curTime.hours/10) !== parseInt(nextTime.hours/10)){
              this.addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(curTime.hours/10))
            }
            if(parseInt(curTime.hours%10) !== parseInt(nextTime.hours%10)){
              this.addBalls(MARGIN_LEFT + 2 * 7 * RADIUS, MARGIN_TOP, parseInt(curTime.hours%10))
            }
            if(parseInt(curTime.mins/10) !== parseInt(nextTime.mins/10)){
              this.addBalls(MARGIN_LEFT + 2 * 18 * RADIUS, MARGIN_TOP, parseInt(curTime.mins%10))
            }
            if(parseInt(curTime.mins%10) !== parseInt(nextTime.mins%10)){
              this.addBalls(MARGIN_LEFT + 2 * 25 * RADIUS, MARGIN_TOP, parseInt(curTime.mins%10))
            }
            if(parseInt(curTime.secs/10) !== parseInt(nextTime.secs/10)){
              this.addBalls(MARGIN_LEFT + 2 * 36 * RADIUS, MARGIN_TOP, parseInt(curTime.secs%10))
            }
            if(parseInt(curTime.secs%10) !== parseInt(nextTime.secs%10)){
              this.addBalls(MARGIN_LEFT + 2 * 43 * RADIUS, MARGIN_TOP, parseInt(curTime.secs%10))
            }
            curTime = nextTime

          }

          this.updateBalls()

//          console.log(balls.length)


        },
        updateBalls(){
          for( let i = 0 ; i<balls.length; i++){
            balls[i].x += balls[i].vx;
            balls[i].y += balls[i].vy;
            balls[i].vy += balls[i].g;

            if( balls[i].y >= WINDOW_HEIGHT - RADIUS){
              balls[i].y = WINDOW_HEIGHT - RADIUS
              balls[i].vy = -balls[i].vy *0.75
            }
          }

          //todo 性能优化
          let cnt = 0
          for( let j = 0 ; j < balls.length; j++){
            if(balls[j].x + RADIUS > 0 && balls[j].x - RADIUS < WINDOW_WIDTH ){
              balls[cnt++] = balls[j]  // 测试看看:  等同于balls[cnt] = .. 并且cnt++
            }
          }

          while(balls.length > Math.min(300, cnt)){
            balls.pop()
          }
        },
        addBalls(x, y, num){
          for(let i = 0 ; i < digit[num].length ; i++){
            for(let j = 0 ; j < digit[num].length ; j++){
              if(digit[num][i][j] === 1){
                let ball = {
                  x : x + 2 * j * RADIUS + RADIUS,
                  y : y + 2 * i * RADIUS + RADIUS,
                  g : 1.5 + Math.random(),
                  vx : Math.pow( -1, Math.ceil( Math.random()*1000)) * 4,  //为了避免产生0 , 使用ceil
                  vy : -5,
                  color : color[Math.floor(Math.random()*color.length)]
                }
                balls.push(ball)
              }

            }
          }
        },
        _initCanvas(){
          var canvas = document.getElementById('canvas')
          canvas.height = WINDOW_HEIGHT
          canvas.width = WINDOW_WIDTH
          var ctx = canvas.getContext('2d')

          return ctx
        }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .canvas-clock
    display: block
    margin 0 auto
</style>
