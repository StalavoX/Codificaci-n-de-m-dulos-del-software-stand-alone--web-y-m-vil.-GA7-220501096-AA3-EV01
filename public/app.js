const urlApiCitas = '/api/citas';

const elementos = {
    formulario: document.getElementById('formularioCita'),
    citaId: document.getElementById('citaId'),
    nombre: document.getElementById('nombreCliente'),
    servicio: document.getElementById('servicio'),
    fecha: document.getElementById('fechaCita'),
    hora: document.getElementById('horaCita'),
    estado: document.getElementById('estado'),
    guardar: document.getElementById('btnGuardar'),
    textoGuardar: document.getElementById('textoBotonGuardar'),
    cancelar: document.getElementById('btnCancelarEdicion'),
    titulo: document.getElementById('tituloFormulario'),
    etiquetaId: document.getElementById('etiquetaId'),
    indicadorModo: document.getElementById('indicadorModo'),
    cuerpoTabla: document.getElementById('cuerpoTablaCitas'),
    contador: document.getElementById('contadorCitas'),
    estadoVacio: document.getElementById('estadoVacio'),
    carga: document.getElementById('indicadorCarga'),
    alerta: document.getElementById('alertaEstado'),
    alertaIcono: document.getElementById('alertaIcono'),
    alertaTexto: document.getElementById('alertaTexto')
};

let temporizadorAlerta;

const cerrarAlerta = () => {
    elementos.alerta.classList.add('hidden');
};

const mostrarMensaje = (mensaje, tipo = 'exito') => {
    clearTimeout(temporizadorAlerta);
    elementos.alerta.className =
        'mb-6 p-4 rounded-xl shadow-md transition-all duration-300 flex items-center justify-between';

    if (tipo === 'error') {
        elementos.alerta.classList.add('bg-rose-50', 'text-rose-800', 'border', 'border-rose-200');
        elementos.alertaIcono.className = 'fa-solid fa-triangle-exclamation text-rose-600 text-xl';
    } else if (tipo === 'info') {
        elementos.alerta.classList.add('bg-blue-50', 'text-blue-800', 'border', 'border-blue-200');
        elementos.alertaIcono.className = 'fa-solid fa-circle-info text-blue-600 text-xl';
    } else {
        elementos.alerta.classList.add('bg-emerald-50', 'text-emerald-800', 'border', 'border-emerald-200');
        elementos.alertaIcono.className = 'fa-solid fa-circle-check text-emerald-600 text-xl';
    }

    elementos.alertaTexto.textContent = mensaje;
    temporizadorAlerta = setTimeout(cerrarAlerta, 4500);
};

const obtenerEstiloBadge = (estado) => ({
    Confirmada: 'bg-blue-100 text-blue-800 border-blue-200',
    Completada: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Cancelada: 'bg-rose-100 text-rose-800 border-rose-200',
    Pendiente: 'bg-amber-100 text-amber-800 border-amber-200'
}[estado] || 'bg-amber-100 text-amber-800 border-amber-200');

const crearCelda = (clases = '') => {
    const celda = document.createElement('td');
    celda.className = clases;
    return celda;
};

const crearBotonAccion = (icono, titulo, clase, manejador) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.title = titulo;
    boton.className = clase;
    boton.addEventListener('click', manejador);
    const iconoElement = document.createElement('i');
    iconoElement.className = icono;
    boton.appendChild(iconoElement);
    return boton;
};

const crearFilaCita = (cita) => {
    const fila = document.createElement('tr');
    fila.className = 'hover:bg-slate-50 transition border-b border-slate-100';

    const celdaCliente = crearCelda('px-6 py-4 font-medium text-slate-900 whitespace-nowrap');
    const contenedor = document.createElement('div');
    contenedor.className = 'flex items-center gap-2';
    const inicial = document.createElement('div');
    inicial.className =
        'w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center ' +
        'font-bold text-xs uppercase';
    inicial.textContent = cita.nombreCliente ? cita.nombreCliente.charAt(0) : 'C';
    const nombre = document.createElement('span');
    nombre.textContent = cita.nombreCliente;
    contenedor.append(inicial, nombre);
    celdaCliente.appendChild(contenedor);

    const celdaServicio = crearCelda('px-6 py-4');
    celdaServicio.textContent = cita.servicio;

    const celdaFecha = crearCelda('px-6 py-4 text-slate-600 whitespace-nowrap');
    celdaFecha.textContent = cita.fechaCita;

    const celdaHora = crearCelda('px-6 py-4 text-slate-600 whitespace-nowrap');
    celdaHora.textContent = cita.horaCita;

    const celdaEstado = crearCelda('px-6 py-4 whitespace-nowrap');
    const badge = document.createElement('span');
    badge.className = `px-2.5 py-1 text-xs font-semibold rounded-full border ${obtenerEstiloBadge(cita.estado)}`;
    badge.textContent = cita.estado;
    celdaEstado.appendChild(badge);

    const celdaAcciones = crearCelda('px-6 py-4 text-center whitespace-nowrap');
    const acciones = document.createElement('div');
    acciones.className = 'flex items-center justify-center gap-2';
    acciones.append(
        crearBotonAccion('fa-regular fa-pen-to-square', 'Editar cita',
            'p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition',
            () => cargarCitaParaEditar(cita)),
        crearBotonAccion('fa-regular fa-trash-can', 'Eliminar cita',
            'p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition',
            () => eliminarCita(cita))
    );
    celdaAcciones.appendChild(acciones);

    fila.append(celdaCliente, celdaServicio, celdaFecha, celdaHora, celdaEstado, celdaAcciones);
    return fila;
};

