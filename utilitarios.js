function recuperarTexto(idComponente) {
    let componente;
    let valorIngresado;
    componente = document.getElementById(idComponente);
    valorIngresado = componente.value;
    return valorIngresado;
}

function recuperarInt(idComponente) {
    let valorCaja = recuperarTexto(idComponente);
    let valorEntero = parseInt(valorCaja);
    return valorEntero;
}
function recuperarFloat(idComponente) {
    let valorCaja = recuperarTexto(idComponente);
    let valorFlotante = parseFloat(valorCaja);
    return valorFlotante;
}
function mostrarTexto(idComponente, mensaje) {
    let componente;
    componente = document.getElementById(idComponente);
    componente.innerText = mensaje;
}
function mostrarTextoEnCaja(idComponente, mensaje) {
    let componente;
    componente = document.getElementById(idComponente);
    componente.value = mensaje;
}

function mostrarImagen(idComponente, rutaImagen) {
    let componente;
    componente = document.getElementById(idComponente);
    componente.src = rutaImagen;
}

function calcularDisponible(ingresos, ...egresos) {
    let sumaEgresos = egresos.reduce((acc, actual) => acc + actual, 0);
    let resultado = ingresos - sumaEgresos;
    return resultado <= 0 ? 0 : resultado;
}

function calcularCapacidadPago(montoDisponible) {
    return montoDisponible * 0.5;
}

function calcularInteresSimple(monto, tasa, plazoAnios) {
    return monto * (tasa / 100) * plazoAnios;
}

function calcularTotalPagar(monto, interes) {
    return monto + interes + 100;
}

function calcularCuotaMensual(total, plazoAnios) {
    let cuota = total / (plazoAnios * 12);
    return cuota.toFixed(2);
}

function analizarCredito(capacidadPago, cuotaMensual) {
    return capacidadPago > cuotaMensual ? true : false;
}

function aprobarCredito(credito) {
    return credito === true ? "CREDITO APROBADO" : "CREDITO RECHAZADO";
}