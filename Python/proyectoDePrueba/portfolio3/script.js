document.addEventListener('DOMContentLoaded', () => {
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    const portfolioResume = document.getElementById('portfolio-resume');
    const uploadPicInput = document.getElementById('upload-pic');
    const profilePicImg = document.getElementById('profile-pic');

    // Función para descargar como PDF
    if (downloadPdfBtn && portfolioResume && typeof html2pdf !== 'undefined') {
        downloadPdfBtn.addEventListener('click', () => {
            const opt = {
                margin:       1,
                filename:     'mi-portfolio.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, logging: true, dpi: 192, letterRendering: true },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().from(portfolioResume).set(opt).save();
        });
    } else if (downloadPdfBtn) {
        // Fallback si html2pdf.js no se cargó correctamente
        downloadPdfBtn.addEventListener('click', () => {
            alert('La librería para descargar PDF no se ha cargado. Asegúrate de tener conexión a internet o de incluir el script de html2pdf.js correctamente.');
            window.print(); // Opción de impresión básica como fallback
        });
    }

    // Funcionalidad para subir foto de perfil
    if (uploadPicInput && profilePicImg) {
        uploadPicInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePicImg.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});