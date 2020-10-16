class Snake{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.tailLength=0;
  }
}

class Fruit{
  constructor(x,y){
    this.x=x;
    this.y=y;
  }
}

var mapHeight;
var mapWidth;
var lastKeyPressed = null;
var gameOn = true;
var refreshCount=0;
var refreshMap;
var fruit = new Fruit(30,30);
var timeouts = [];
//higher numbers make the game slower paced
var refreshRate = 120;
var tailCount = 0;

function resetGame(width, height){
  //empty html contents of any past maps:
  clearInterval(refreshMap);
  gameOn = true;
  $("#snakeGameMap").empty();
  lastKeyPressed = null;
  refeshCount=0;
  mapHeight = width;
  mapWidth = height;
  $("#snakeGameMap").css("grid-template-rows", "repeat("+mapHeight+", auto)");

  //a new array (row) for each mapHeight, and "mapWidth" number of elements
  for(let i=0; i< mapHeight;i++){


    //creat cooresponding div
    var rowDiv = document.createElement("div");
    rowDiv.classList.add("rowDiv");
    $("#snakeGameMap").append(rowDiv);

    for(let j=0; j< mapWidth; j++){

      //creat cooresponding div
      var tileDiv = document.createElement("div");
      tileDiv.classList.add("tileDiv");

      //if this row is the first or last row, or if this is the first or last element in the row, pad with ones (dangerous border tiles)
      if(i==0 || i==mapHeight-1 || j==0 || j==mapWidth-1){

        //select proper color for border tiles
        tileDiv.classList.add("dangerousTile");
      }
      else {
        //select proper color for safe tiles
        tileDiv.classList.add("safeTile");
      }
      //label each tile by its location
      tileDiv.id = i+"-"+j;
      rowDiv.appendChild(tileDiv);
    }
  }
  //style newly created rows to be full of columns
  $(".rowDiv").css("grid-template-columns", "repeat("+mapWidth+", auto)");

  //create player and Fruit
  //determine starting position:
  player = new Snake(5, (mapHeight/2)-1);
  drawFruit();

  //reset the player to a starting position
  $("#"+player.y+"-"+player.x).css("background-color", "blue");

  //start refreshing the map periodically:
  startIntervals();
}



// When the player press one of the four arrow keys, the game starts, and so does the update interval:
$("html").keydown(function(event){

  if(event.key=="ArrowDown"){
    event.preventDefault();
    if(lastKeyPressed!="up"){
      lastKeyPressed = "down";
    }
  }
  else if(event.key=="ArrowUp"){
    event.preventDefault();
    if(lastKeyPressed!="down"){
      lastKeyPressed = "up";
    }
  }
  else if(event.key=="ArrowLeft"){
    event.preventDefault();
    if(lastKeyPressed!="right"){
      lastKeyPressed = "left";
    }

  }
  else if(event.key=="ArrowRight"){
    event.preventDefault();
    if(lastKeyPressed!="left"){
      lastKeyPressed = "right";
    }

  }
});

//start interval and update player position
function updatePlayerPosition(){

  //count how many blue tail pieces the player has:


  //check if fruit is eaten
  if(player.x == fruit.x && player.y == fruit.y){
    drawFruit();
    player.tailLength+=500;
    console.log("fruit eaten at: #"+player.x+"-"+player.y+"taillength="+player.tailLength);
  }

  //first make white (and safe) the current position
  let oldY = player.y;
  let oldX = player.x;

  timeouts.push(setTimeout(()=>{

    if(oldY != player.y || oldX != player.x){
      $("#"+oldY+"-"+oldX).css("background-color", "white");
    }
  },player.tailLength));


//then update the new player position and color it:
  if(lastKeyPressed=="up" && player.y>0){

      // console.log("DEAD");
      // gameOn = false;

      player.y--;
      //if that new spot is blue, you're dead:
      // console.log(window.getComputedStyle(document.getElementById(player.y+"-"+player.x)).getPropertyValue("background-color"));
    if(window.getComputedStyle(document.getElementById(player.y+"-"+player.x)).getPropertyValue("background-color") == "rgb(0, 0, 255)"){

      console.log("DEAD");
      gameOn = false;
    }
    else if(player.y == 0){
      console.log("DEAD");
      gameOn = false;
    }
  }
  else if(lastKeyPressed=="down" && player.y<mapHeight-1){

      player.y++;
      //if that new spot is blue, you're dead:
      if(window.getComputedStyle(document.getElementById(player.y+"-"+player.x)).getPropertyValue("background-color") == "rgb(0, 0, 255)"){

        console.log("DEAD");
        gameOn = false;
      }
      if(player.y == mapHeight-1){
        console.log("DEAD");
        gameOn = false;
      }

  }
  else if(lastKeyPressed=="left" && player.x>0){

      player.x--;
      //if that new spot is blue, you're dead:
      if(window.getComputedStyle(document.getElementById(player.y+"-"+player.x)).getPropertyValue("background-color") == "rgb(0, 0, 255)"){

        console.log("DEAD");
        gameOn = false;
      }

      if(player.x == 0){
        console.log("DEAD");
        gameOn = false;
      }
  }
  else if (lastKeyPressed=="right" && player.x<mapWidth-1){

      player.x++;
      //if that new spot is blue, you're dead:
      if(window.getComputedStyle(document.getElementById(player.y+"-"+player.x)).getPropertyValue("background-color") == "rgb(0, 0, 255)"){

        console.log("DEAD");
        gameOn = false;
      }

      if(player.x == mapWidth-1){
        console.log("DEAD");
        gameOn = false;
      }
  }

  //if not dead yet, redraw player in the new spot:
  if(gameOn){
    //redraw player in new position/ leaving the last square blue:
    $("#"+player.y+"-"+player.x).css("background-color", "blue");

  }


  //keep track of the refresh count so we can limit the interval
  refreshCount++;

  if(refreshCount>=10000){
    gameOn=false;
  }

  //when gameOn is turned off at any time, the game will stop refreshing
  if(gameOn==false){
    clearInterval(refreshMap);
    //clear all timeouts for tail elements:
    for(let i=0;i<timeouts.length;i++){
      clearTimeout(timeouts[i]);
    }
    //count number of blue tiles:
    tailCount = $('div').filter(function() {
    return $(this).css('backgroundColor') == 'blue';
    });
  }


}

function startIntervals(){

  refreshMap = setInterval(()=>{updatePlayerPosition()}, refreshRate);
}

function drawFruit(){
  //put the fruit in a new random position:
  let searching = true;
  let newX;
  let newY;

  while(searching){
    newX = Math.floor(Math.random()*(mapWidth-2))+1;
    newY =  Math.floor(Math.random()*(mapHeight-2))+1;

    //if this suggested spot if currently blue, keep searching:
    if(window.getComputedStyle(document.getElementById(newY+"-"+newX)).getPropertyValue("background-color") !== "rgb(0, 0, 255)"){
      searching=false;
    }
  }
  fruit.x = newX;
  fruit.y = newY;
  //draw it:
  $("#"+fruit.y+"-"+fruit.x).css("background-color", "green");
}

resetGame(24,50);
