/**
 * @file TaskManager.js
 * @description Implementa la clase TaskManager, que utiliza los patrones Singleton y Observer.
 * Actúa como el gestor central de todas las tareas y maneja la interacción con Firestore.
 */

import { Tarea } from './Tarea.js';
import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

/**
 * Gestiona la colección de tareas.
 * Implementa el patrón Singleton para asegurar una única instancia global.
 * Actúa como Sujeto en el patrón Observer, aunque la reactividad principal la maneja Firestore (onSnapshot).
 */
export class TaskManager {
    /** @type {TaskManager} */
    static _instance = null;
    /** @type {Array<function(): void>} */
    observadores = [];
    /** @type {object} */
    db;
    /** @type {string} */
    userId;
    /** @type {string} */
    appId;

    /**
     * Constructor privado para forzar el uso del patrón Singleton.
     * @param {object} dbInstance - Instancia de Firestore.
     * @param {string} userId - ID del usuario actual.
     * @param {string} appId - ID de la aplicación.
     */
    constructor(dbInstance, userId, appId) {
        if (TaskManager._instance) {
            throw new Error("TaskManager es un Singleton. Use TaskManager.getInstance().");
        }
        this.db = dbInstance;
        this.userId = userId;
        this.appId = appId;
    }

    /**
     * Obtiene la única instancia del TaskManager (Singleton).
     * @param {object} [dbInstance] - Instancia de Firestore (solo necesaria en la primera llamada).
     * @param {string} [userId] - ID del usuario actual (solo necesaria en la primera llamada).
     * @param {string} [appId] - ID de la aplicación (solo necesaria en la primera llamada).
     * @returns {TaskManager} La instancia única de TaskManager.
     */
    static getInstance(dbInstance, userId, appId) {
        if (!TaskManager._instance) {
            if (!dbInstance || !userId || !appId) {
                console.error("TaskManager debe ser inicializado con la instancia de Firestore, userId y appId.");
                throw new Error("TaskManager no inicializado.");
            }
            TaskManager._instance = new TaskManager(dbInstance, userId, appId);
        }
        return TaskManager._instance;
    }
    
    /**
     * Construye la referencia a la colección privada de tareas de Firestore.
     * @returns {import("firebase/firestore").CollectionReference} La referencia a la colección.
     */
    getCollectionRef() {
        const path = `/artifacts/${this.appId}/users/${this.userId}/tareas`;
        return collection(this.db, path);
    }

    // --- Métodos del Patrón Observer (Sujeto) ---

    /**
     * Suscribe una función observadora.
     * @param {function(): void} observador - La función a añadir.
     * @returns {void}
     */
    suscribir(observador) {
        this.observadores.push(observador);
        // NOTA: La notificación real viene de onSnapshot en app.js
    }

    /**
     * Notifica a todos los observadores registrados.
     * @returns {void}
     */
    notificar() {
        // En este diseño, esta función es principalmente para el requisito del patrón
        // pero la reactividad principal la da el onSnapshot de Firestore en app.js.
        this.observadores.forEach(observador => observador());
    }

    // --- Métodos de Persistencia (Firestore) ---

    /**
     * Crea una nueva tarea en Firestore y notifica a los observadores (indirectamente via onSnapshot).
     * @param {string} texto - El texto de la nueva tarea.
     * @returns {Promise<void>}
     */
    async agregarTarea(texto) {
        try {
            const nuevaTarea = new Tarea(texto);
            // Convertir la instancia a un objeto plano serializable para Firestore
            const tareaData = {
                id: nuevaTarea.id,
                texto: nuevaTarea.texto,
                completada: nuevaTarea.completada,
                fechaCreacion: nuevaTarea.fechaCreacion.toISOString()
            };
            await addDoc(this.getCollectionRef(), tareaData);
            this.notificar(); // Notificación manual, aunque onSnapshot ya lo hace
        } catch (e) {
            console.error("Error al agregar documento a Firestore: ", e);
        }
    }

    /**
     * Busca y elimina una tarea por su ID en Firestore.
     * @param {string} firestoreDocId - El ID del documento de Firestore.
     * @returns {Promise<void>}
     */
    async eliminarTarea(firestoreDocId) {
        try {
            const docRef = doc(this.getCollectionRef(), firestoreDocId);
            await deleteDoc(docRef);
            this.notificar(); 
        } catch (e) {
            console.error("Error al eliminar documento de Firestore: ", e);
        }
    }

    /**
     * Busca la tarea por su ID de documento de Firestore y alterna su estado.
     * @param {string} firestoreDocId - El ID del documento de Firestore.
     * @param {boolean} nuevoEstado - El nuevo estado de completada.
     * @returns {Promise<void>}
     */
    async marcarTarea(firestoreDocId, nuevoEstado) {
        try {
            const docRef = doc(this.getCollectionRef(), firestoreDocId);
            await updateDoc(docRef, { completada: nuevoEstado });
            this.notificar(); 
        } catch (e) {
            console.error("Error al actualizar documento en Firestore: ", e);
        }
    }
}