var nomeJogador = localStorage.getItem("nomeJogador");
var pontos = 0;
var vidas = 3;
var velocidade = 5;
var jogando = false;
var pulando = false;
var alturaPulo = 0;
var subindo = false;
var caindoRapido = false;
var PASSO_SUBIDA = 10;
var PASSO_DESCIDA = 4;
var PASSO_DESCIDA_RAPIDA = 14;
var ALTURA_MAXIMA = 130;
var obstaculos = [];
var tempoParaObstaculo = 0;
var modoDificil = false;
var invencivel = false;
var tempoInvencivel = 0;
var DURACAO_INVENCIVEL = 33;
var som_colisao = new Audio("som/hit.wav.mp3");
var astronauta = document.getElementById("astronauta");
var tela = document.getElementById("tela");
var mostradorPontos = document.getElementById("pontos");
var mostradorVidas = document.getElementById("vidas");

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
    if (evento.code == "ArrowDown") {
        evento.preventDefault();
        descerRapido();
    }
});

function pular() {
    if (jogando == true && pulando == false) {
        pulando = true;
        subindo = true;
    }
}

function descerRapido() {
    if (jogando == true && pulando == true) {
        subindo = false;        
        caindoRapido = true;    
    }
}

// ---------- funcoes do jogo ----------

function comecarJogo(dificil) {
    modoDificil = (dificil == true);

    pontos = 0;
    if (modoDificil == true) {
        vidas = 2;        
        velocidade = 7;     
    } else {
        vidas = 3;
        velocidade = 5;
    }
    atualizarVidas();

    jogando = true;
    pulando = false;
    caindoRapido = false;
    alturaPulo = 0;
    tempoParaObstaculo = 60;

    invencivel = false;
    tempoInvencivel = 0;
    astronauta.classList.remove("piscando");

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
    var tipo = Math.floor(Math.random() * 3);
    if (tipo == 0) {
        imagem.src = "img/asteroide.gif";
        largura = 50;
        altura = 50;
    } else if (tipo == 1) {
        imagem.src = "img/Buraco Negro.gif";
        largura = 55;
        altura = 55;
    } else {
        imagem.src = "img/sol.gif";
        largura = 60;
        altura = 60;
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

    var textoModo = modoDificil ? " (modo difícil)" : "";
    document.getElementById("pontuacaoFinal").innerHTML =
        nomeJogador + ", você fez " + pontos + " pontos" + textoModo + "!";
    document.getElementById("telaFim").className = "mensagem";
}

function atualizarVidas() {
    if (vidas > 0) {
        mostradorVidas.innerHTML =
            "<img class='coracao' src='img/" + vidas + "coracao.jpg'>";
    } else {
        mostradorVidas.innerHTML = "";
    }
}

// ---------- loop do jogo ----------

function loop() {
    if (jogando == true) {

        if (invencivel == true) {
            tempoInvencivel = tempoInvencivel - 1;
            if (tempoInvencivel <= 0) {
                invencivel = false;
                astronauta.classList.remove("piscando");
            }
        }

        if (pulando == true) {
            if (subindo == true) {
                alturaPulo = alturaPulo + PASSO_SUBIDA;
                if (alturaPulo >= ALTURA_MAXIMA) {
                    subindo = false;
                }
            } else {
                var passoQueda = PASSO_DESCIDA;
                if (caindoRapido == true) {
                    passoQueda = PASSO_DESCIDA_RAPIDA;
                }
                alturaPulo = alturaPulo - passoQueda;
                if (alturaPulo <= 0) {
                    alturaPulo = 0;
                    pulando = false;
                    caindoRapido = false;   
                }
            }
            astronauta.style.bottom = alturaPulo + "px";
        }

        tempoParaObstaculo = tempoParaObstaculo - 1;
        if (tempoParaObstaculo <= 0) {
            criarObstaculo();

            var baseObstaculo = (modoDificil ? 30 : 45) - Math.floor(pontos / 5) * 3;
            var minimo = modoDificil ? 15 : 20;
            if (baseObstaculo < minimo) {
                baseObstaculo = minimo;
            }
            tempoParaObstaculo = baseObstaculo + Math.floor(Math.random() * 30);
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
                    if (alturaPulo < obs.altura - 10 && invencivel == false) {
                        som_colisao.currentTime = 0;
                        som_colisao.play();

                        obs.elemento.remove();
                        obstaculos.splice(i, 1);
                        i = i - 1;

                        vidas = vidas - 1;
                        atualizarVidas();

                        invencivel = true;
                        tempoInvencivel = DURACAO_INVENCIVEL;
                        astronauta.classList.add("piscando");

                        if (vidas <= 0) {
                            fimDeJogo();
                        }
                    }
                }
            }
        }

        if (modoDificil == true) {
            velocidade = 7 + Math.floor(pontos / 8);
            if (velocidade > 14) {
                velocidade = 14;
            }
        } else {
            velocidade = 5 + Math.floor(pontos / 10);
            if (velocidade > 10) {
                velocidade = 10;
            }
        }
    }
}

setInterval(loop, 30);