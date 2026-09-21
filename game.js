var nomeJogador = localStorage.getItem("nomeJogador");
var pontos = 0;
var velocidade = 5;          
var jogando = false;         
var pulando = false;
var alturaPulo = 0;         
var subindo = false;
var PASSO_SUBIDA = 10;      
var PASSO_DESCIDA = 4;       
var ALTURA_MAXIMA = 130;     
var obstaculos = [];        
var tempoParaObstaculo = 0;  


var astronauta = document.getElementById("astronauta");
var tela = document.getElementById("tela");
var mostradorPontos = document.getElementById("pontos");


if (nomeJogador == null) {
    window.location.href = "index.html";
}

document.getElementById("nomeJogador").innerHTML = nomeJogador;

// ---------- controles (teclado) ----------

document.addEventListener("keydown", function (evento) {
    if (evento.code == "Space" || evento.code == "ArrowUp") {
        evento.preventDefault();
        pular();
    }
});

function pular() {
    if (jogando == true && pulando == false) {
        pulando = true;
        subindo = true;
    }
}

// ---------- funcoes do jogo ----------

function comecarJogo() {
    pontos = 0;
    velocidade = 5;
    jogando = true;
    pulando = false;
    alturaPulo = 0;
    tempoParaObstaculo = 60;


    for (var i = 0; i < obstaculos.length; i++) {
        obstaculos[i].elemento.remove();
    }
    obstaculos = [];

    document.getElementById("telaInicio").className = "mensagem escondido";
    document.getElementById("telaFim").className = "mensagem escondido";
}

function criarObstaculo() {
    var imagem = document.createElement("img");
    var largura;
    var altura;
    if (Math.random() < 0.5) {
        imagem.src = "img/pedra.png";
        largura = 70;
        altura = 35;
    } else {
        imagem.src = "img/BuracoNegro.png";
        largura = 55;
        altura = 55;
    }
    imagem.style.width = largura + "px";
    imagem.style.height = altura + "px";
    imagem.className = "obstaculo";
    imagem.style.left = "700px";
    tela.appendChild(imagem);

    var obstaculo = {
        elemento: imagem,
        x: 700,
        largura: largura,
        altura: altura
    };
    obstaculos.push(obstaculo);
}

function fimDeJogo() {
    jogando = false;

    document.getElementById("pontuacaoFinal").innerHTML =
        nomeJogador + ", você fez " + pontos + " pontos!";
    document.getElementById("telaFim").className = "mensagem";
}

// ---------- loop do jogo ----------

function loop() {
    if (jogando == true) {
        if (pulando == true) {
            if (subindo == true) {
                alturaPulo = alturaPulo + PASSO_SUBIDA;
                if (alturaPulo >= ALTURA_MAXIMA) {
                    subindo = false;
                }
            } else {
                alturaPulo = alturaPulo - PASSO_DESCIDA;
                if (alturaPulo <= 0) {
                    alturaPulo = 0;
                    pulando = false;
                }
            }
            astronauta.style.bottom = alturaPulo + "px";
        }

        tempoParaObstaculo = tempoParaObstaculo - 1;
        if (tempoParaObstaculo <= 0) {
            criarObstaculo();
            tempoParaObstaculo = 45 + Math.floor(Math.random() * 30);
        }

        for (var i = 0; i < obstaculos.length; i++) {
            var obs = obstaculos[i];
            obs.x = obs.x - velocidade;
            obs.elemento.style.left = obs.x + "px";

            if (obs.x < -100) {
                obs.elemento.remove();
                obstaculos.splice(i, 1);
                i = i - 1;
                pontos = pontos + 1;
                mostradorPontos.innerHTML = pontos;
            } else {
                var larguraAstro = 35;
                var posicaoAstro = 55;

                if (obs.x < posicaoAstro + larguraAstro && obs.x + obs.largura > posicaoAstro) {
                    if (alturaPulo < obs.altura - 10) {
                        fimDeJogo();
                    }
                }
            }
        }

        velocidade = 5 + Math.floor(pontos / 10);
        if (velocidade > 10) {
            velocidade = 10;
        }
    }
}
setInterval(loop, 33);
