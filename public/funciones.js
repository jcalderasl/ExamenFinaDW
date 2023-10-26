// Obtiene el elemento del DOM donde se mostrarán los pacientes.
const pacientesDiv = document.getElementById('pacientes');




const tablaPacientes = document.getElementById('tablaPacientes');
const pacientesBody = document.getElementById('pacientes');

fetch('http://localhost:3000/pacientes')
    .then(response => response.json())
    .then(pacientes => {
        for (const paciente of pacientes) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${paciente._id}</td>
                <td>${paciente.nombre}</td>
                <td>${paciente.direccion}</td>
                <td>${paciente.fechaNacimiento}</td>
                <td>${paciente.sexo}</td>
                <td>${paciente.DPI}</td>
                <td>${paciente.telefono}</td>
                <td>${paciente.fechaVisita}</td>
                <td>${paciente.email}</td>
                <td>${paciente.diagnosticos}</td>
                <td>${paciente.tratamientos}</td>
                <td>${paciente.alergias}</td>
                <td>${paciente.enfermedades}</td>

            `;
            pacientesBody.appendChild(row);
        }
        tablaPacientes.appendChild(pacientesBody);
    });


//para consultar

const tablaPacientes2 = document.getElementById('tablaPacientes2');
const pacientesBody2 = document.getElementById('pacientes2');
    // Obtiene el formulario de consulta del DOM.
const formularioConsultar = document.getElementById('formularioConsultar');

const pacientesSeleccionados = new Set();

// Añade un evento 'submit' al formulario de consulta.
formularioConsultar.addEventListener('submit', (event) => {
    // Evita que el formulario se envíe de la manera predeterminada.
    event.preventDefault();

    // Obtiene el nombre del paciente a consultar.
    const nombreConsulta = document.getElementById('nombreConsulta').value;

    // Realiza una solicitud a la API para consultar pacientes por nombre.
    fetch(`http://localhost:3000/pacientes/consultar?nombre=${nombreConsulta}`)
        .then(response => response.json())
        .then(pacientes => {
            // Limpia el contenido anterior en el div "pacientes."
            pacientesBody2.innerHTML = '';

            if (pacientes.length === 0) {
                // Si no se encontraron pacientes, muestra un alert.
                alert("Paciente no encontrado");
            } else {
                // Si se encontraron pacientes, agrega los resultados al div "pacientes."
                for (const paciente of pacientes) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        
                        <td>${paciente.nombre}</td>
                        <td>${paciente.direccion}</td>
                        <td>${paciente.fechaNacimiento}</td>
                        <td>${paciente.sexo}</td>
                        <td>${paciente.DPI}</td>
                        <td>${paciente.telefono}</td>
                        <td>${paciente.fechaVisita}</td>
                        <td>${paciente.email}</td>
                        <td>${paciente.diagnosticos}</td>
                        <td>${paciente.tratamientos}</td>
                        <td>${paciente.alergias}</td>
                        <td>${paciente.enfermedades}</td>
                        <td>
                            <input type="checkbox" class="seleccionarPaciente" data-id="${paciente._id}">
                        </td>
                    `;
                    pacientesBody2.appendChild(row);
                }
            }
        });
});

// Agrega un evento al botón para eliminar pacientes seleccionados
const btnEliminarPacientes = document.getElementById('btnEliminarPacientes');
btnEliminarPacientes.addEventListener('click', () => {
    if (pacientesSeleccionados.size === 0) {
        alert("Selecciona al menos un paciente para eliminar.");
    } else {
        if (confirm("¿Estás seguro de que deseas eliminar los pacientes seleccionados?")) {
            // Realiza una solicitud a la API para eliminar los pacientes seleccionados.
            for (const id of pacientesSeleccionados) {
                fetch(`http://localhost:3000/pacientes/${id}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (response.ok) {
                            alert("Pacientes eliminados correctamente.");
                            // Puedes realizar una actualización adicional de la lista de pacientes si es necesario.
                        } else {
                            alert("Error al eliminar los pacientes.");
                        }
                    });
            }

            // Limpia la lista de pacientes seleccionados
            pacientesSeleccionados.clear();
        }
    }
});

// Agrega un evento para seleccionar pacientes con checkboxes
document.addEventListener('change', (event) => {
    if (event.target.classList.contains('seleccionarPaciente')) {
        const idPaciente = event.target.dataset.id;
        if (event.target.checked) {
            pacientesSeleccionados.add(idPaciente);
        } else {
            pacientesSeleccionados.delete(idPaciente);
        }
    }
});







//para agregar
// Obtiene el formulario del DOM.
const formulario = document.getElementById('formulario');

