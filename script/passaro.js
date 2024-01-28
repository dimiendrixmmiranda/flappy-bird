let voando = false

function inserirPassaro(alturaDoJogo) {
    const passaro = criarElemento('img', 'passaro')
    passaro.src = '../assets/imgs/passaro.png'
    passaro.style.display = 'block'
    passaro.style.bottom = `${alturaDoJogo / 2}px`
    passaro.style.left = `${larguraDoJogo / 2}px`
    passaro.style.width = `${55}px`
    jogo.appendChild(passaro)
    return passaro
}

const getYPassaro = (passaro) => parseInt(passaro.style.bottom.split('px')[0])
const setYPassaro = (passaro, novoY) => passaro.style.bottom = `${novoY}px`

function animarPassaro(passaro) {
    const alturaMaxima = alturaDoJogo - parseInt(passaro.style.width.split('px')[0])
    window.onkeydown = e => {
        console.log(e.code)
        if(e.code == 'ArrowUp' || e.code == 'Space'){
            voando = true
        }
    }

    window.onkeyup = e => {
        voando = false
    }

    document.querySelector('[flappy-bird]').addEventListener('touch', () => {
        document.body.innerHTML = 'teste'
    })
    
    if (voando == true) {
        if (getYPassaro(passaro) > alturaMaxima) {
            setYPassaro(passaro, alturaMaxima)
        }
        setYPassaro(passaro, getYPassaro(passaro) + 8)
    } else {
        if (getYPassaro(passaro) < 0) {
            setYPassaro(passaro, 0)
        }
        setYPassaro(passaro, getYPassaro(passaro) - 5)
    }

}