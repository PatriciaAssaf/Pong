let raqueteJogador, raqueteComputador, bola;

function setup() {
  createCanvas(800, 400);
  raqueteJogador = new Raquete(30, height / 2, 10, 60);
  raqueteComputador = new Raquete(width - 40, height / 2, 10, 60);
  bola = new Bola(width / 2, height / 2, 10);
}

function draw() {
  background(0);
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
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  update() {
    if (this === raqueteJogador) {
      this.y = mouseY;
    } else {
      if (bola.y > this.y + this.h / 2) {
        this.y += 3;
      } else if (bola.y < this.y - this.h / 2) {
        this.y -= 3;
      }
    }
    this.y = constrain(this.y, this.h / 2, height - this.h / 2);
  }
  display() {
    fill(255);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
  }
}

class Bola {
    constructor(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.velocidadeX = 5;
      this.velocidadeY = 5;
    }
    update() {
      this.x += this.velocidadeX;
      this.y += this.velocidadeY;
  
      if (this.y < this.r / 2 || this.y > height - this.r / 2) {
        this.velocidadeY *= -1;
      }
      if (this.x - this.r / 2 < 0 || this.x + this.r / 2 > width) {
        this.reiniciar();
      }
    }
    checkPaddleCollision(raquete) {
      if (
        this.x - this.r / 2 <= raquete.x + raquete.w / 2 &&
        this.x + this.r / 2 >= raquete.x - raquete.w / 2 &&
        this.y + this.r / 2 >= raquete.y - raquete.h / 2 &&
        this.y - this.r / 2 <= raquete.y + raquete.h / 2
      ) {
        this.velocidadeX *= -1;
      }
    }
    reiniciar() {
      this.x = width / 2;
      this.y = height / 2;
      this.velocidadeX *= -1; 
      this.velocidadeY = random(-5, 5); 
    }
    display() {
      fill(255);
      ellipseMode(CENTER);
      ellipse(this.x, this.y, this.r);
    }
  }