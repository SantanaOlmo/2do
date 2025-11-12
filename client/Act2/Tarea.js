/**
 * @file Tarea.js
 * @description Define la clase Tarea, el objeto base de la lista de tareas.
 * Documentación completa con JSDoc y métodos corregidos según el Ejercicio 1.
 */

/**
 * Representa una tarea individual con texto, estado de completado y metadatos.
 */
export class Tarea {
    /**
     * @type {number}
     * @description Un identificador único (marca de tiempo).
     */
    id;
    /**
     * @type {string}
     * @description El texto descriptivo de la tarea.
     */
    texto;
    /**
     * @type {boolean}
     * @description Indica si la tarea ha sido completada.
     */
    completada;
    /**
     * @type {Date}
     * @description La fecha y hora exactas en que se creó la tarea.
     */
    fechaCreacion;

    /**
     * Crea una instancia de Tarea.
     * @param {string} text - El contenido descriptivo de la tarea.
     */
    constructor(text) {
        this.id = Date.now(); 
        this.texto = text;
        this.completada = false;
        // Corregido a fechaCreacion según el enunciado
        this.fechaCreacion = new Date(); 
    }

    /**
     * Marca la tarea como completada, cambiando la propiedad 'completada' a true.
     * @returns {void}
     */
    completar() {
        // Corregido para que solo cambie a true, como pide el enunciado.
        this.completada = true;
    }

    /**
     * Devuelve una representación en string de la tarea, indicando su estado.
     * @returns {string} Un string formateado como "[ ] Texto de la tarea" o "[x] Texto de la tarea".
     */
    toString() {
        const estado = this.completada ? '[x]' : '[ ]';
        return `${estado} ${this.texto}`;
    }
}