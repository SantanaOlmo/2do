/**
 * Añade un mensaje a la lista de logs.
 * @param {string} mensaje - El mensaje a mostrar.
 */
function log(mensaje) {
    const logList = document.getElementById('log');
    const li = document.createElement('li');
    li.textContent = mensaje;
    logList.appendChild(li);
    // Auto-scroll al final
    logList.scrollTop = logList.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    const zonaMouse = document.getElementById('zona-mouse');
    const inputTexto = document.getElementById('input-texto');

    // Eventos de Ratón
    zonaMouse.addEventListener('mouseenter', () => {
        zonaMouse.classList.add('highlight');
        log('Ratón Entró');
    });

    zonaMouse.addEventListener('mouseleave', () => {
        zonaMouse.classList.remove('highlight');
        log('Ratón Salió');
    });

    zonaMouse.addEventListener('click', () => {
        log('Clic');
    });

    zonaMouse.addEventListener('mousemove', (event) => {
        // Desafío: Mostrar posición
        // Usamos offsetX y offsetY para coordenadas relativas al elemento, o clientX/clientY para viewport
        // La instrucción dice "Ratón moviéndose en X: (posX), Y: (posY)"
        log(`Ratón moviéndose en X: ${event.offsetX}, Y: ${event.offsetY}`);
    });

    // Eventos de Teclado
    inputTexto.addEventListener('focus', () => {
        log('Input enfocado');
    });

    inputTexto.addEventListener('blur', () => {
        log('Input desenfocado');
    });

    inputTexto.addEventListener('keydown', (event) => {
        log(`Tecla pulsada: ${event.key}`);
    });

    inputTexto.addEventListener('keyup', (event) => {
        log(`Tecla soltada: ${event.code}`);
    });
});