// Añade un evento 'submit' al formulario.
formulario.addEventListener('submit', (event) => {
    // Evita que el formulario se envíe de la manera predeterminada.
    event.preventDefault();

    // Crea un objeto con los datos del formulario.
    const nuevoPaciente = {
        nombre: document.getElementById('nombre').value,
        direccion: document.getElementById('direccion').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        sexo: document.getElementById('sexo').value,
        DPI: document.getElementById('DPI').value,
        telefono: document.getElementById('telefono').value,
        fechaVisita: document.getElementById('fechaVisita').value,
        email: document.getElementById('email').value,
        diagnosticos: document.getElementById('diagnosticos').value,
        tratamientos: document.getElementById('tratamientos').value,
        alergias: document.getElementById('alergias').value,
        enfermedades: document.getElementById('enfermedades').value
    };

    // Envía los datos del formulario a la API para crear un nuevo paciente.
    fetch('http://localhost:3000/pacientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoPaciente)
    })
        .then(response => response.json())
        .then(paciente => {
            // Obtiene el cuerpo de la tabla "pacientes".
            const pacientesBody = document.getElementById('pacientes');

            // Crea una nueva fila y agrega los datos del paciente.
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${paciente._id}</td>
                <td>${paciente.nombre}</td>
                <td>${paciente.direccion}</td>
                <td>${paciente.fechaNacimiento}</td>
                <td>${paciente.sexo}</td>
                <td>${paciente.DPI}</td>
                <td>${paciente.telefono}</td>
                <td>${paciente.fechaVisita}</td>
                <td>${paciente.email}</td>
                <td>${paciente.diagnosticos}</td>
                <td>${paciente.tratamientos}</td>
                <td>${paciente.alergias}</td>
                <td>${paciente.enfermedades}</td>
            `;

            // Agrega la nueva fila a la tabla.
            pacientesBody.appendChild(row);

            // Muestra un mensaje de alerta.
            alert("Paciente agregado correctamente.");

            // Limpia los campos del formulario.
            formulario.reset();
        });
});


//PARA ALERTA
// Obtiene el campo de entrada del DPI
const dpiInput = document.getElementById('DPI');

// Añade un evento 'input' para escuchar cambios en el campo de entrada.
dpiInput.addEventListener('input', () => {
    // Obtiene el valor actual del campo DPI.
    const dpiValue = dpiInput.value;

    // Define la longitud máxima permitida (en este caso, 13 dígitos).
    const maxLength = 13;

    // Verifica si el valor del DPI es mayor que la longitud máxima permitida.
    if (dpiValue.length > maxLength) {
        // Si es mayor, trunca el valor al máximo de 13 dígitos.
        dpiInput.value = dpiValue.slice(0, maxLength);
    }
});

// Obtiene el campo de entrada del DPI
const telInput = document.getElementById('telefono');

// Añade un evento 'input' para escuchar cambios en el campo de entrada.
telInput.addEventListener('input', () => {
    // Obtiene el valor actual del campo DPI.
    const dpiValue = telInput.value;

    // Define la longitud máxima permitida (en este caso, 13 dígitos).
    const maxLength = 8;

    // Verifica si el valor del DPI es mayor que la longitud máxima permitida.
    if (dpiValue.length > maxLength) {
        // Si es mayor, trunca el valor al máximo de 13 dígitos.
        telInput.value = dpiValue.slice(0, maxLength);
    }
});






//para actualizar
// Obtiene el formulario de actualización del DOM.
const formularioActualizar = document.getElementById('formularioActualizar');

// Añade un evento 'submit' al formulario de actualización.
formularioActualizar.addEventListener('submit', (event) => {
    // Evita que el formulario se envíe de la manera predeterminada.
    event.preventDefault();

    // Crea un objeto con los datos del formulario de actualización.
    const pacienteActualizado = {
        direccion: document.getElementById('direccionActualizar').value,
        telefono: document.getElementById('telefonoActualizar').value,
        fechaVisita: document.getElementById('fechaVisitaActualizar').value,
        email: document.getElementById('emailActualizar').value,
        diagnosticos: document.getElementById('diagnosticosActualizar').value,
        tratamientos: document.getElementById('tratamientosActualizar').value,
        alergias: document.getElementById('alergiasActualizar').value,
        enfermedades: document.getElementById('enfermedadesActualizar').value
    };

    // Envía los datos del formulario a la API para actualizar un paciente existente.
    fetch(`http://localhost:3000/pacientes/${document.getElementById('idActualizar').value}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pacienteActualizado)
    })
        .then(response => response.json())
        .then(paciente => {
            // Actualiza la fila correspondiente en la tabla.
            const pacienteRow = document.getElementById(`paciente-${paciente._id}`);
            pacienteRow.innerHTML = `
                <td>${paciente._id}</td>
                <td>${paciente.nombre}</td>
                <td>${paciente.direccion}</td>
                <td>${paciente.fechaNacimiento}</td>
                <td>${paciente.sexo}</td>
                <td>${paciente.DPI}</td>
                <td>${paciente.telefono}</td>
                <td>${paciente.fechaVisita}</td>
                <td>${paciente.email}</td>
                <td>${paciente.diagnosticos}</td>
                <td>${paciente.tratamientos}</td>
                <td>${paciente.alergias}</td>
                <td>${paciente.enfermedades}</td>
            `;

            // Muestra un mensaje de alerta.
            alert("Paciente actualizado correctamente.");
        });
});




//para eliminar
// Obtiene el formulario de eliminación del DOM.
const formularioEliminar = document.getElementById('formularioEliminar');

// Añade un evento 'submit' al formulario de eliminación.
formularioEliminar.addEventListener('submit', (event) => {
    // Evita que el formulario se envíe de la manera predeterminada.
    event.preventDefault();

    // Envía una solicitud a la API para eliminar un paciente existente.
    fetch(`http://localhost:3000/pacientes/${document.getElementById('idEliminar').value}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(message => {
            // Imprime el mensaje de éxito en la consola.
            console.log(message);

            // Muestra un mensaje de alerta.
            alert("Paciente eliminado correctamente.");
        });
});

