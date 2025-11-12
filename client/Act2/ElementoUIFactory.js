/**
 * @file ElementoUIFactory.js
 * @description Implementa el patrón Factory para desacoplar la creación de elementos UI.
 */

/**
 * Fábrica para crear diferentes representaciones de elementos de la interfaz de usuario (UI)
 * a partir de un objeto Tarea, siguiendo el patrón Factory.
 */
export class ElementoUIFactory {

    /**
     * Crea un elemento de lista HTML simple a partir de una tarea.
     * @param {object} tareaData - Los datos planos de la tarea (id, texto, completada).
     * @returns {HTMLLIElement} Un elemento <li> con solo el texto de la tarea.
     */
    static _crearSimple(tareaData) {
        const li = document.createElement('li');
        li.className = 'p-2 border-b border-gray-300';
        li.textContent = `[${tareaData.completada ? 'x' : ' '}] ${tareaData.texto}`;
        return li;
    }

    /**
     * Crea un elemento de lista HTML detallado (con checkbox y botón de eliminar) a partir de una tarea.
     * @param {object} tareaData - Los datos planos de la tarea (id, texto, completada, docId, fechaCreacion).
     * @param {function(string, boolean): void} onToggle - Callback para manejar el evento de alternar completado.
     * @param {function(string): void} onRemove - Callback para manejar el evento de eliminar.
     * @returns {HTMLDivElement} Un elemento <div> que representa la tarea detallada.
     */
    static _crearDetallado(tareaData, onToggle, onRemove) {
        const { docId, texto, completada, fechaCreacion } = tareaData;

        const div = document.createElement('div');
        div.className = `flex items-center justify-between p-3 mb-2 rounded-lg shadow-sm transition duration-200 ${completada ? 'bg-green-50 border-l-4 border-green-500' : 'bg-white border-l-4 border-blue-500'} hover:shadow-md`;
        div.setAttribute('data-id', docId);

        // Contenedor principal de contenido (checkbox y texto)
        const content = document.createElement('div');
        content.className = 'flex items-center space-x-3 w-4/5 cursor-pointer';
        content.onclick = () => onToggle(docId, !completada);

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'h-5 w-5 text-blue-600 rounded cursor-pointer pointer-events-none';
        checkbox.checked = completada;
        
        // Texto de la Tarea
        const spanTexto = document.createElement('span');
        spanTexto.className = `text-gray-900 flex-grow text-sm md:text-base ${completada ? 'line-through text-gray-500' : 'font-medium'}`;
        spanTexto.textContent = texto;

        // Fecha de Creación
        const date = new Date(fechaCreacion);
        const fechaFormateada = date.toLocaleDateString('es-ES', { 
            month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
        const spanFecha = document.createElement('span');
        spanFecha.className = 'text-xs text-gray-400 ml-4 hidden md:block'; 
        spanFecha.textContent = fechaFormateada;


        content.appendChild(checkbox);
        content.appendChild(spanTexto);
        content.appendChild(spanFecha);

        // Botón de Eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'text-red-500 hover:text-red-700 transition duration-150 p-2 rounded-full hover:bg-red-100 flex items-center justify-center focus:outline-none';
        btnEliminar.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clip-rule="evenodd" />
            </svg>
        `;
        btnEliminar.onclick = (e) => {
            e.stopPropagation(); // Evita que se active el toggle al eliminar
            onRemove(docId);
        };

        div.appendChild(content);
        div.appendChild(btnEliminar);

        return div;
    }

    /**
     * Método principal del Factory. Crea el elemento UI de una tarea según el tipo especificado.
     * @param {object} tareaData - Los datos planos de la tarea, incluyendo el 'docId' de Firestore.
     * @param {string} tipo - El tipo de elemento a crear ('simple' o 'detallado'). Por defecto es 'detallado'.
     * @param {function(string, boolean): void} [onToggle] - Callback para alternar estado. Requerido para 'detallado'.
     * @param {function(string): void} [onRemove] - Callback para eliminar. Requerido para 'detallado'.
     * @returns {HTMLElement} El elemento HTML creado.
     * @throws {Error} Si el tipo de elemento no es reconocido.
     */
    static crearElementoTarea(tareaData, tipo = 'detallado', onToggle, onRemove) {
        if (!tareaData || typeof tareaData.texto !== 'string') {
            throw new Error("Datos de tarea inválidos proporcionados al Factory.");
        }

        switch (tipo) {
            case 'simple':
                return ElementoUIFactory._crearSimple(tareaData);
            case 'detallado':
                if (!onToggle || !onRemove) {
                    throw new Error("Los callbacks onToggle y onRemove son requeridos para el tipo 'detallado'.");
                }
                return ElementoUIFactory._crearDetallado(tareaData, onToggle, onRemove);
            default:
                throw new Error(`Tipo de elemento UI no reconocido: ${tipo}`);
        }
    }
}