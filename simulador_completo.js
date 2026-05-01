const tablaClientes = document.getElementById("tablaClientes");
const clientes = [
  { cedula: 1712345678, nombre: "Juan", apellido: "Pérez", ingresos: 1200, egresos: 500 },
  { cedula: 1723456789, nombre: "María", apellido: "Gómez", ingresos: 1500, egresos: 600 },
  { cedula: 1734567890, nombre: "Carlos", apellido: "Ramírez", ingresos: 900, egresos: 350 }
];
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

function guardarCliente() {
  const cliente = {
    cedula: recuperarInt("cedula"),
    nombre: recuperarTexto("nombre"),
    apellido: recuperarTexto("apellido"),
    ingresos: recuperarInt("ingresos"),
    egresos: recuperarInt("egresos")
  }

  clientes.push(cliente);
  pintarClientes();
}

function pintarClientes() {
  let contenido = "";
  clientes.forEach(e => {
    contenido += `
      <tr>
        <td>${e.cedula}</td>
        <td>${e.nombre}</td>
        <td>${e.apellido}</td>
        <td>${e.ingresos}</td>
        <td>${e.egresos}</td>
        <td>
          <button>Actualizar</button>
          <button>Eliminar</button>
        </td>
      </tr>
    `;
  });
  tablaClientes.innerHTML = contenido;
}

pintarClientes();