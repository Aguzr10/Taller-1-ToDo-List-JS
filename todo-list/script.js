// Estado inicial: arreglo de tareas
let tareas = [];

// Elementos principales del HTML
const inputTarea = document.getElementById('input-tarea');
const formTarea = document.getElementById('form-tarea');
const listaTareas = document.getElementById('lista-tareas');
const contador = document.getElementById('contador');

// Función para guardar en el disco (localStorage)
function guardarTareas() {
    try {
        localStorage.setItem('mis-tareas', JSON.stringify(tareas));
    } catch (error) {
        console.error('No se pudo guardar la tarea', error);
    }
}

// Función para cargar lo que ya estaba guardado
function cargarTareas() {
    try {
        const datos = localStorage.getItem('mis-tareas');
        if (datos) {
            tareas = JSON.parse(datos);
        }
    } catch (error) {
        console.error('Hubo un error cargando las tareas', error);
        tareas = []; // Si falla, arrancamos de cero
    }
    pintarTareas();
}

// Función para mostrar las tareas en pantalla
function pintarTareas() {
    // Vaciamos la lista para volverla a pintar
    listaTareas.innerHTML = '';
    
    // Sacamos cuántas están completas (usando reduce)
    const tareasCompletas = tareas.reduce((acumulador, tarea) => {
        return tarea.completada ? acumulador + 1 : acumulador;
    }, 0);
    
    // Actualizamos el texto
    contador.textContent = `${tareasCompletas} de ${tareas.length} completadas`;

    // Pasamos por cada tarea y armamos su cajita HTML
    tareas.forEach(tarea => {
        const li = document.createElement('li');
        // Si está completada le ponemos la clase para que se vea tachada
        li.className = `tarea ${tarea.completada ? 'completada' : ''}`;
        li.dataset.id = tarea.id; // Guardamos el ID para saber cuál es cuál luego

        // Metemos el HTML base (usamos template literals)
        li.innerHTML = `
            <label class="checkbox-container">
                <input type="checkbox" class="toggle-tarea" ${tarea.completada ? 'checked' : ''}>
                <span class="texto-tarea"></span>
            </label>
            <button class="btn-eliminar">Eliminar</button>
        `;

        // Usamos textContent para evitar que se ejecute código HTML o JS por error (XSS)
        li.querySelector('.texto-tarea').textContent = tarea.texto;

        listaTareas.appendChild(li);
    });
}
