let raqueteJogador, raqueteComputador, bola;

function setup() {
  createCanvas(800, 400);
  rectMode(CORNER);
  raqueteJogador = new Raquete(30, 5, 10, 60);
  raqueteComputador = new Raquete(width - 40, 5, 10, 60);
  bola = new Bola(width / 2, height / 2, 10);
}

function draw() {
  background(0);

  // Bordas superiores e inferiores
  fill(255, 0, 0);
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
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
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
    fill(255);
    rect(this.x, this.y, this.w, this.h);
  }
}

class Bola {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r * 2; // Diâmetro da bola
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
      this.x - this.r / 2 <= raquete.x + raquete.w &&
      this.x + this.r / 2 >= raquete.x &&
      this.y + this.r / 2 >= raquete.y &&
      this.y - this.r / 2 <= raquete.y + raquete.h
    ) {

      // Calcular a posição relativa da colisão na raquete
      let pontoColisao = this.y - (raquete.y + raquete.h / 2);
      this.velocidadeX *= -1.1;

      // Modificar a velocidade vertical com base na posição da colisão
      this.velocidadeY += pontoColisao * 0.1; // Aumenta o valor multiplicador conforme necessário
      this.velocidadeX = constrain(this.velocidadeX, -10, 10);

      // Limitar a velocidade para evitar ângulos extremos
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
    fill(255);
    ellipse(this.x, this.y, this.r);
  }
}
