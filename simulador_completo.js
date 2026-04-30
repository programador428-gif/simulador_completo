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
  const inputTasa = parseInt(document.getElementById('tasaInteres').value);

  if (inputTasa < 10 || inputTasa > 20 || isNaN(inputTasa)) {
    alert('El valor tiene que estar entre 10 y 20');
    return;
  }

  tasaInteres = inputTasa;
}