function entrar() {
    var campo = document.getElementById("nome");
    var nome = campo.value;

    nome = nome.trim();

    if (nome == "") {
        alert("Digite seu nome para jogar!");
        campo.focus();
    } else {
        localStorage.setItem("nomeJogador", nome);
        window.location.href = "game.html";
    }
}

document.getElementById("nome").addEventListener("keydown", function (evento) {
    if (evento.key == "Enter") {
        entrar();
    }
});
