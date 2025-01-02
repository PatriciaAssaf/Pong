let raqueteJogador, raqueteComputador, bola, fundo, bolaSprite, barra1Sprite, barra2Sprite;
let bounceSound, golSound;
let audioStarted = false;
let placarJogador = 0;
let placarComputador = 0;

function preload() {
  fundo = loadImage("fundo1.png");
  bolaSprite = loadImage("bola.png");
  barra1Sprite = loadImage("barra01.png");
  barra2Sprite = loadImage("barra02.png");
  bounceSound = loadSound("bounce.wav");
  golSound = loadSound("game_over_mono.wav");
}

function setup() {
  createCanvas(800, 400);
  rectMode(CORNER);
  raqueteJogador = new Raquete(30, 5, 20, 120, barra1Sprite);
  raqueteComputador = new Raquete(width - 50, 5, 20, 120, barra2Sprite);
  bola = new Bola(width / 2, height / 2, 20);

  canvas.addEventListener('click', startAudio);
}

function startAudio() {
  if (!audioStarted) {
    userStartAudio();
    audioStarted = true;
  }
}

function narrarPlacar() {
  let placarTexto = `${placarComputador} a ${placarJogador}`;
  let utterance = new SpeechSynthesisUtterance(placarTexto);
  speechSynthesis.speak(utterance);
}

function draw() {
  let canvasRatio = width / height;
  let imageRatio = fundo.width / fundo.height;
  
  let sx, sy, sWidth, sHeight;
  
  if (canvasRatio > imageRatio) {
    sWidth = fundo.width;
    sHeight = fundo.width / canvasRatio;
    sx = 0;
    sy = (fundo.height - sHeight) / 2;
  } else {
    sWidth = fundo.height * canvasRatio;
    sHeight = fundo.height;
    sx = (fundo.width - sWidth) / 2;
    sy = 0;
  }

  image(fundo, 0, 0, width, height, sx, sy, sWidth, sHeight);

  fill("#2b3fd6");
  rect(0, 0, width, 5);
  rect(0, height - 5, width, 5);

  raqueteJogador.update();
  raqueteComputador.update();
  bola.update();
  bola.checkPaddleCollision(raqueteJogador);
  bola.checkPaddleCollision(raqueteComputador);
  raqueteJogador.display();
  raqueteComputador.display();
  bola.display();
}

class Raquete {
  constructor(x, y, w, h, sprite) {
    this.x = x;
    this.y = y;
    this.w = w / 2;
    this.h = h / 2;
    this.sprite = sprite;
  }

  update() {
    if (this === raqueteJogador) {
      this.y = constrain(mouseY, 5, height - this.h - 5);
    } else {
      let velocidadeComputador = 5;
      if (bola.y < this.y + this.h / 2) {
        this.y -= velocidadeComputador;
      } else if (bola.y > this.y + this.h / 2) {
        this.y += velocidadeComputador;
      }
      this.y = constrain(this.y, 5, height - this.h - 5);
    }
  }

  display() {
    let escala = 1.5;
    let largura = this.w * escala;
    let altura = this.h * escala;

    if (this === raqueteJogador) {
      image(barra1Sprite, this.x - largura / 2, this.y, largura, altura);
    } else {
      image(barra2Sprite, this.x - largura / 2, this.y, largura, altura);
    }
  }
}

class Bola {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r / 1.5;
    this.sprite = bolaSprite;
    this.velocidadeX = 5;
    this.velocidadeY = 5;
    this.angulo = 0;
  }

  update() {
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;
    this.angulo += this.velocidadeX / 10;

    if (this.y < this.r || this.y > height - this.r) {
      this.velocidadeY *= -1;
    }

    if (this.x - this.r < 0 || this.x + this.r > width) {
      this.reiniciar();
    }
  }

  checkPaddleCollision(raquete) {
    if (
      this.x - this.r <= raquete.x + raquete.w &&
      this.x + this.r >= raquete.x &&
      this.y + this.r >= raquete.y &&
      this.y - this.r <= raquete.y + raquete.h
    ) {
      this.velocidadeX *= -1.1;
      this.velocidadeX = constrain(this.velocidadeX, -10, 10);
      this.velocidadeY = constrain(this.velocidadeY, -5, 5);
      bounceSound.play();
    }
    
    if (this.x + this.r / 2 >= width) {
      placarComputador++;
      golSound.play();
      narrarPlacar();
      this.reiniciar();
    } else if (this.x - this.r / 2 <= 0) {
      placarJogador++;
      golSound.play();
      narrarPlacar();
      this.reiniciar();
    }
  }

  reiniciar() {
    this.x = width / 2;
    this.y = height / 2;
    this.velocidadeX = random([-5, 5]);
    this.velocidadeY = random(-5, 5);
    this.angulo = 0;
  }

  display() {
    let escala = 2;
    let largura = this.r * escala;
    let altura = this.r * escala;
    push();
    translate(this.x, this.y);
    rotate(this.angulo);
    image(this.sprite, -largura / 2, -altura / 2, largura, altura);
    pop();
  }
}








