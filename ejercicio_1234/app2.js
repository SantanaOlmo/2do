/**
 * Expresión regular para validar formato de email simple.
 * @type {RegExp}
 */
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email-input');
    const emailFeedback = document.getElementById('email-feedback');

    /**
     * Valida el email y actualiza la interfaz.
     * @param {Event} event - El evento de input.
     */
    function validarEmail(event) {
        const valor = event.target.value;

        if (regexEmail.test(valor)) {
            emailInput.classList.add('valido');
            emailInput.classList.remove('invalido');
            emailFeedback.textContent = 'Email Válido';
            emailFeedback.className = 'valido'; // Aseguramos que el texto también sea verde
        } else {
            emailInput.classList.add('invalido');
            emailInput.classList.remove('valido');
            emailFeedback.textContent = 'Email Inválido';
            emailFeedback.className = 'invalido'; // Aseguramos que el texto también sea rojo
        }
    }

    emailInput.addEventListener('input', validarEmail);
});
