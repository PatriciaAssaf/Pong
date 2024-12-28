let raqueteJogador, raqueteComputador, bola, fundo;

function preload() {
  fundo = loadImage('fundo1.png'); 
}

function setup() {
  createCanvas(800, 400);
  rectMode(CORNER);
  raqueteJogador = new Raquete(30, 5, 10, 60);
  raqueteComputador = new Raquete(width - 40, 5, 10, 60);
  bola = new Bola(width / 2, height / 2, 10);
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
    this.tamanhoOriginal = this.r; // Guardar o tamanho original da bola
    this.tamanhoAtual = this.r; // Usar para modificar o tamanho durante a colisão
    this.esmagada = false; // Flag para verificar se a bola está esmagada
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

    // Se a bola estiver esmagada, aumentar gradualmente para o tamanho original
    if (this.esmagada && this.tamanhoAtual < this.tamanhoOriginal) {
      this.tamanhoAtual += 0.2; // Velocidade de crescimento da bola
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
      this.velocidadeY += pontoColisao * 0.2; // Aumenta o valor multiplicador conforme necessário
      this.velocidadeX = constrain(this.velocidadeX, -10, 10);

      // Limitar a velocidade para evitar ângulos extremos
      this.velocidadeY = constrain(this.velocidadeY, -5, 5);

      // Iniciar o efeito de esmagamento
      this.esmagada = true;
      this.tamanhoAtual = this.r / 2; // Diminuir o tamanho quando colidir
    }
  }

  reiniciar() {
    this.x = width / 2;
    this.y = height / 2;
    this.velocidadeX = random([-5, 5]); // Reinicia em direção aleatória
    this.velocidadeY = random(-5, 5);
    this.tamanhoAtual = this.r; // Restaura o tamanho original
    this.esmagada = false; // Restaura a bola para o estado normal
  }

  display() {
    fill(255);
    ellipse(this.x, this.y, this.tamanhoAtual);
  }
}
