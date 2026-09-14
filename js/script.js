const astro = document.querySelector(".astro")
const bN = document.querySelector(".buracoN")


const pulo = () => {
    astro.classList.add("pulo")

    setTimeout(() => {

        astro.classList.remove("pulo")

    }, 800);
}

const loop = setInterval(() => {
 
    const bNPosition = bN.offsetLeft;
    const astroPostion = +window.getComputedStyle(astro).bottom.replace("px", "");
    
    console.log(astroPostion);

    if (bNPosition <= 105 && bNPosition > 0 && astroPostion < 80) {
        bN.style.animation = "none";
        bN.style.left = `${bNPosition}px`;

        astro.style.animation = "none";
        astro.style.bottom = `${astroPostion}px`;

        /*Fazer a animação do astronauta sendo sugado pelo buraco negro ↓*/

        clearInterval(loop);
    }
}, 10)


document.addEventListener("keydown", pulo)