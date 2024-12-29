let raqueteJogador, raqueteComputador, bola, fundo, bolaSprite, barra1Sprite, barra2Sprite;

function preload() {
  fundo = loadImage("fundo1.png"); 
  bolaSprite = loadImage("bola.png");
  barra1Sprite = loadImage("barra01.png");
  barra2Sprite = loadImage("barra02.png");
}

function setup() {
  createCanvas(800, 400);
  rectMode(CORNER);
  raqueteJogador = new Raquete(30, 5, 20, 120, barra1Sprite); // Usa barra1.png
  raqueteComputador = new Raquete(width - 50, 5, 20, 120, barra2Sprite); // Usa barra2.png
  bola = new Bola(width / 2, height / 2, 20); // Tamanho da bola aumentado
}

function draw() {
    let canvasRatio = width / height; // Proporção do canvas
    let imageRatio = fundo.width / fundo.height; // Proporção da imagem
  
    let sx, sy, sWidth, sHeight;
  
    if (canvasRatio > imageRatio) {
      // Canvas é mais largo que a imagem, recortar verticalmente
      sWidth = fundo.width;
      sHeight = fundo.width / canvasRatio;
      sx = 0;
      sy = (fundo.height - sHeight) / 2;
    } else {
      // Canvas é mais alto que a imagem, recortar horizontalmente
      sWidth = fundo.height * canvasRatio;
      sHeight = fundo.height;
      sx = (fundo.width - sWidth) / 2;
      sy = 0;
    }
  
    // Desenhar a imagem recortada
    image(fundo, 0, 0, width, height, sx, sy, sWidth, sHeight);

  // Bordas superiores e inferiores
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
    this.w = w / 2;  // Ajusta a largura
    this.h = h / 2;  // Ajusta a altura
    this.sprite = sprite; // Adiciona o sprite correspondente
  }

  update() {
    if (this === raqueteJogador) {
      this.y = constrain(mouseY, 5, height - this.h - 5);
    } else {
      let velocidadeComputador = 5; // Ajuste da velocidade da raquete do computador
      if (bola.y < this.y + this.h / 2) {
        this.y -= velocidadeComputador;  // Se a bola está acima, a raquete sobe
      } else if (bola.y > this.y + this.h / 2) {
        this.y += velocidadeComputador;  // Se a bola está abaixo, a raquete desce
      }
      this.y = constrain(this.y, 5, height - this.h - 5);
    }
  }

  display() {
    let escala = 1.5; // Escala para aumentar as raquetes
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
    this.r = r / 1.5; // Raio da bola
    this.sprite = bolaSprite;
    this.velocidadeX = 5;
    this.velocidadeY = 5;
  }

  update() {
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;

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
    }
  }

  reiniciar() {
    this.x = width / 2;
    this.y = height / 2;
    this.velocidadeX = random([-5, 5]); // Reinicia em direção aleatória
    this.velocidadeY = random(-5, 5);
  }

  display() {
    let escala = 2; // Aumentar a bola para 2x o tamanho original
    let largura = this.r * escala;
    let altura = this.r * escala;
    image(bolaSprite, this.x - largura / 2, this.y - altura / 2, largura, altura);
  }
}
