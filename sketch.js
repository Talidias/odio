let gardener;
let trees = [];
let clouds = [];
let score = 0;
let seeds = 5;
let gameArea;
let bgColor;

function setup() {
  createCanvas(800, 500);
  bgColor = color(135, 206, 235); // Sky blue
  
  // Game area (where trees can be planted)
  gameArea = {
    x: 100,
    y: 200,
    width: 600,
    height: 250
  };
  
  // Create gardener
  gardener = {
    x: width/2,
    y: gameArea.y + gameArea.height - 30,
    width: 40,
    height: 60,
    speed: 3,
    color: color(244, 164, 96), // Sandy brown
    direction: 1 // 1 for right, -1 for left
  };
  
  // Create initial clouds
  for (let i = 0; i < 5; i++) {
    clouds.push(createCloud());
  }
  
  // Initial trees (already grown)
  for (let i = 0; i < 3; i++) {
    trees.push(createTree(
      random(gameArea.x + 50, gameArea.x + gameArea.width - 50),
      gameArea.y + gameArea.height,
      true
    ));
  }
}

function draw() {
  background(bgColor);
  
  // Draw sun
  drawSun();
  
  // Update and draw clouds
  updateClouds();
  drawClouds();
  
  // Draw ground
  drawGround();
  
  // Draw game area boundary
  drawGameArea();
  
  // Update and draw gardener
  updateGardener();
  drawGardener();
  
  // Update and draw trees
  updateTrees();
  drawTrees();
  
  // Display score and seeds
  drawHUD();
  
  // Check for win condition
  if (trees.length >= 15 && seeds === 0) {
    drawWinScreen();
  }
}

function drawSun() {
  fill(255, 255, 0);
  noStroke();
  ellipse(100, 100, 80, 80);
  
  // Sun rays
  for (let i = 0; i < 12; i++) {
    let angle = TWO_PI * i / 12;
    let x1 = 100 + cos(angle) * 50;
    let y1 = 100 + sin(angle) * 50;
    let x2 = 100 + cos(angle) * 70;
    let y2 = 100 + sin(angle) * 70;
    stroke(255, 255, 0, 150);
    strokeWeight(3);
    line(x1, y1, x2, y2);
  }
}

function drawGround() {
  // Grass
  fill(34, 139, 34);
  noStroke();
  rect(0, gameArea.y + gameArea.height, width, height - (gameArea.y + gameArea.height));
  
  // Dirt patch in game area
  fill(139, 69, 19);
  rect(gameArea.x, gameArea.y, gameArea.width, gameArea.height);
}

function drawGameArea() {
  noFill();
  stroke(0);
  strokeWeight(2);
  rect(gameArea.x, gameArea.y, gameArea.width, gameArea.height);
}

function createCloud() {
  return {
    x: random(-100, width),
    y: random(50, 150),
    width: random(80, 150),
    speed: random(0.5, 1.5),
    opacity: random(200, 255)
  };
}

function updateClouds() {
  for (let i = clouds.length - 1; i >= 0; i--) {
    clouds[i].x += clouds[i].speed;
    
    if (clouds[i].x > width + 100) {
      clouds.splice(i, 1);
      clouds.push(createCloud());
      clouds[clouds.length - 1].x = -100;
    }
  }
}

function drawClouds() {
  for (let cloud of clouds) {
    fill(255, 255, 255, cloud.opacity);
    noStroke();
    ellipse(cloud.x, cloud.y, cloud.width, cloud.width * 0.6);
    ellipse(cloud.x + cloud.width * 0.3, cloud.y, cloud.width * 0.7, cloud.width * 0.5);
    ellipse(cloud.x - cloud.width * 0.3, cloud.y, cloud.width * 0.7, cloud.width * 0.5);
  }
}

