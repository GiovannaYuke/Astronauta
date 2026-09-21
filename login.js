// login.js - tela de login do jogo
// aqui a gente pega o nome do jogador e guarda pra usar na tela do jogo

function entrar() {
    var campo = document.getElementById("nome");
    var nome = campo.value;

    // tira espaços do começo e do fim
    nome = nome.trim();

    // condição: se o nome estiver vazio, avisa e não deixa entrar
    if (nome == "") {
        alert("Digite seu nome para jogar!");
        campo.focus();
    } else {
        // guarda o nome no navegador e vai pra tela do jogo
        localStorage.setItem("nomeJogador", nome);
        window.location.href = "game.html";
    }
}

// deixa apertar Enter no lugar de clicar no botão
document.getElementById("nome").addEventListener("keydown", function (evento) {
    if (evento.key == "Enter") {
        entrar();
    }
});
