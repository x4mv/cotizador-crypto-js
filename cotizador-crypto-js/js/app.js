// variables 
const formulario = document.querySelector('#formulario');
const monedaSelect = document.querySelector('#moneda');
const cryptoSelect = document.querySelector('#criptomonedas');
const resultadoView = document.querySelector('#resultado')



// eventlisteners 
document.addEventListener('DOMContentLoaded', () => {

    llenarCrypto();
    formulario.addEventListener('submit', cotizar);

})

//funciones

function cotizar(e){
    e.preventDefault();
    
    // trayendo el valor de los selects
    const moneda = monedaSelect.value;
    const crypto = cryptoSelect.value;

    


    // validando que no se dejen vacios 
    if (moneda === '' || crypto === ''){
        mostrarAlerta('Todos los campos son obligatorios','error');
        return;
    }
    
    convirtiendo( moneda, crypto)

}

function llenarCrypto(){

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(data => {
            const nombresCryto = data.Data;
            

            nombresCryto.forEach((crypto)=>{
                const {FullName, Name, Id } = crypto.CoinInfo;
                

                const options = document.createElement('option');
                options.textContent = FullName;
                options.value = Name;

                cryptoSelect.appendChild(options)
                
            })
        })
}

function mostrarAlerta(mensaje, tipo){

    const alerta = document.querySelector('.error')

    if (!alerta){

        const divAlerta = document.createElement('DIV');

        if (tipo === 'error'){
            divAlerta.classList.add('error')
        }else{
            console.log('cotizando...')
        }

        divAlerta.textContent = mensaje

        formulario.appendChild(divAlerta)

        setTimeout(() => {
            divAlerta.remove()
        }, 3000);

    }

    
}

function convirtiendo(moneda, crypto){

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypto}&tsyms=${moneda}`
    
    mostrarSpinner()

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(data => {
            mostrarCotizacion(data.DISPLAY[crypto][moneda]);
        })

}

function mostrarCotizacion(resObj){
    const {PRICE, LASTUPDATE, HIGHDAY, LOWDAY, CHANGEPCTDAY} = resObj;

    limpiartHTML(resultadoView)
    const contenedor = document.createElement('DIV');


    const precioActual = document.createElement('h3');
    precioActual.textContent = `El precio es: ${PRICE}`;

    const precioMasAlto = document.createElement('P');
    precioMasAlto.textContent = `Precio mas alto del dia: ${HIGHDAY}`

    const precioMasBajo = document.createElement('P');
    precioMasBajo.textContent = `Precio mas bajo del dia: ${LOWDAY}`

    const variacionDia = document.createElement('P');
    variacionDia.textContent = `Variacion ultimas 24 hrs: ${CHANGEPCTDAY}%`

    const ultimoUpdate = document.createElement('P');
    ultimoUpdate.textContent = `Ultima actualizacion: ${LASTUPDATE}`

    contenedor.appendChild(precioActual)
    contenedor.appendChild(precioMasAlto)
    contenedor.appendChild(precioMasBajo)
    contenedor.appendChild(variacionDia)
    contenedor.appendChild(ultimoUpdate)

    resultadoView.appendChild(contenedor)

}

function limpiartHTML(ref){

    while(ref.firstChild){
        ref.removeChild(ref.firstChild)
    }
}

function mostrarSpinner(){

    limpiartHTML(resultadoView)

    const spinner = document.createElement('DIV')
    spinner.className = 'spinner'

    spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>

    `

    resultadoView.appendChild(spinner)

}