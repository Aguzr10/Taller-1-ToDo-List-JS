// Estado inicial: arreglo de tareas
let tareas = [];

// Elementos principales del HTML
const inputTarea = document.getElementById('input-tarea');
const formTarea = document.getElementById('form-tarea');
const listaTareas = document.getElementById('lista-tareas');
const contador = document.getElementById('contador');
const btnBorrarCompletadas = document.getElementById('btn-borrar-completadas');

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

    // Recorremos el arreglo con destructuring para sacar id, texto y completada
    tareas.forEach(({ id, texto, completada }) => {
        const li = document.createElement('li');
        // Si está completada le ponemos la clase para que se vea tachada
        li.className = `tarea ${completada ? 'completada' : ''}`;
        li.dataset.id = id; // Guardamos el ID para saber cuál es cuál luego

        // Metemos el HTML base (usamos template literals)
        li.innerHTML = `
            <label class="checkbox-container">
                <input type="checkbox" class="toggle-tarea" ${completada ? 'checked' : ''}>
                <span class="texto-tarea"></span>
            </label>
            <button class="btn-eliminar">Eliminar</button>
        `;

        // textContent para evitar XSS
        li.querySelector('.texto-tarea').textContent = texto;

        listaTareas.appendChild(li);
    });
}

// Escuchamos cuando se envía el formulario
formTarea.addEventListener('submit', (evento) => {
    evento.preventDefault(); // Evita que la página recargue sola
    
    const texto = inputTarea.value.trim();
    
    // Validamos que no metan tareas vacías
    if (!texto) {
        alert('Por favor escribe una tarea válida');
        return;
    }

    const nuevaTarea = {
        id: Date.now().toString(), // Generamos un ID usando la fecha
        texto: texto,
        completada: false
    };

    // Spread para agregar sin mutar el arreglo original
    tareas = [...tareas, nuevaTarea];
    
    inputTarea.value = ''; // Limpiamos la caja
    
    guardarTareas();
    pintarTareas();
});

// Delegación de eventos: ponemos un solo 'chismoso' en toda la lista
listaTareas.addEventListener('click', (evento) => {
    const clickEnBotonEliminar = evento.target.classList.contains('btn-eliminar');
    const clickEnCheckbox = evento.target.classList.contains('toggle-tarea');
    
    // Si no le dio a nada que importe, salimos
    if (!clickEnBotonEliminar && !clickEnCheckbox) {
        return; 
    }

    // Buscamos a qué <li> pertenece el click
    const li = evento.target.closest('li');
    const id = li.dataset.id;

    if (clickEnBotonEliminar) {
        // Filter deja pasar todas las que NO tengan este ID (o sea, borra la actual)
        tareas = tareas.filter(t => t.id !== id);
    } 
    
    if (clickEnCheckbox) {
        // Map pasa por todas, si encuentra el ID le voltea el estado de completado
        tareas = tareas.map(t => {
            if (t.id === id) {
                return { ...t, completada: !t.completada };
            }
            return t;
        });
    }

    guardarTareas();
    pintarTareas();
});

// Arrancamos la aplicación
cargarTareas();

// Extra: borra de un solo todas las tareas que ya están completadas
btnBorrarCompletadas.addEventListener('click', () => {
    // Filter deja solo las que NO están completadas
    tareas = tareas.filter(t => !t.completada);
    guardarTareas();
    pintarTareas();
});
