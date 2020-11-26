var player,ground2,groundGroup,jumpsound,diesound,checkpointsound;
var START=0,PLAY=1,END=2,gamestate=0,score=0,points,backgroundimage,back;
var gameoverimage,gameover,restart,restartimage;
function preload()
{
  jumpsound = loadSound("jump.mp3")
  diesound = loadSound("die.mp3")
  checkpointsound = loadSound("checkPoint.mp3")

  backgroundimage = loadImage("nether1.jpg")
  gameoverimage = loadImage("gameOver.png")
  restartimage = loadImage("restart.png")
}

function setup() 
{
 createCanvas(windowWidth,windowHeight)

 back = createSprite(width/2+300,height/2)
 back.addImage(backgroundimage)
 back.scale = 1

 gameover = createSprite(width/2,height/2)
 gameover.addImage(gameoverimage)
 gameover.visible = false

 restart = createSprite(width/2,height/2+100)
 restart.visible= false
 restart.addImage(restartimage)

 player = createSprite(width-1100,height/2,25,25)

 groundGroup = createGroup()
 obstacleGroup = createGroup()
 pointsGroup = createGroup()
 
}

function draw() 
{
 background(220)
 drawSprites()

 if(gamestate === START)
 {
   if(keyDown('r'))
   {
     gamestate = PLAY
   }
   fill("black")
   textSize(20)
   text("Press r to start the game",width/2-100,height/2)
 } 

 else if(gamestate === PLAY)
 {
    if(keyDown('space')) 
    {
      player.velocityY = -10
      jumpsound.play()
    }
    
    if(player.isTouching(obstacleGroup) || player.y > height)
    {
      gamestate = END
      diesound.play()
    }

    if(player.x < width-1050 || player.x > width-1150)
    {
      player.x = width-1100
    }
    
    back.velocityX = -(4+score/20)
    if(back.x < 300)
    {
      back.x = width/2+300
    }

    player.velocityY = player.velocityY+0.6
    player.bounceOff(groundGroup)
    spawnGround()
 }

 else if(gamestate === END)
 {
   gameover.visible = true
   restart.visible = true

   groundGroup.setVelocityXEach(0)
   obstacleGroup.setVelocityXEach(0)
   pointsGroup.setVelocityXEach(0)

   back.velocityX = 0

   player.velocityY = 0

   groundGroup.setLifetimeEach(-1)
   obstacleGroup.setLifetimeEach(-1)
   pointsGroup.setLifetimeEach(-1)

   if(mousePressedOver(restart))
   {
     reset()
   }
 }

 if(player.isTouching(pointsGroup))
 {
    pointsGroup.destroyEach()
    score = score+5
    checkpointsound.play()
 }
 textSize(20)
 fill("black")
 text("score : " + score,width-150,height-550)
}

function spawnGround()
{
  if(frameCount % 50 == 0)
  {
    var ground = createSprite(width,Math.round(random(height-500,600)),80,15)
    ground.velocityX = -(4+score/20)
    ground.lifetime = 400
    //ground.debug = true
    //ground.setCollider("rectangle",0,5,90,1)
    groundGroup.add(ground)
    ground.shapeColor = "brown"

    points = createSprite(width,height,10,10)
    points.velocityX = -(4+score/20)
    points.x = ground.x
    points.y = ground.y-20
    //points.debug = true
    points.lifetime = 400
    pointsGroup.add(points)
    points.shapeColor = "yellow"
  }

}

function spawnObstacles()
{
  if(frameCount % 250 == 0)
  {
    var obstacle = createSprite(width,Math.round(random(height-500,600)),80,15)
    obstacle.shapeColor = "red"
    obstacle.lifetime = 400
    obstacleGroup.add(obstacle)
    obstacle.velocityX = -(4+score/20)
  }
}

function reset()
{
  gamestate = START
  pointsGroup.destroyEach()
  obstacleGroup.destroyEach()
  groundGroup.destroyEach()
  score = 0
  player.y = height/2
  gameover.visible = false
  restart.visible = false
}