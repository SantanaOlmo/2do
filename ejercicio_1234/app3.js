/**
 * Expresión regular para validar email.
 * @type {RegExp}
 */
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Expresión regular para validar contraseña (mín 8, 1 mayús, 1 núm).
 * @type {RegExp}
 */
const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-inscripcion');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const tipoEntradaSelect = document.getElementById('tipo-entrada');
    const tallerJsCheckbox = document.getElementById('taller-js');
    const tallerCssCheckbox = document.getElementById('taller-css');
    const resumenTotalDiv = document.getElementById('resumen-total');

    // Elementos de error
    const errorNombre = document.getElementById('error-nombre');
    const errorEmail = document.getElementById('error-email');
    const errorPassword = document.getElementById('error-password');

    /**
     * Valida el campo nombre.
     * @returns {boolean} True si es válido, false si no.
     */
    function validarNombre() {
        const valor = nombreInput.value.trim();
        if (valor === "") {
            mostrarError(nombreInput, errorNombre, "El nombre no puede estar vacío.");
            return false;
        } else {
            limpiarError(nombreInput, errorNombre);
            return true;
        }
    }

    /**
     * Valida el campo email.
     * @returns {boolean} True si es válido, false si no.
     */
    function validarEmail() {
        const valor = emailInput.value;
        if (!regexEmail.test(valor)) {
            mostrarError(emailInput, errorEmail, "Formato de email inválido.");
            return false;
        } else {
            limpiarError(emailInput, errorEmail);
            return true;
        }
    }

    /**
     * Valida el campo contraseña.
     * @returns {boolean} True si es válido, false si no.
     */
    function validarPassword() {
        const valor = passwordInput.value;
        if (!regexPassword.test(valor)) {
            mostrarError(passwordInput, errorPassword, "Debe tener mín. 8 caracteres, 1 mayúscula y 1 número.");
            return false;
        } else {
            limpiarError(passwordInput, errorPassword);
            return true;
        }
    }

    /**
     * Muestra un mensaje de error y añade la clase error al input.
     * @param {HTMLElement} inputElement - El elemento input.
     * @param {HTMLElement} errorElement - El elemento donde mostrar el mensaje.
     * @param {string} mensaje - El mensaje de error.
     */
    function mostrarError(inputElement, errorElement, mensaje) {
        inputElement.classList.add('error');
        errorElement.textContent = mensaje;
    }

    /**
     * Limpia el mensaje de error y quita la clase error del input.
     * @param {HTMLElement} inputElement - El elemento input.
     * @param {HTMLElement} errorElement - El elemento donde mostrar el mensaje.
     */
    function limpiarError(inputElement, errorElement) {
        inputElement.classList.remove('error');
        errorElement.textContent = "";
    }

    /**
     * Actualiza el total a pagar basándose en la selección.
     */
    function actualizarTotal() {
        let total = parseInt(tipoEntradaSelect.value);

        if (tallerJsCheckbox.checked) {
            total += parseInt(tallerJsCheckbox.value);
        }

        if (tallerCssCheckbox.checked) {
            total += parseInt(tallerCssCheckbox.value);
        }

        resumenTotalDiv.textContent = `Total a Pagar: ${total}€`;
    }

    // Listeners de Validación
    nombreInput.addEventListener('blur', validarNombre);
    emailInput.addEventListener('blur', validarEmail);
    passwordInput.addEventListener('input', validarPassword);

    // Listeners de Cálculo
    tipoEntradaSelect.addEventListener('change', actualizarTotal);
    tallerJsCheckbox.addEventListener('change', actualizarTotal);
    tallerCssCheckbox.addEventListener('change', actualizarTotal);

    // Gestión del Envío
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const esNombreValido = validarNombre();
        const esEmailValido = validarEmail();
        const esPasswordValido = validarPassword();

        if (esNombreValido && esEmailValido && esPasswordValido) {
            // Ocultar formulario y mostrar mensaje de éxito
            form.style.display = 'none';
            const mensajeExito = document.createElement('h2');
            mensajeExito.textContent = "¡Inscripción completada!";
            mensajeExito.style.color = 'green';
            mensajeExito.style.textAlign = 'center';
            document.body.appendChild(mensajeExito);
        }
    });
});
