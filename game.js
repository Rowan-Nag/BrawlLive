var canvas = document.getElementById('base');
ctx = canvas.getContext('2d');
WIDTH = canvas.width;
HEIGHT = canvas.height;
ctx.fillRect(0,0,WIDTH,HEIGHT)
var ticks = 0

var keys = {down: 40,
            up: 38,
            left: 37,
            right: 39,
            jump: 32,
            a:65,
            s:83,
            d:68,
            q: 81,
            w: 87,
            e: 69,
            r: 82,},
    keysDown = {},
    frameRate = 1/60,
    frameDelay = frameRate*1000

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);


var requestInterval = function (fn, delay) {
  var requestAnimFrame = (function () {
    return window.requestAnimationFrame || function (callback, element) {
      window.setTimeout(callback,  frameDelay);
    };
  })(),
      start = new Date().getTime(),
      handle = {};
  function loop() {
    handle.value = requestAnimFrame(loop);
    var current = new Date().getTime(),
        delta = current - start;
    if (delta >= delay) {
      fn.call();
      start = new Date().getTime();
    }
  }
  handle.value = requestAnimFrame(loop);
  return handle;
};
MAPS = {
  1:{
    tiles:[
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1]],
    adds:[
      [5,4,4,4,4,4,4,4,4,6],
      [3,0,0,0,0,0,0,0,0,2],
      [3,0,0,0,0,0,0,0,0,2],
      [3,0,0,0,0,0,0,0,0,2],
      [3,0,0,0,0,0,0,0,0,2],
      [3,0,0,0,0,0,0,0,0,2],
      [3,0,0,0,0,0,0,0,0,2],
	  [3,0,0,0,0,0,0,0,0,2],
      [3,0,0,0,0,0,0,0,0,2],
      [3,0,0,0,0,0,0,0,0,2]],
      collision:[
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]],




  }
}
function collision(a, b){
  return (a.x < b.x + b.width &&
   a.x + a.width > b.x &&
   a.y < b.y + b.height &&
   a.y + a.height > b.y)
}
class Tile{
  constructor(x, y, width, height, type, collision){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = document.getElementById(type);
    this.collision = collision;
  }
}





class Player{
  constructor(img){
    this.image = document.getElementById(img)
    this.x = WIDTH/2;
    this.y = HEIGHT/2;
    this.speed = 4
    this.facing = 0
    this.width = 50
    this.height =50
  }

  draw(x, y){
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(this.image,0, 128*this.frameX, 128, 128, x, y, this.width, this.height);

  }
  incrementFrame(numFrames, delayAmount) {
    if (this.delay < delayAmount) {
      this.delay += 1;
    } else {
      if (this.frameX < numFrames ) {
        this.frameX += 1;
      } else {
        this.frameX = 0;
        this.delay = 0;
      }
    }
  }

  move(){
    let xTemp = this.x+0, yTemp = this.y+0

    if(keys.a in keysDown){
      this.x -= this.speed
      this.image = document.getElementById("p1Left")
      if(ticks%5===0){
        this.incrementFrame()
      }
    }
    if(keys.d in keysDown){
      this.x += this.speed
      this.image = document.getElementById("p1Right")
    }
    if(keys.w in keysDown){
      this.y -= this.speed
      this.image = document.getElementById("p1Up")
    }
    if(keys.s in keysDown){
      this.y += this.speed
      this.image = document.getElementById("p1Down")
    }
    let dy = this.y-yTemp
    let dx = this.x-xTemp
    this.facing = Math.atan2(this.y-yTemp, this.x-xTemp)
    for(let i = 0; i <game.mapCollision.length; i++){
      if(collision({x:this.x+dx,y:this.y,width:this.width,height:this.height}, game.mapCollision[i])){
        if(dx < 0){
          this.x = game.mapCollision[i].x+game.mapCollision[i].width+2;}
        if(dx > 0){
          this.x = game.mapCollision[i].x-this.width-2}
        console.log('collide horizontally')
      }
      if(collision({x:this.x,y:this.y+dy,width:this.width,height:this.height}, game.mapCollision[i])){
        if(dy < 0){
          this.y = game.mapCollision[i].y+game.mapCollision[i].height+2;}
        if(dy > 0){
          this.y = game.mapCollision[i].y-this.height-2}
        console.log('collide vertically')
      }

    }

    if(this.x < 0){
      this.x = 0
    }
    if(this.y < 0){
      this.y = 0
    }

    if(this.y > (game.map[0].length-1)*game.tileSize){

      this.y = (game.map[0].length-1)*game.tileSize
    }
    if(this.x > (game.map.length-1)*game.tileSize){
      this.x = (game.map.length-1)*game.tileSize
    }

    if(this.x > WIDTH/2 && this.x < game.tileSize*game.map.length-WIDTH/2){
      game.cameraX = this.x
    }
    if(this.y > HEIGHT/2 && this.y < game.tileSize*game.map[0].length-HEIGHT/2){
      game.cameraY = this.y
    }
  }
}

