document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Cargar la preferencia del usuario al iniciar
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark-mode') {
        body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    //  escuchar cambios en el interruptor
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode'); // Guardar preferencia
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode'); // Guardar preferencia
        }
    });
});