function updateGardener() {
  if (keyIsDown(LEFT_ARROW)) {
    gardener.x = constrain(gardener.x - gardener.speed, gameArea.x, gameArea.x + gameArea.width);
    gardener.direction = -1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    gardener.x = constrain(gardener.x + gardener.speed, gameArea.x, gameArea.x + gameArea.width);
    gardener.direction = 1;
  }
}

function drawGardener() {
  push();
  translate(gardener.x, gardener.y);
  scale(gardener.direction, 1);
  
  // Body
  fill(gardener.color);
  rect(-gardener.width/2, -gardener.height, gardener.width, gardener.height);
  
  // Head
  fill(255, 218, 185); // Peach
  ellipse(0, -gardener.height - 15, 30, 30);
  
  // Hat
  fill(0);
  rect(-15, -gardener.height - 30, 30, 10);
  rect(-10, -gardener.height - 40, 20, 10);
  
  // Watering can (when facing right)
  fill(150);
  rect(15, -gardener.height + 10, 10, 20);
  rect(25, -gardener.height + 15, 5, 10);
  
  pop();
}

function createTree(x, y, isGrown = false) {
  return {
    x: x,
    y: y,
    width: 30,
    height: isGrown ? random(80, 120) : 10,
    growth: isGrown ? 1 : 0,
    maxGrowth: 1,
    growthRate: random(0.001, 0.003),
    color: color(34, 139, 34),
    trunkColor: color(139, 69, 19),
    fruits: []
  };
}

function updateTrees() {
  for (let tree of trees) {
    // Grow the tree if not fully grown
    if (tree.growth < tree.maxGrowth) {
      tree.growth += tree.growthRate;
      tree.height = lerp(10, tree.maxHeight || random(80, 120), tree.growth);
      
      // When fully grown, add fruits
      if (tree.growth >= tree.maxGrowth && tree.fruits.length === 0) {
        for (let i = 0; i < 5; i++) {
          tree.fruits.push({
            x: tree.x + random(-15, 15),
            y: tree.y - tree.height + random(20, tree.height - 20),
            size: random(8, 12),
            color: color(random(200, 255), random(100, 200), random(100, 200))
          });
        }
      }
    }
  }
}

function drawTrees() {
  for (let tree of trees) {
    // Draw trunk
    fill(tree.trunkColor);
    rect(tree.x - 5, tree.y - tree.height, 10, tree.height);
    
    // Draw leaves
    fill(
      red(tree.color),
      green(tree.color),
      blue(tree.color),
      tree.growth * 255
    );
    
    // Tree top
    ellipse(tree.x, tree.y - tree.height, tree.width + 20, tree.width + 20);
    
    // Middle part
    ellipse(tree.x, tree.y - tree.height * 0.7, tree.width + 10, tree.width);
    
    // Draw fruits if tree is grown
    if (tree.growth >= tree.maxGrowth) {
      for (let fruit of tree.fruits) {
        fill(fruit.color);
        ellipse(fruit.x, fruit.y, fruit.size, fruit.size);
      }
    }
  }
}

function drawHUD() {
  fill(0);
  textSize(24);
  text("Trees: " + trees.length, 20, 30);
  text("Seeds: " + seeds, 20, 60);
  text("Score: " + score, 20, 90);
  
  if (seeds > 0) {
    textSize(16);
    text("Press SPACE to plant a tree", width/2 - 100, 30);
  }
}

function drawWinScreen() {
  fill(0, 0, 0, 200);
  rect(width/2 - 200, height/2 - 100, 400, 200);
  
  fill(255);
  textSize(32);
  text("Garden Complete!", width/2 - 150, height/2 - 40);
  textSize(24);
  text("Final Score: " + score, width/2 - 80, height/2 + 20);
}

function keyPressed() {
  if (key === ' ' && seeds > 0) {
    // Plant a new tree
    trees.push(createTree(gardener.x, gameArea.y + gameArea.height));
    seeds--;
    score += 10;
  }
  
  // Cheat code for testing
  if (key === 'g') {
    seeds += 5;
  }
}