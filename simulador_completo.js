let clientes = [];
let creditos = [];

let tasaInteres = 15;
let clienteSeleccionado = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;

function ocultarSecciones() {
  document.getElementById('parametros').classList.remove('activa');
  document.getElementById('clientes').classList.remove('activa');
}

function mostrarSeccion(id) {
  document.getElementById(id).classList.add('activa');
  document.getElementById(id).classList.add('activa');
}

function guardarTasa() {
  const inputTasa = recuperarInt('tasaInteres');

  if (inputTasa > 10 && inputTasa < 20) {
    tasaInteres = inputTasa;
    mostrarTexto('mensajeTasa', `✔ Tasa configurada correctamente: ${inputTasa}%`);
  } else {
    mostrarTexto('mensajeTasa', '❌ La tasa debe estar entre 10% y 20%');
  }
}