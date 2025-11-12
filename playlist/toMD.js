// --- FUNCIONES DE UTILIDAD ---

/**
 * Convierte milisegundos a formato MM:SS (Minutos:Segundos).
 */
function msToMinutesAndSeconds(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Función para parsear una línea de CSV, manejando correctamente las comillas.
 */
function parseCsvLine(line) {
    // Regex: Divide por coma, pero solo si la coma no está dentro de comillas dobles.
    const re = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    const fields = line.split(re);

    // Limpia las comillas dobles de los campos (ej: "Track Name" -> Track Name)
    return fields.map(field => field.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
}

// --- LÓGICA PRINCIPAL DE CONVERSIÓN ---

/**
 * Procesa el contenido del CSV y genera la tabla Markdown.
 * @param {string} csvData - El contenido completo del archivo CSV.
 */
function processCsv(csvData) {
    const lines = csvData.trim().split('\n');
    const statusMessage = document.getElementById('status-message');
    const markdownOutput = document.getElementById('markdownOutput');
    const downloadBtn = document.getElementById('downloadBtn');
    
    downloadBtn.style.display = 'none'; // Ocultar el botón hasta que la conversión sea exitosa

    if (lines.length < 2) {
        statusMessage.className = 'error';
        statusMessage.textContent = "Error: El archivo CSV está vacío o solo contiene la cabecera.";
        markdownOutput.textContent = "";
        return;
    }

    const headers = parseCsvLine(lines[0]);
    const trackNameIndex = headers.indexOf('Track Name');
    const albumNameIndex = headers.indexOf('Album Name');
    const artistNameIndex = headers.indexOf('Artist Name(s)');
    const durationIndex = headers.indexOf('Duration (ms)');

    if ([trackNameIndex, albumNameIndex, artistNameIndex, durationIndex].some(index => index === -1)) {
        statusMessage.className = 'error';
        statusMessage.textContent = "Error: Faltan columnas esenciales: 'Track Name', 'Album Name', 'Artist Name(s)' o 'Duration (ms)'.";
        markdownOutput.textContent = "";
        return;
    }

    let markdownTable = "## 🎶 Lista de Álbumes/Canciones\n\n";
    markdownTable += "| ID | Título | Artista(s) | Álbum | Duración |\n";
    markdownTable += "| :--- | :--- | :--- | :--- | :--- |\n";

    let songCount = 0;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.length === 0) continue;

        const fields = parseCsvLine(line);
        
        // La línea debe tener al menos el número de campos de la cabecera
        if (fields.length < headers.length) {
             continue; 
        }

        const title = fields[trackNameIndex];
        const artist = fields[artistNameIndex];
        const album = fields[albumNameIndex];
        const durationMs = parseInt(fields[durationIndex]);

        if (!title || isNaN(durationMs)) continue;

        songCount++;
        const durationFormatted = msToMinutesAndSeconds(durationMs);

        // Limpieza básica del título (ej: elimina sufijos de remasterización para mantenerlo limpio)
        const finalTitle = title.replace(/\s*-\s*\d{4}\s*(Remastered)?\s*Version/i, '').trim();

        markdownTable += `| ${songCount} | ${finalTitle} | ${artist} | ${album} | ${durationFormatted} |\n`;
    }

    // Mostrar el resultado
    markdownOutput.textContent = markdownTable;
    statusMessage.className = 'success';
    statusMessage.textContent = `¡Conversión exitosa! Se han procesado ${songCount} canciones/álbumes.`;
    
    // Configurar el botón de descarga
    downloadBtn.style.display = 'block';
    downloadBtn.onclick = () => {
        const blob = new Blob([markdownTable], {type: "text/markdown"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'playlist.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
}


// --- INICIALIZACIÓN DEL NAVEGADOR ---

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('csvFile');
    const statusMessage = document.getElementById('status-message');

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            statusMessage.className = '';
            statusMessage.textContent = "Aún no se ha cargado ningún archivo.";
            return;
        }

        statusMessage.className = '';
        statusMessage.textContent = `Cargando y procesando: ${file.name}...`;

        const reader = new FileReader();

        reader.onload = (e) => {
            const csvContent = e.target.result;
            processCsv(csvContent);
        };

        reader.onerror = () => {
            statusMessage.className = 'error';
            statusMessage.textContent = `Error al leer el archivo. Asegúrate de que es un archivo de texto válido.`;
        };

        reader.readAsText(file); // Lee el archivo como texto plano
    });
});