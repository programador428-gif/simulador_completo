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
let montoCalculated = 0;
let plazoCalculado = 0;
let creditoAprobado = false;
let cliente_existe = "";

function mostrarError(idInput, mensaje) {
  const input = document.getElementById(idInput);
  if (!input.nextElementSibling || !input.nextElementSibling.classList.contains("error-msg")) {
    const errorSpan = document.createElement("span");
    errorSpan.className = "error-msg";
    errorSpan.textContent = mensaje;
    errorSpan.style.cssText = "color: #dc3545; font-size: 12px; display: block; margin-top: -15px; margin-bottom: 15px; font-weight: 500;";
    input.insertAdjacentElement("afterend", errorSpan);
    input.style.borderColor = "#dc3545";
  }
}

function limpiarErrores() {
  const errores = document.querySelectorAll(".error-msg");
  errores.forEach(error => error.remove());
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => input.style.borderColor = "");
}

function buscarCliente(cedula) {
  const encontrado = clientes.find(c => c.cedula == cedula);
  return encontrado ? encontrado : null;
}

function ocultarSecciones() {
  document.getElementById('parametros').classList.remove('activa');
  document.getElementById('clientes').classList.remove('activa');
  document.getElementById('creditos').classList.remove('activa');
}

function mostrarSeccion(id) {
  ocultarSecciones();
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
          <button onclick="seleccionarCliente('${e.cedula}')">Actualizar</button>
          <button>Eliminar</button>
        </td>
      </tr>
    `;
  });
  tablaClientes.innerHTML = contenido;
}

function seleccionarCliente(cedula) {
  clienteSeleccionado = buscarCliente(cedula);

  if (clienteSeleccionado === null) {
    return alert(`No existe ningún cliente con la cédula: ${cedula}`);
  }

  mostrarTextoEnCaja("cedula", clienteSeleccionado.cedula);
  mostrarTextoEnCaja("nombre", clienteSeleccionado.nombre);
  mostrarTextoEnCaja("apellido", clienteSeleccionado.apellido);
  mostrarTextoEnCaja("ingresos", clienteSeleccionado.ingresos);
  mostrarTextoEnCaja("egresos", clienteSeleccionado.egresos);
}

function guardarCliente() {
  const infoCliente = {
    cedula: recuperarInt("cedula"),
    nombre: recuperarTexto("nombre"),
    apellido: recuperarTexto("apellido"),
    ingresos: recuperarInt("ingresos"),
    egresos: recuperarInt("egresos")
  };
  const valores = Object.values(infoCliente);

  const tieneErrores = valores.some(e => Number.isNaN(e) || e === "");

  if (tieneErrores) {
    return alert("Rellene todos los campos correctamente.");
  }

  const existe = buscarCliente(infoCliente.cedula);

  if (existe === null) {
    clientes.push(infoCliente);
    alert("Cliente creado con éxito");
  } else {
    existe.nombre = infoCliente.nombre;
    existe.apellido = infoCliente.apellido;
    existe.ingresos = infoCliente.ingresos;
    existe.egresos = infoCliente.egresos;
    alert("Cliente actualizado con éxito");
  }

  pintarClientes();
  limpiar();
}

function limpiar() {
  mostrarTextoEnCaja("cedula", "");
  mostrarTextoEnCaja("nombre", "");
  mostrarTextoEnCaja("apellido", "");
  mostrarTextoEnCaja("ingresos", "");
  mostrarTextoEnCaja("egresos", "");
  clienteSeleccionado = null;
}

function buscarClienteCredito() {
  const cedula = recuperarInt("buscarCedulaCredito");
  cliente_existe = buscarCliente(cedula);

  if (isNaN(cedula)) {
    return alert("Rellene el campo correctamente.");
  }

  if (cliente_existe === null) {
    alert('No existe ningún cliente con esa cedula');
    return;
  }

  document.getElementById("datosClienteCredito").innerHTML = `
      <h2>Datos del Cliente</h2>
      <p>Cedula: ${cliente_existe.cedula}</p>
      <p>Nombre: ${cliente_existe.nombre}</p>
      <p>Apellido: ${cliente_existe.apellido}</p>
      <p>Ingresos: ${cliente_existe.ingresos}</p>
      <p>Egresos: ${cliente_existe.egresos}</p>
    `;
}

function calcularCredito() {
  limpiarErrores();
  let validacionExitosa = true;

  const txtMonto = document.getElementById("montoCredito").value.trim();
  const txtPlazo = document.getElementById("plazoCredito").value.trim();

  if (txtMonto === "") {
    mostrarError("montoCredito", "Este campo es obligatorio.");
    validacionExitosa = false;
  }

  if (txtPlazo === "") {
    mostrarError("plazoCredito", "Este campo es obligatorio.");
    validacionExitosa = false;
  }

  if (!validacionExitosa) return;
  const MONTO_CREDITO = parseFloat(txtMonto);
  const PLAZO_CREDITO = parseInt(txtPlazo);

  if (isNaN(MONTO_CREDITO) || MONTO_CREDITO <= 0) {
    mostrarError("montoCredito", "El monto debe ser mayor a 0.");
    validacionExitosa = false;
  } else if (MONTO_CREDITO > 50000) {
    mostrarError("montoCredito", "El monto no puede superar los $50,000.");
    validacionExitosa = false;
  }

  if (isNaN(PLAZO_CREDITO) || PLAZO_CREDITO <= 0) {
    mostrarError("plazoCredito", "El plazo debe ser al menos 1 año.");
    validacionExitosa = false;
  } else if (PLAZO_CREDITO > 10) {
    mostrarError("plazoCredito", "El plazo máximo es de 10 años.");
    validacionExitosa = false;
  }

  if (validacionExitosa) {
    if (!cliente_existe) {
      return alert("Por favor, busque y seleccione un cliente primero.");
    }

    const ingresos = parseFloat(cliente_existe.ingresos);
    const egresos = parseFloat(cliente_existe.egresos);
    const tasa = parseFloat(tasaInteres);

    let disponible = calcularDisponible(ingresos, egresos);
    let capacidad = calcularCapacidadPago(disponible);
    let interesSimple = calcularInteresSimple(MONTO_CREDITO, tasa, PLAZO_CREDITO);
    let totalPagar = calcularTotalPagar(MONTO_CREDITO, interesSimple);
    let cuotaMensual = parseFloat(calcularCuotaMensual(totalPagar, PLAZO_CREDITO));

    let creditoPosible = analizarCredito(capacidad, cuotaMensual);
    const mensajeFinal = aprobarCredito(creditoPosible);

    const contenedorResultado = document.getElementById("resultadoCredito");

    contenedorResultado.className = creditoPosible ? "aprobado" : "rechazado";

    contenedorResultado.innerHTML = `
      <strong>Capacidad de pago:</strong> $${capacidad.toLocaleString()} <br>
      <strong>Total a pagar:</strong> $${totalPagar.toLocaleString()} <br>
      <strong>Cuota mensual:</strong> $${cuotaMensual.toLocaleString()} <br>
      <strong>Resultado:</strong> ${mensajeFinal}
    `;
  }
}

pintarClientes();