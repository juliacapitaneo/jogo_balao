var bg, bgImgDay, bgImgAfternoon, bgImgNight;
var bottomGround;
var topGround;
var balloon, balloonImg;
var backgroungImg;
//criar variável para carregar som
var theSound;
var jumpSound, dieSound;
//criar variáveis de obstáculo
var obstacleTop, obsTop1, obsTop2;
var obstacleBottom, obsBottom1, obsBottom2, obsBottom3;
//criar variável para castelo
var castleImg, castle;
//criar variável para pontuação
var score = 0;

var gameState = 0;
var start = 0;
var play = 1;
var end = 2;

function preload() {
  bgImgDay = loadImage("assets/dia.jpeg");
  bgImgAfternoon = loadImage("assets/tarde.jpeg");
  bgImgNight = loadImage("assets/noite.jpeg");

  balloonImg = loadAnimation(
    "assets/balloon1.png",
    "assets/balloon2.png",
    "assets/balloon3.png"
  );

  backgroungImg = loadImage("assets/essa.png");
  //carregar som utilizando "loadSound"
  theSound = loadSound("assets/EarthQuake (1).wav");
  jumpSound = loadSound("assets/jump.mp3");
  dieSound = loadSound("assets/die.mp3");

  //carregar imagens de obstáculos
  obsTop1 = loadImage("assets/obsTop1.png");
  obsTop2 = loadImage("assets/obsTop2.png");

  obsBottom1 = loadImage("assets/obsBottom1.png");
  obsBottom2 = loadImage("assets/obsBottom2.png");
  obsBottom3 = loadImage("assets/obsBottom3.png");

  castleImg = loadImage("assets/castle.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //imagem de fundo
  bg = createSprite(width / 2, height / 2, width, height);
  bg.addImage(bgImgDay);
  bg.scale = 1.3;

  //criar o solo superior e inferior
  bottomGround = createSprite(200, height - 20, 800, 20);
  bottomGround.visible = false;

  topGround = createSprite(200, 10, 800, 20);
  topGround.visible = false;

  //criar o balão
  balloon = createSprite(200, height / 2 - 100, 80, 50);
  balloon.addAnimation("balloon", balloonImg);
  balloon.scale = 0.2;

  //inicializar os grupos
  topObstaclesGroup = new Group();
  bottomObstaclesGroup = new Group();
  barGroup = new Group();

  //criar castle
  castle = createSprite(width / 2 + 400, height / 2 + 100, 100, 100);
  castle.scale = 0.2;
  castle.addImage("castle", castleImg);
  castle.visible = false;
  castle.depth = castle + 5;

  getBackgroundImg();
}

function draw() {
  background(backgroungImg);

  if (gameState === 0) {
    fill("white");
    textSize(30);
    text(
      "Pressione a tecla ENTER para inciar sua aventura!",
      width / 2 - 350,
      height / 2
    );

    textSize(20);
    text(
      "Para que seu balão não caia, aperte espaço, não se esqueça.",
      width / 2 - 300,
      height / 2 + 50
    );

    //colocar o nome da váriavel(do som) .play()
    theSound.play();
    //mudando o estado do jogo para play
    if (keyDown("Enter")) {
      gameState = 1;
      //dar sound.stop() na música
      theSound.stop();
    }
  }

  //comportamento do estado play
  if (gameState === 1) {
    //faça o balão de ar quente pular
    if (keyDown("space")) {
      balloon.velocityY = -7;
      jumpSound.play();
    }
    backgroungImg.visible = false;
    //adicione gravidade
    balloon.velocityY = balloon.velocityY + 0.5;

    //gerar obstáculos superiores e inferiores
    spawnObstaclesTop();
    spawnObstaclesBottom();
    drawSprites();
    Score();
  }

  if (
    bottomObstaclesGroup.isTouching(balloon) ||
    balloon.isTouching(topGround) ||
    topObstaclesGroup.isTouching(balloon) ||
    balloon.isTouching(bottomGround)
  ) {
    gameState = 2;
    dieSound.play();
  }

  if (gameState === 2) {
    //sweet alert
    textSize(30);
    fill("white");
    text(
      "Mais sorte da próxima vez, sua pontuação foi:" + score,
      width / 2 - 300,
      height / 2
    );
    text(
      "Pressione a tecla R para reiniciar sua jornada!",
      width / 2 - 300,
      height / 2 + 50
    );
    //todos os sprites devem parar de se mover no estado END (FIM)
    balloon.velocityX = 0;
    balloon.velocityY = 0;
    topObstaclesGroup.setVelocityXEach(0);
    bottomObstaclesGroup.setVelocityXEach(0);
    barGroup.setVelocityXEach(0);

    //definindo o tempo de vida como -1 para que os obstáculos não desapareçam no estado END (FIM)
    topObstaclesGroup.setLifetimeEach(-1);
    bottomObstaclesGroup.setLifetimeEach(-1);

    balloon.y = 200;

    //reiniciando o jogo
    if (keyDown("R")) {
      reset();
    }
  }
  if(score>400){
    obstacleBottom.velocityX = -6;
    obstacleTop.velocityX = -6;
  }

  if(score>800){
    obstacleBottom.velocityX = -8;
    obstacleTop.velocityX = -8;
  }

  if(score>1000){
    obstacleBottom.velocityX = -10;
    obstacleTop.velocityX = -10;
  }

  if (score > 1200) {
    textSize(30);
    fill("yellow");
    text("Você salvou Dandara e a amiga dela, parabéns!", width / 2 - 450, height / 2);
    text("Caso queira enfrentar este desafio",  width / 2 - 450, height / 2+50);
    text("novamente, clique na tecla A",width / 2 - 450, height / 2+100)
    castle.visible = true;
    //todos os sprites devem parar de se mover no estado END (FIM)
    balloon.velocityX = 0;
    balloon.velocityY = 0;
    topObstaclesGroup.setVelocityXEach(0);
    bottomObstaclesGroup.setVelocityXEach(0);
    barGroup.setVelocityXEach(0);

    topObstaclesGroup.setLifetimeEach(-2);
    bottomObstaclesGroup.setLifetimeEach(-2);

    topObstaclesGroup.destroyEach();
    bottomObstaclesGroup.destroyEach();

    if (keyDown("A")) {
      castle.visible = false;
      reset();
    }
  }
  Bar();
}

function reset() {
  //Altere o gameState para jogar
  gameState = 1;
  //Destrua o topObstaclesGrupo e o bottomObstaclesGroup
  topObstaclesGroup.destroyEach();
  bottomObstaclesGroup.destroyEach();
  score = 0;
}

function spawnObstaclesTop() {
  if (World.frameCount % 60 === 0) {
    obstacleTop = createSprite(width - 20, height + 30, 800, 20);

    //obstacleTop.addImage(obsTop1);

    obstacleTop.scale = 0.1;
    obstacleTop.velocityX = -4;

    //posições y aleatórias para os obstáculos superiores
    obstacleTop.y = Math.round(random(50, 400));

    //gerar obstáculos superiores aleatórios
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1:
        obstacleTop.addImage(obsTop1);
        break;
      case 2:
        obstacleTop.addImage(obsTop2);
        break;
      default:
        break;
    }

    //atribuir tempo de vida à variável
    obstacleTop.lifetime = 400;

    balloon.depth = balloon.depth + 1;

    topObstaclesGroup.add(obstacleTop);
  }
}

