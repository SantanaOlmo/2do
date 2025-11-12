/**
 * @file app.js
 * @description Lógica principal de la aplicación.
 * Implementa la inicialización de Firebase/MODO LOCAL, el Singleton TaskManager,
 * y los Observadores para la actualización del DOM con el Factory.
 */

// Importaciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, onSnapshot, collection, query, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Clases y Módulos
import { Tarea } from "./Tarea.js"; // Necesaria para crear nuevas instancias en modo local
import { TaskManager } from "./TaskManager.js";
import { ElementoUIFactory } from "./ElementoUIFactory.js";

// Variables globales de la aplicación
let db = null;
let auth = null;
let currentUserId = 'local-user';
let taskManager;
let isAuthReady = false;
let isLocalMode = false;

// Almacenamiento local (Fallback)
const localTareas = [];
const localObservers = [];

// Elementos del DOM
let listaTareasEl;
let inputTareaEl;
let contadorEl;
let userIdDisplayEl;
let authStatusEl;

// ----------------------------------------------------
// LÓGICA DE FALLBACK LOCAL (Si Firebase falla)
// ----------------------------------------------------

/**
 * Objeto proxy que simula el TaskManager para el modo local (in-memory).
 */
const LocalTaskManager = {
    agregarTarea(texto) {
        const nuevaTarea = new Tarea(texto);
        const tareaData = {
            docId: nuevaTarea.id.toString(), // Usamos el ID como docId local
            id: nuevaTarea.id,
            texto: nuevaTarea.texto,
            completada: nuevaTarea.completada,
            fechaCreacion: nuevaTarea.fechaCreacion.toISOString()
        };
        localTareas.push(tareaData);
        // Notificamos manualmente para el modo local
        localObservers.forEach(obs => obs());
    },
    marcarTarea(docId, nuevoEstado) {
        const tarea = localTareas.find(t => t.docId === docId);
        if (tarea) {
            tarea.completada = nuevoEstado;
            localObservers.forEach(obs => obs());
        }
    },
    eliminarTarea(docId) {
        const index = localTareas.findIndex(t => t.docId === docId);
        if (index > -1) {
            localTareas.splice(index, 1);
            localObservers.forEach(obs => obs());
        }
    },
    suscribir(observer) {
        localObservers.push(observer);
        // Devolvemos una función vacía para simular la desuscripción
        return () => { 
            const index = localObservers.indexOf(observer);
            if (index > -1) localObservers.splice(index, 1);
        };
    },
    // Método para simular obtener los datos que haría onSnapshot
    getTareasSnapshot() {
        return localTareas.sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime());
    }
};


/**
 * Inicializa Firebase y autentica al usuario. Si falla, activa el modo local.
 * @returns {Promise<void>}
 */
async function initializeFirebase() {
    setLogLevel('Debug');
    
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    let firebaseConfig = null;
    
    // 1. Verificar y Parsear Configuración
    if (typeof __firebase_config !== 'undefined' && __firebase_config) {
        try {
            firebaseConfig = JSON.parse(__firebase_config);
        } catch (e) {
            console.warn("Error al parsear la configuración de Firebase. Se usará modo local.", e);
        }
    }

    if (!firebaseConfig || Object.keys(firebaseConfig).length === 0) {
        // --- MODO LOCAL ---
        isLocalMode = true;
        taskManager = LocalTaskManager;
        currentUserId = 'USUARIO_LOCAL';
        userIdDisplayEl.textContent = currentUserId;
        authStatusEl.textContent = "MODO LOCAL (Sin persistencia DB)";
        isAuthReady = true;
        console.warn("Firebase config no está disponible. Inicializando TaskManager en MODO LOCAL.");
        
        // Iniciar el polling para simular onSnapshot
        setupLocalPollingObserver();
        return;
    }


    // --- MODO FIREBASE ---
    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        } else {
            await signInAnonymously(auth);
        }
        
    } catch (error) {
        console.error("Error crítico en la inicialización/autenticación de Firebase. Volviendo al modo local.", error);
        
        // --- FALLBACK INMEDIATO A MODO LOCAL TRAS FALLO CRÍTICO ---
        isLocalMode = true;
        taskManager = LocalTaskManager;
        currentUserId = 'USUARIO_LOCAL_FALLBACK';
        userIdDisplayEl.textContent = currentUserId;
        authStatusEl.textContent = "MODO LOCAL (Fallo Auth)";
        isAuthReady = true;
        setupLocalPollingObserver();
        return;
    }


    // 4. Observador de estado de autenticación (Firebase)
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUserId = user.uid;
            userIdDisplayEl.textContent = currentUserId;
            authStatusEl.textContent = "Conectado. ID: " + currentUserId.substring(0, 8) + '...';
            isAuthReady = true;

            if (!taskManager) { 
                taskManager = TaskManager.getInstance(db, currentUserId, appId);
                setupTaskListener();
            }

        } else {
            console.log("Usuario desconectado.");
            isAuthReady = false;
            authStatusEl.textContent = "Desconectado.";
        }
    });
}