class Game{
  constructor(){
    this.player1 = new Player("p1Idle")
    this.state = 1
    this.map = []
    this.mapAdds = []
    this.mapCollision = []
    this.sprites = []
    this.cameraX = WIDTH/2
    this.cameraY = HEIGHT/2
    this.tileSize = 50
  }
  setup(){
    //this.genNewMap(10, 10);
	  this.map = this.listToMap(MAPS[1].tiles)
    this.mapAdds = this.listToMap(MAPS[1].adds)
    this.mapCollision = this.renderCollision(MAPS[1].collision)
    console.log(this.mapCollision, 5)

  }
  drawMap(map){
    ctx.imageSmoothingEnabled = false

    let cameraMinX = Math.floor((this.cameraX-WIDTH/2)/this.tileSize);
    let cameraMinY = Math.floor((this.cameraY-WIDTH/2)/this.tileSize);


    for(let i = cameraMinX; i < Math.min(map.length, cameraMinX+this.tileSize+1); i++){
      for(let j = cameraMinY; j < Math.min(map[i].length, cameraMinY+this.tileSize+1); j++){
        ctx.drawImage(map[i][j].image, map[i][j].x-this.cameraX+WIDTH/2, map[i][j].y-this.cameraY+HEIGHT/2, this.tileSize, this.tileSize)
      }
    }
  }
  renderCollision(tiles){
    console.log(tiles, tiles.length, tiles[0].length)
    let collideable = false,b = []
    for(let i = 0; i < tiles.length; i++){
	    let c = [];
      console.log('i ', i)
      console.log(tiles[i].length)
      for(let j = 0; j < tiles[i].length; j++){
        console.log('j ', j)
        if(tiles[i][j]===1){
          collideable = true
				  c.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'floor', 1))
          console.log('added collision')

        }else{
          if(c.length > 0){
          b.push(new Tile(c[0].x, i*this.tileSize, c[c.length-1].x-c[0].x, this.tileSize))}
          c = []
          collideable = false
        }
        console.log(b)
      }

    }
    console.log(b)
    return b

  }
  genNewMap(w, h){
    let a = [];

    for(let i = 0; i< w; i++){
      let b = [];

      for(let j = 0; j<h; j++){
        b.push(new Tile(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize,'floor', 0))




      }
      a.push(b)

    }

    this.map = a
  }



  listToMap(tiles){
    console.log(tiles)
    let target = []
    for(let i = 0; i < tiles.length; i++){
	    let b = [];
      for(let j = 0; j < tiles[i].length; j++){
          switch(tiles[i][j]){
            //Tile Class: X, Y, Width, Height, Type (same as image id in html)


			  case 0:
				  break;
				  
			  case 1:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'floor', 0))
			  	break;
				  
			  case 2:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'rightRockWall', 0))
			  	break;
				  
			  case 3:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'leftRockWall', 0))
			  	break;
				  
			  case 4:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'frontRockWall', 0))
			  	break;
				  
			  case 5:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'frontLeftRockWall', 0))
			  	break;
				  
			  case 6:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'frontRightRockWall', 0))
			  	break;
				  
			  
				  
			  }

      }
    target.push(b)
    }

  return target
  }


  drawSprites(){

    for(let i = 0; i < this.sprites.length; i++){
      this.sprites[i].draw();
    }
    this.player1.draw(this.player1.x-this.cameraX+WIDTH/2, this.player1.y-this.cameraY+HEIGHT/2)
  }

  stateEngine(){
    switch(this.state){
      case 0:
        break;
      case 1:
        this.player1.move()
        this.drawMap(this.map);
        this.drawMap(this.mapAdds)
        this.drawSprites();
    }
  }

}

var game = new Game();
game.setup();
function update(){
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  game.stateEngine()
}
function updateTicks(){

  ticks += 1
}

var tickCount = setInterval(updateTicks, 100)
requestInterval(update, frameDelay)
