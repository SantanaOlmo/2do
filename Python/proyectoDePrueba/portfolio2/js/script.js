document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-upload');
    const profilePhoto = document.getElementById('profile-photo');
    const uploadBtn = document.querySelector('.upload-btn'); // Assuming the label is the button

    if (fileInput && profilePhoto) {
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePhoto.src = e.target.result;
                };
                reader.readAsDataURL(file);
                // Optionally hide the 'Subir Foto' button if a photo is uploaded
                // uploadBtn.style.display = 'none';
            }
        });

        // Make the label trigger the file input click
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });
        }
    }
});