const obtenerCitas = async () => {
    elementos.carga.classList.remove('hidden');
    elementos.cuerpoTabla.replaceChildren();
    elementos.estadoVacio.classList.add('hidden');

    try {
        const respuesta = await fetch(urlApiCitas);
        const resultado = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || 'No fue posible cargar las citas.');
        }

        const citas = Array.isArray(resultado.datos) ? resultado.datos : [];
        elementos.contador.textContent = String(citas.length);
        citas.forEach((cita) => elementos.cuerpoTabla.appendChild(crearFilaCita(cita)));
        elementos.estadoVacio.classList.toggle('hidden', citas.length !== 0);
    } catch (error) {
        console.error('Error al obtener citas:', error);
        mostrarMensaje(error.message, 'error');
    } finally {
        elementos.carga.classList.add('hidden');
    }
};

const limpiarFormulario = () => {
    elementos.formulario.reset();
    elementos.citaId.value = '';
    elementos.estado.value = 'Pendiente';
    elementos.titulo.textContent = 'Agendar Nueva Cita';
    elementos.textoGuardar.textContent = 'Guardar Cita';
    elementos.indicadorModo.className = 'w-3 h-3 rounded-full bg-blue-600 animate-pulse';
    elementos.etiquetaId.classList.add('hidden');
    elementos.cancelar.classList.add('hidden');
};

const cargarCitaParaEditar = (cita) => {
    elementos.citaId.value = cita._id;
    elementos.nombre.value = cita.nombreCliente;
    elementos.servicio.value = cita.servicio;
    elementos.fecha.value = cita.fechaCita;
    elementos.hora.value = cita.horaCita;
    elementos.estado.value = cita.estado;
    elementos.titulo.textContent = 'Editar Cita Agendada';
    elementos.textoGuardar.textContent = 'Actualizar Cita';
    elementos.indicadorModo.className = 'w-3 h-3 rounded-full bg-amber-500 animate-pulse';
    elementos.etiquetaId.classList.remove('hidden');
    elementos.cancelar.classList.remove('hidden');
    elementos.formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
    elementos.nombre.focus();
};

const eliminarCita = async (cita) => {
    if (!window.confirm(`¿Está seguro de eliminar la cita de "${cita.nombreCliente}"?`)) {
        return;
    }

    try {
        const respuesta = await fetch(`${urlApiCitas}/${encodeURIComponent(cita._id)}`, { method: 'DELETE' });
        const resultado = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || 'No fue posible eliminar la cita.');
        }
        if (elementos.citaId.value === cita._id) {
            limpiarFormulario();
        }
        mostrarMensaje(resultado.mensaje || 'Cita eliminada correctamente.', 'exito');
        await obtenerCitas();
    } catch (error) {
        console.error('Error al eliminar cita:', error);
        mostrarMensaje(error.message, 'error');
    }
};

const guardarCita = async (evento) => {
    evento.preventDefault();
    const datos = {
        nombreCliente: elementos.nombre.value.trim(),
        servicio: elementos.servicio.value,
        fechaCita: elementos.fecha.value,
        horaCita: elementos.hora.value,
        estado: elementos.estado.value
    };

    if (!datos.nombreCliente || !datos.servicio || !datos.fechaCita || !datos.horaCita) {
        mostrarMensaje('Complete todos los campos obligatorios.', 'error');
        return;
    }

    const id = elementos.citaId.value;
    elementos.guardar.disabled = true;
    elementos.textoGuardar.textContent = id ? 'Actualizando...' : 'Guardando...';

    try {
        const respuesta = await fetch(id ? `${urlApiCitas}/${encodeURIComponent(id)}` : urlApiCitas, {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || 'No fue posible guardar la cita.');
        }
        mostrarMensaje(resultado.mensaje || 'Cita guardada correctamente.', 'exito');
        limpiarFormulario();
        await obtenerCitas();
    } catch (error) {
        console.error('Error al guardar cita:', error);
        mostrarMensaje(error.message, 'error');
    } finally {
        elementos.guardar.disabled = false;
        if (!elementos.citaId.value) {
            elementos.textoGuardar.textContent = 'Guardar Cita';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    elementos.formulario.addEventListener('submit', guardarCita);
    elementos.cancelar.addEventListener('click', () => {
        limpiarFormulario();
        mostrarMensaje('Modo edición cancelado.', 'info');
    });
    document.getElementById('cerrarAlerta').addEventListener('click', cerrarAlerta);
    document.getElementById('btnActualizarLista').addEventListener('click', obtenerCitas);
    elementos.fecha.min = new Date().toLocaleDateString('en-CA');
    obtenerCitas();
});