function spawnObstaclesBottom() {
  if (World.frameCount % 60 === 0) {
    obstacleBottom = createSprite(width - 20, height - 80, 800, 20);

    obstacleBottom.addImage(obsBottom1);
    obstacleBottom.debug = true;
    //

    obstacleBottom.scale = 0.1;
    obstacleBottom.velocityX = -4;
    
    //gerar obstáculos inferiores aleatórios
    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        obstacleBottom.addImage(obsBottom1);
        break;
      case 2:
        obstacleBottom.addImage(obsBottom2);
        break;
      case 3:
        obstacleBottom.addImage(obsBottom3);
        break;
      default:
        break;
    }

    //atribuir tempo de vida à variável
    obstacleBottom.lifetime = 400;

    balloon.depth = balloon.depth + 1;

    bottomObstaclesGroup.add(obstacleBottom);
  }
}

function Bar() {
  if (World.frameCount % 60 === 0) {
    var bar = createSprite(400, 200, 10, 800);
    bar.velocityX = -6;

    bar.velocityX = -6;
    bar.depth = balloon.depth;
    bar.lifetime = 70;
    bar.visible = false;

    barGroup.add(bar);
  }
}

function Score() {
  if (balloon.isTouching(barGroup)) {
    //aumentar a pontuação em 1
    score = score + 2;
  }
  textSize(30);
  fill("yellow");
  //Exibir a pontuação
  text("Pontuação:" + score, width / 2 + 400, height / 2 - 225);
}

async function getBackgroundImg() {
  var response = await fetch(
    "http://worldtimeapi.org/api/timezone/America/Sao_Paulo"
  );
  var responseJSON = await response.json();
  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11, 13);
  if (hour >= 06 && hour <= 12) {
    bg.addImage(bgImgDay);
    bg.scale = 1.48;
  } else if (hour >= 13 && hour <= 19) {
    bg.addImage(bgImgAfternoon);
    bg.scale = 1.48;
    bg.x = width / 2;
    bg.y = height / 2;
  } else {
    bg.addImage(bgImgNight);
    bg.scale = 1.48;
    bg.x = width / 2;
    bg.y = height / 2;
  }
}
