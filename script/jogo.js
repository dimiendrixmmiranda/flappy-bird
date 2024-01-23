const jogo = document.querySelector('[flappy-bird]')
const btnStart = document.querySelector('#start')
const passaro = document.querySelector('#passaro')
const elementoPontuacaoMaxima = document.querySelector('#pontuacaoMaxima')
const alturaDoJogo = window.getComputedStyle(jogo).height.split('px')[0]
const larguraDoJogo = window.getComputedStyle(jogo).width.split('px')[0]
let pontuacaoMaxima = 0
const abertura = alturaDoJogo / 2.5
let pontos = 0
const espacoEntreBarreiras = 350
let temporizador = null

console.log(alturaDoJogo / 5)
const infoJogo = JSON.parse(localStorage.getItem("infoJogo"))


btnStart.addEventListener('click', () => {
    comecarJogo()
})

if(localStorage.getItem("infoJogo") != null){
    elementoPontuacaoMaxima.innerHTML = `${localStorage.getItem("infoJogo")}`
}else{
    elementoPontuacaoMaxima.innerHTML = 0
}

function comecarJogo() {
    ocultarBtnStart()
    const conjuntoBarreiras = criarConjuntoParDeBarreiras(900)
    const passaro = inserirPassaro(alturaDoJogo)
    inserirPontuacao(pontos)
    temporizador = setInterval(() => {
        animarBarreiras(conjuntoBarreiras)
        animarPassaro(passaro)
        if(colidiu(passaro, conjuntoBarreiras)){
            clearInterval(temporizador)
            const btnRestart = criarElemento('button', 'btn')
            btnRestart.innerHTML = 'Restart'
            btnRestart.addEventListener('click', () => {
                window.location.reload(true)
            })
            jogo.appendChild(btnRestart)

            const pontuacaoAtual = pontos
            if(pontuacaoAtual > localStorage.getItem("infoJogo")){
                localStorage.setItem("infoJogo", JSON.stringify(pontuacaoAtual))
                elementoPontuacaoMaxima.innerHTML = pontuacaoAtual
            }
        }
    }, 20);
}

const ocultarBtnStart = () => btnStart.style.display = 'none'
const mostrarPontucao = () => elementoPontuacao.style.display = 'block'

function criarElemento(tag, classe) {
    const elemento = document.createElement(tag)
    elemento.classList.add(classe)
    return elemento
}

function criarParDeBarreiras(altura1, posicaoX) {
    const parDeBarreiras = criarElemento('div', 'par-de-barreiras')

    const barreira1 = criarBarreira(true)
    const barreira2 = criarBarreira(false)

    // definindo altura
    const alturaBarreira1 = altura1
    const alturaBarreira2 = alturaDoJogo - abertura - alturaBarreira1

    barreira1.children[0].style.height = `${alturaBarreira1}px`
    barreira2.children[1].style.height = `${alturaBarreira2}px`
    parDeBarreiras.appendChild(barreira1)
    parDeBarreiras.appendChild(barreira2)

    setXParDeBarreiras(parDeBarreiras, posicaoX)
    return parDeBarreiras
}

function sortearAltura() {
    return (Math.random() * (alturaDoJogo - espacoEntreBarreiras)).toFixed(2)
}

function criarBarreira(barreiraReversa = false) {
    const barreira = criarElemento('div', 'barreira')

    const corpoCano = criarElemento('div', 'corpo-cano')
    const bocaCano = criarElemento('div', 'boca-cano')

    barreira.appendChild(barreiraReversa ? corpoCano : bocaCano)
    barreira.appendChild(barreiraReversa ? bocaCano : corpoCano)
    return barreira
}

function criarConjuntoParDeBarreiras(posicaoInicial) {
    const conjuntoBarreiras = [
        criarParDeBarreiras(sortearAltura(), posicaoInicial),
        criarParDeBarreiras(sortearAltura(), posicaoInicial + espacoEntreBarreiras),
        criarParDeBarreiras(sortearAltura(), posicaoInicial + espacoEntreBarreiras * 2),
        criarParDeBarreiras(sortearAltura(), posicaoInicial + espacoEntreBarreiras * 3),
    ]
    return conjuntoBarreiras
}

function animarBarreiras(conjuntoBarreiras){
    const deslocamento = 3
    conjuntoBarreiras.forEach(parDeBarreira => {
        setXParDeBarreiras(parDeBarreira, getXParDeBarreiras(parDeBarreira) - deslocamento)
        if (getXParDeBarreiras(parDeBarreira) <= -130) {
            const novoX = getXParDeBarreiras(parDeBarreira) + espacoEntreBarreiras * conjuntoBarreiras.length
            setXParDeBarreiras(parDeBarreira, novoX)
            const alturaBarreira1 = sortearAltura()
            const alturaBarreira2 = alturaDoJogo - abertura - alturaBarreira1
            parDeBarreira.children[0].children[0].style.height = `${alturaBarreira1}px`
            parDeBarreira.children[1].children[1].style.height = `${alturaBarreira2}px`
        }
        if (getXParDeBarreiras(parDeBarreira) < 500 && getXParDeBarreiras(parDeBarreira) > 496) {
            pontos++
            atualizarPontuacao(pontos)
        }
        jogo.appendChild(parDeBarreira)
    })
}

const getXParDeBarreiras = (par) => parseInt(par.style.left.split('px')[0])
const setXParDeBarreiras = (par, novoX) => par.style.left = `${novoX}px`

function inserirPontuacao(pontos) {
    const elementoPontuacao = criarElemento('span', 'progresso')
    elementoPontuacao.id = 'pontuacao'
    elementoPontuacao.innerHTML = pontos
    jogo.appendChild(elementoPontuacao)
}

function atualizarPontuacao(pontos) {
    const elementoPontuacao = document.querySelector('#pontuacao')
    elementoPontuacao.innerHTML = pontos
    console.log(pontos)
}


function estaoSobrepostos(elementoA, elementoB){
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top
    return horizontal && vertical
}

function colidiu (passaro, barreiras) {
    let colidiu = false

    barreiras.forEach(parDeBarreira => {
        if(!colidiu){
            let barreiraSuperior = parDeBarreira.children[0]
            let barreiraInferior = parDeBarreira.children[1]
            colidiu = estaoSobrepostos(passaro, barreiraSuperior) || estaoSobrepostos(passaro, barreiraInferior)
        }
    })
    return colidiu
}