// ----------------------------------------------------
// EJERCICIO 3 (OBSERVER) Y 4 (FACTORY)
// ----------------------------------------------------

/**
 * Observador 2: Muestra el número total y completadas (Requisito Ex 3).
 * @param {Array<object>} tareas - Array de tareas planas.
 */
function mostrarContador(tareas) {
    const total = tareas.length;
    const completadas = tareas.filter(t => t.completada).length;
    contadorEl.textContent = `Total: ${total} | Completadas: ${completadas}`;
}

/**
 * Observador 3: Actualiza la lista de tareas en el DOM (Ampliación Ex 3 y Ex 4).
 * @param {Array<object>} tareas - Array de tareas planas.
 */
function actualizarListaDOM(tareas) {
    listaTareasEl.innerHTML = '';
    
    mostrarContador(tareas);

    if (tareas.length === 0) {
        listaTareasEl.innerHTML = '<p class="text-center text-gray-500 mt-4 p-4 bg-gray-100 rounded-lg">¡No hay tareas pendientes! Añade una nueva.</p>';
        return;
    }

    tareas.forEach(tarea => {
        try {
            // EJERCICIO 4: Uso del Factory
            const elemento = ElementoUIFactory.crearElementoTarea(
                tarea, 
                'detallado',
                (docId, nuevoEstado) => taskManager.marcarTarea(docId, nuevoEstado),
                (docId) => taskManager.eliminarTarea(docId)
            );
            listaTareasEl.appendChild(elemento);

        } catch (error) {
            console.error("Error al crear elemento UI con Factory:", error.message);
        }
    });
}


// --- LÓGICA DE OBSERVER PARA FIREBASE ---

/**
 * Configura el listener principal de Firestore (el Observer reactivo).
 */
function setupTaskListener() {
    const q = query(taskManager.getCollectionRef());
    
    onSnapshot(q, (querySnapshot) => {
        const tareas = [];
        querySnapshot.forEach((doc) => {
            const tareaData = { docId: doc.id, ...doc.data() };
            tareas.push(tareaData);
        });
        
        tareas.sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime());

        // Llamar al observador principal del DOM con los nuevos datos
        actualizarListaDOM(tareas);
        
        console.log(">>> OBSERVER: CONSOLA - Nueva data recibida de Firestore.");
    }, (error) => {
        console.error("Error en la escucha de Firestore (onSnapshot):", error);
        authStatusEl.textContent = "Error de Conexión a DB.";
    });
}

// --- LÓGICA DE OBSERVER PARA MODO LOCAL ---

/**
 * Inicia el temporizador para simular onSnapshot en modo local.
 */
function setupLocalPollingObserver() {
    // Suscribimos la función de actualización del DOM al TaskManager Local
    LocalTaskManager.suscribir(() => {
        const tareas = LocalTaskManager.getTareasSnapshot();
        actualizarListaDOM(tareas);
    });

    // Ejecutamos la primera vez para mostrar el estado inicial
    const tareasIniciales = LocalTaskManager.getTareasSnapshot();
    actualizarListaDOM(tareasIniciales);
}


/**
 * Manejador del formulario para añadir nuevas tareas.
 */
function nuevaTareaHandler(e) {
    e.preventDefault();
    
    const textoTarea = inputTareaEl.value.trim();

    if (!textoTarea) {
        console.warn("El campo de la tarea no puede estar vacío.");
        return;
    }

    if (isAuthReady && taskManager) {
        // La llamada es genérica, TaskManager o LocalTaskManager se encarga.
        taskManager.agregarTarea(textoTarea); 
        inputTareaEl.value = ""; 
    } else {
        authStatusEl.textContent = "Error: TaskManager no listo.";
        console.error("TaskManager no está listo.");
    }
}


// ----------------------------------------------------
// Lógica de Inicialización (DOM Ready)
// ----------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    // Inicialización de elementos del DOM
    listaTareasEl = document.getElementById("tareas");
    inputTareaEl = document.getElementById("input_tarea");
    contadorEl = document.getElementById("contador");
    userIdDisplayEl = document.getElementById("user-id-display");
    authStatusEl = document.getElementById("auth-status");
    const formulario = document.getElementById("formulario-tarea");
    
    // Asignación de eventos
    if (formulario) {
        formulario.addEventListener("submit", nuevaTareaHandler);
    }
    
    // Iniciar Firebase o Modo Local
    initializeFirebase();
});