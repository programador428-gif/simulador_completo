const tablaClientes = document.getElementById("tablaClientes");
let clientes = JSON.parse(localStorage.getItem("clientes")) || [
  { cedula: 1712345678, nombre: "Juan", apellido: "Pérez", ingresos: 1200, egresos: 500, correo: "juan@gmail.com" },
  { cedula: 1723456789, nombre: "María", apellido: "Gómez", ingresos: 1500, egresos: 600, correo: "maria@gmail.com" },
  { cedula: 1734567890, nombre: "Carlos", apellido: "Ramírez", ingresos: 900, egresos: 350, correo: "carlos@gmail.com" }
];
let creditos = {};

let tasaInteres = 15;
let clienteSeleccionado = null;
let cuotaCalculada = 0;
let montoCalculated = 0;
let plazoCalculado = 0;
let creditoAprobado = false;
let cliente_existe = null;

function mostrarError(idInput, mensaje) {
  const input = document.getElementById(idInput);
  if (!input.nextElementSibling || !input.nextElementSibling.classList.contains("error-msg")) {
    const errorSpan = document.createElement("span");
    errorSpan.className = "error-msg";
    errorSpan.textContent = mensaje;
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
  document.getElementById('contacto').classList.remove('activa');
  document.getElementById('registro').classList.remove('activa');
}

function mostrarSeccion(id) {
  ocultarSecciones();
  document.getElementById(id).classList.add('activa');
}

function guardarTasa() {
  limpiarErrores();
  const inputTasa = recuperarInt('tasaInteres');

  if (isNaN(inputTasa)) {
    return mostrarError("tasaInteres", "Este campo es obligatorio.");
  }

  if (inputTasa >= 10 && inputTasa <= 20) {
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
        <td>${e.correo}</td>
        <td>
          <button onclick="seleccionarCliente('${e.cedula}')">Actualizar</button>
          <button onclick="eliminarCliente('${e.cedula}')">Eliminar</button>
        </td>
      </tr>
    `;
  });
  tablaClientes.innerHTML = contenido;
}

function seleccionarCliente(cedula) {
  limpiarErrores();
  clienteSeleccionado = buscarCliente(cedula);

  if (clienteSeleccionado === null) {
    return alert(`No existe ningún cliente con la cédula: ${cedula}`);
  }

  mostrarTextoEnCaja("cedula", clienteSeleccionado.cedula);
  mostrarTextoEnCaja("nombre", clienteSeleccionado.nombre);
  mostrarTextoEnCaja("apellido", clienteSeleccionado.apellido);
  mostrarTextoEnCaja("ingresos", clienteSeleccionado.ingresos);
  mostrarTextoEnCaja("egresos", clienteSeleccionado.egresos);
  mostrarTextoEnCaja("correo", clienteSeleccionado.correo);
}

function guardarCliente() {
  const infoCliente = {
    cedula: recuperarInt("cedula"),
    nombre: recuperarTexto("nombre"),
    apellido: recuperarTexto("apellido"),
    ingresos: recuperarInt("ingresos"),
    egresos: recuperarInt("egresos"),
    correo: recuperarTexto("correo")
  };

  let formularioValido = true;

  if (isNaN(infoCliente.cedula)) {
    mostrarError("cedula", "Este campo es obligatorio.");
    formularioValido = false;
  }
  if (infoCliente.nombre === "") {
    mostrarError("nombre", "Este campo es obligatorio.");
    formularioValido = false;
  }
  if (infoCliente.apellido === "") {
    mostrarError("apellido", "Este campo es obligatorio.");
    formularioValido = false;
  }
  if (isNaN(infoCliente.ingresos)) {
    mostrarError("ingresos", "Este campo es obligatorio.");
    formularioValido = false;
  }
  if (isNaN(infoCliente.egresos)) {
    mostrarError("egresos", "Este campo es obligatorio.");
    formularioValido = false;
  }

  if (infoCliente.correo === "") {
    mostrarError("correo", "Este campo es obligatorio");
    formularioValido = false;
  }

  if (!formularioValido) return;

  const existe = buscarCliente(infoCliente.cedula);

  if (existe === null) {
    clientes.push(infoCliente);
    alert("Cliente creado con éxito");
  } else {
    existe.nombre = infoCliente.nombre;
    existe.apellido = infoCliente.apellido;
    existe.ingresos = infoCliente.ingresos;
    existe.egresos = infoCliente.egresos;
    existe.correo = infoCliente.correo;
    alert("Cliente actualizado con éxito");
  }

  pintarClientes();
  localStorage.setItem("clientes", JSON.stringify(clientes));
  limpiar();
}

function eliminarCliente(cedula) {
  const confirmar = confirm(`¿Estás seguro de que deseas eliminar al cliente con cédula ${cedula}?`);

  if (!confirmar) return;

  clientes = clientes.filter(c => c.cedula != cedula);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  pintarClientes();
  alert("Cliente eliminado con éxito");
}

function buscarClienteCredito() {
  limpiarErrores();
  const cedula = recuperarInt("buscarCedulaCredito");

  if (isNaN(cedula)) {
    return mostrarError("buscarCedulaCredito", "Rellene el campo correctamente.");
  }

  cliente_existe = buscarCliente(cedula);

  if (cliente_existe === null) {
    alert('No existe ningún cliente con esa cedula');
    document.getElementById("datosClienteCredito").innerHTML = "";
    return;
  }

  clienteSeleccionado = cliente_existe;

  document.getElementById("datosClienteCredito").innerHTML = `
      <h2>Datos del Cliente</h2>
      <p>Cedula: ${clienteSeleccionado.cedula}</p>
      <p>Nombre: ${clienteSeleccionado.nombre}</p>
      <p>Apellido: ${clienteSeleccionado.apellido}</p>
      <p>Ingresos: ${clienteSeleccionado.ingresos}</p>
      <p>Egresos: ${clienteSeleccionado.egresos}</p>
      <p>Correo: ${clienteSeleccionado.correo}</p>
    `;
}

function limpiar() {
  mostrarTextoEnCaja("cedula", "");
  mostrarTextoEnCaja("nombre", "");
  mostrarTextoEnCaja("apellido", "");
  mostrarTextoEnCaja("ingresos", "");
  mostrarTextoEnCaja("egresos", "");
  mostrarTextoEnCaja("correo", "");
  limpiarErrores();
  clienteSeleccionado = null;
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

  if (!validacionExitosa) return;

  if (!cliente_existe) {
    return alert("Por favor, busque y seleccione un cliente primero.");
  }

  const ingresos = parseFloat(clienteSeleccionado.ingresos);
  const egresos = parseFloat(clienteSeleccionado.egresos);
  const tasa = parseFloat(tasaInteres);

  let disponible = calcularDisponible(ingresos, egresos);
  let capacidad = calcularCapacidadPago(disponible);
  let interesSimple = calcularInteresSimple(MONTO_CREDITO, tasa, PLAZO_CREDITO);
  let totalPagar = calcularTotalPagar(MONTO_CREDITO, interesSimple);
  let cuotaMensual = parseFloat(calcularCuotaMensual(totalPagar, PLAZO_CREDITO));

  let creditoPosible = analizarCredito(capacidad, cuotaMensual);
  const mensajeFinal = aprobarCredito(creditoPosible);

  const contenedorResultado = document.getElementById("resultadoCredito");
  const btnAsignar = document.getElementById("btnAsignarCredito");

  contenedorResultado.className = creditoPosible ? "aprobado" : "rechazado";
  if (creditoPosible) {
    btnAsignar.removeAttribute("disabled");
  } else {
    btnAsignar.setAttribute("disabled", "true");
  }

  contenedorResultado.innerHTML = `
    <strong>Capacidad de pago:</strong> $${capacidad.toLocaleString()} <br>
    <strong>Total a pagar:</strong> $${totalPagar.toLocaleString()} <br>
    <strong>Cuota mensual:</strong> $${cuotaMensual.toLocaleString()} <br>
    <strong>Resultado:</strong> ${mensajeFinal}
  `;
}

function activarValidacionEnTiempoReal() {
  const todosLosInputs = document.querySelectorAll("input");

  todosLosInputs.forEach(input => {
    input.addEventListener("input", function () {

      const valor = this.value.trim();
      const esNumeroValido = !isNaN(this.value) && this.value !== "";

      if (valor !== "" && (this.type !== "number" || esNumeroValido)) {
        this.style.borderColor = "";

        if (this.nextElementSibling && this.nextElementSibling.classList.contains("error-msg")) {
          this.nextElementSibling.remove();
        }
      }
    });
  });
}

function asignarCredito() {
  credito = {
    cedula: clienteSeleccionado.cedula,
    nombre: clienteSeleccionado.nombre,
    apellido: clienteSeleccionado.apellido,
    ingresos: clienteSeleccionado.ingresos,
    egresos: clienteSeleccionado.egresos,
    correo: clienteSeleccionado.correo
  }
}

activarValidacionEnTiempoReal();
pintarClientes();