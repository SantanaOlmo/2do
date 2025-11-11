document.addEventListener('DOMContentLoaded', () => {
    console.log("¡POKO Sequencer cargado y listo para hacer ruido!");

    // Variables de control del secuenciador
    const playPauseBtn = document.getElementById('play-pause-btn');
    const clearBtn = document.getElementById('clear-btn');
    const bpmSlider = document.getElementById('bpm-slider');
    const bpmDisplay = document.getElementById('bpm-display');
    const sequencerGrid = document.getElementById('sequencer-grid');
    const generateSynthBtn = document.getElementById('generate-synth-btn');
    const generationStatus = document.getElementById('generation-status');

    const savePatternBtn = document.getElementById('save-pattern-btn');
    const loadPatternBtn = document.getElementById('load-pattern-btn');
    const randomizePatternBtn = document.getElementById('randomize-pattern-btn');
    const extrasStatus = document.getElementById('extras-status');

    const numSteps = 4; // Número de pasos en la cuadrícula (columnas)

    // Estructura de instrumentos para gestionar nombres, claves, URLs y variaciones
    const instrumentGroups = [
        {
            baseName: 'Kick',
            key: 'kick',
            defaultUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/164071/kick.mp3',
            variations: [
                { type: 'base', label: 'Base', pitchSemitones: 0, currentName: 'Kick' },
                { type: 'up', label: '+1 Semitono', pitchSemitones: 1, currentName: 'Kick (+1)' },
                { type: 'down', label: '-1 Semitono', pitchSemitones: -1, currentName: 'Kick (-1)' }
            ]
        },
        {
            baseName: 'Snare',
            key: 'snare',
            defaultUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/164071/snare.mp3',
            variations: [
                { type: 'base', label: 'Base', pitchSemitones: 0, currentName: 'Snare' },
                { type: 'up', label: '+1 Semitono', pitchSemitones: 1, currentName: 'Snare (+1)' },
                { type: 'down', label: '-1 Semitono', pitchSemitones: -1, currentName: 'Snare (-1)' }
            ]
        },
        {
            baseName: 'HiHat',
            key: 'hihat',
            defaultUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/164071/hihat.mp3',
            variations: [
                { type: 'base', label: 'Base', pitchSemitones: 0, currentName: 'HiHat' },
                { type: 'up', label: '+1 Semitono', pitchSemitones: 1, currentName: 'HiHat (+1)' },
                { type: 'down', label: '-1 Semitono', pitchSemitones: -1, currentName: 'HiHat (-1)' }
            ]
        },
        {
            baseName: 'Clap',
            key: 'clap',
            defaultUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/461125/clap.mp3',
            variations: [
                { type: 'base', label: 'Base', pitchSemitones: 0, currentName: 'Clap' },
                { type: 'up', label: '+1 Semitono', pitchSemitones: 1, currentName: 'Clap (+1)' },
                { type: 'down', label: '-1 Semitono', pitchSemitones: -1, currentName: 'Clap (-1)' }
            ]
        }
    ];

    // Aplanar la estructura de instrumentGroups para facilitar el acceso a cada fila reproducible
    const playableInstruments = instrumentGroups.flatMap(group => 
        group.variations.map(variation => ({
            groupKey: group.key, // Para saber a qué grupo pertenece
            variationType: variation.type, // 'base', 'up', 'down'
            fullKey: `${group.key}_${variation.type}`, // Clave única para soundBuffers
            name: variation.currentName, // Nombre actual para la UI
            pitchSemitones: variation.pitchSemitones,
            defaultUrl: group.defaultUrl // URL por defecto del sonido base
        }))
    );

    const totalPlayableRows = playableInstruments.length; // Ahora es 4 * 3 = 12

    let isPlaying = false;
    let bpm = parseInt(bpmSlider.value);
    let currentStep = 0;
    let intervalId;
    let selectedRowIndex = 0; // Para el control por teclado (selección de fila)

    // Mapeo de teclas a índices de playableInstruments para reproducción directa
    const keyToInstrumentIndex = {
        'q': 0, // Kick Base
        'w': 1, // Kick +1
        'e': 2, // Kick -1
        'r': 3, // Snare Base
        'a': 4, // Snare +1
        's': 5, // Snare -1
        'd': 6, // HiHat Base
        'f': 7, // HiHat +1
        'z': 8, // HiHat -1
        'x': 9, // Clap Base
        'c': 10, // Clap +1
        'v': 11  // Clap -1
    };

    // AudioContext y almacenamiento de AudioBuffers
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const soundBuffers = {}; // Objeto para guardar los AudioBuffers cargados o generados

    // Función para cargar un sonido (fetch y decode) para un solo buffer
    async function loadSoundBuffer(key, url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            soundBuffers[key] = await audioContext.decodeAudioData(arrayBuffer);
            console.log(`Sonido '${key}' cargado.`);
        } catch (error) {
            console.error(`Error al cargar el sonido '${key}':`, error);
        }
    }

    // Función para generar un AudioBuffer con pitch shift (cambia la duración)
    async function pitchShiftBuffer(audioBuffer, semitones) {
        if (semitones === 0) return audioBuffer; // No pitch shift needed

        const rate = Math.pow(2, semitones / 12); // Playback rate for semitone pitch shift

        const offlineCtx = new OfflineAudioContext(
            audioBuffer.numberOfChannels,
            audioBuffer.length * (1 / rate), // Ajustar longitud para la duración del sonido pitched
            audioBuffer.sampleRate
        );

        const source = offlineCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.playbackRate.value = rate;
        source.connect(offlineCtx.destination);
        source.start(0);

        return offlineCtx.startRendering();
    }

    // Función para reproducir un sonido usando AudioBufferSourceNode y añadir feedback visual
    function playSound(soundKey) {
        const buffer = soundBuffers[soundKey];
        if (buffer) {
            // Asegurarse de que el AudioContext esté activo para reproducción de sonidos directos
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start(0);

            // Encontrar la etiqueta del instrumento y añadir/remover clase 'playing'
            const playableInst = playableInstruments.find(p => p.fullKey === soundKey);
            if (playableInst) {
                const labelElement = sequencerGrid.querySelector(`.instrument-label[data-full-key="${soundKey}"]`);
                if (labelElement) {
                    labelElement.classList.add('playing');
                    // Remover la clase después de la duración de la animación
                    setTimeout(() => {
                        labelElement.classList.remove('playing');
                    }, 150); // Ajustar este tiempo para que coincida con la duración de la animación CSS
                }
            }

        } else {
            console.warn(`El sonido '${soundKey}' no está cargado.`);
        }
    }

    // Estado del patrón (matriz 2D: row x step)
    const pattern = Array(totalPlayableRows).fill(null).map(() => Array(numSteps).fill(false));

    // Función para resaltar la fila seleccionada por teclado
    function highlightSelectedRow() {
        document.querySelectorAll('.instrument-label').forEach(label => label.classList.remove('selected-row'));
        const selectedLabel = sequencerGrid.querySelector(`.instrument-label[data-global-index="${selectedRowIndex}"]`);
        if (selectedLabel) {
            selectedLabel.classList.add('selected-row');
            // Asegurar que la fila seleccionada esté visible
            selectedLabel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // Función para crear la cuadrícula del secuenciador
    function createSequencerGrid() {
        sequencerGrid.innerHTML = ''; // Limpiar cualquier cuadrícula existente

        playableInstruments.forEach((inst, globalIndex) => {
            // Etiqueta del instrumento que también será una zona de drop (solo para las 'base')
            const label = document.createElement('div');
            label.classList.add('instrument-label', `${inst.variationType}-label`); // Añadir clase para estilos de variación
            label.textContent = inst.name; // Mostrar el nombre actual (predeterminado, subido o generado)
            label.dataset.fullKey = inst.fullKey; // Clave única para identificar el sonido
            label.dataset.globalIndex = globalIndex; // Índice global para el patrón

            // Solo las etiquetas 'base' son drag-and-drop targets para cargar nuevos sonidos
            if (inst.variationType === 'base') {
                label.classList.add('base-sound-drop-target'); // Clase para identificar targets de drop
                label.dataset.groupKey = inst.groupKey; // Clave del grupo para el drop
                label.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    label.classList.add('drag-over');
                });
                label.addEventListener('dragleave', () => {
                    label.classList.remove('drag-over');
                });
                label.addEventListener('drop', handleSoundDrop);
            }
            
            sequencerGrid.appendChild(label);

            // Botones de paso para cada instrumento/variación
            for (let stepIndex = 0; stepIndex < numSteps; stepIndex++) {
                const stepButton = document.createElement('div');
                stepButton.classList.add('step-button');
                stepButton.dataset.globalIndex = globalIndex;
                stepButton.dataset.step = stepIndex;
                // Restaurar estado si ya estaba activo
                if (pattern[globalIndex][stepIndex]) {
                    stepButton.classList.add('active');
                }
                stepButton.addEventListener('click', () => toggleStep(globalIndex, stepIndex, stepButton));
                sequencerGrid.appendChild(stepButton);
            }
        });
        highlightSelectedRow(); // Resaltar la fila inicial
    }

    // Función para actualizar la interfaz del secuenciador (después de cargar/aleatorizar)
    function updateSequencerUI() {
        playableInstruments.forEach((inst, globalIndex) => {
            const labelElement = sequencerGrid.querySelector(`.instrument-label[data-full-key="${inst.fullKey}"]`);
            if (labelElement) {
                labelElement.textContent = inst.name;
            }
            for (let stepIndex = 0; stepIndex < numSteps; stepIndex++) {
                const stepButton = sequencerGrid.querySelector(`[data-global-index="${globalIndex}"][data-step="${stepIndex}"]`);
                if (stepButton) {
                    stepButton.classList.toggle('active', pattern[globalIndex][stepIndex]);
                }
            }
        });
        highlightSelectedRow(); // Asegurar que la fila seleccionada siga resaltada
    }

    // Función para alternar el estado de un paso
    function toggleStep(globalIndex, stepIndex, buttonElement) {
        pattern[globalIndex][stepIndex] = !pattern[globalIndex][stepIndex];
        buttonElement.classList.toggle('active', pattern[globalIndex][stepIndex]);
    }

    // Función para actualizar BPM
    function updateBPM(newBPM) {
        // Clamp BPM between min and max range
        newBPM = Math.max(parseInt(bpmSlider.min), Math.min(parseInt(bpmSlider.max), newBPM));
        bpmSlider.value = newBPM;
        bpm = newBPM;
        bpmDisplay.textContent = bpm;
        if (isPlaying) {
            stopSequencer();
            startSequencer();
        }
    }

    // Event listeners para controles
    bpmSlider.addEventListener('input', (event) => updateBPM(parseInt(event.target.value)));

    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            stopSequencer();
        } else {
            startSequencer();
        }
    });

    clearBtn.addEventListener('click', () => {
        // Borrar todos los patrones y actualizar la interfaz
        for (let i = 0; i < totalPlayableRows; i++) {
            for (let j = 0; j < numSteps; j++) {
                pattern[i][j] = false;
            }
        }
        updateSequencerUI(); // Actualizar la UI para reflejar el borrado
        console.log("¡Patrones borrados!");
        extrasStatus.textContent = 'Patrón borrado. ¡Un lienzo en blanco para tu creatividad! 🎨';
        setTimeout(() => extrasStatus.textContent = '', 3000);
    });

    // Lógica para el secuenciador
    function startSequencer() {
        isPlaying = true;
        playPauseBtn.textContent = '⏸️ Pausar';
        audioContext.resume(); // Asegurarse de que el AudioContext esté activo
        intervalId = setInterval(() => {
            // Eliminar resaltado del paso anterior
            document.querySelectorAll('.step-button.current-step').forEach(btn => btn.classList.remove('current-step'));

            // Lógica para reproducir sonidos en el paso actual
            playableInstruments.forEach((inst, globalIndex) => {
                if (pattern[globalIndex][currentStep]) {
                    playSound(inst.fullKey);
                }
                // Resaltar el paso actual en la interfaz
                const currentStepButton = sequencerGrid.querySelector(`[data-global-index="${globalIndex}"][data-step="${currentStep}"]`);
                if (currentStepButton) {
                    currentStepButton.classList.add('current-step');
                }
            });

            currentStep = (currentStep + 1) % numSteps;

        }, (60 / bpm) * 1000 / 4); // El '4' aquí asume que cada paso es un 16avo. (para 4 pasos, cada paso es un 4to)
    }

    function stopSequencer() {
        isPlaying = false;
        playPauseBtn.textContent = '▶️ Play';
        clearInterval(intervalId);
        currentStep = 0;
        document.querySelectorAll('.step-button.current-step').forEach(btn => btn.classList.remove('current-step'));
    }

    // Manejo de la subida de archivos de sonido mediante drag-and-drop
    async function handleSoundDrop(event) {
        event.preventDefault();
        event.target.classList.remove('drag-over');

        const groupKey = event.target.dataset.groupKey; // e.g., 'kick'
        const baseLabelElement = event.target; // La etiqueta 'base' donde se soltó el archivo

        if (!groupKey) {
            console.error('No se encontró la clave del grupo de instrumento en el objetivo de drop.');
            return;
        }

        const files = event.dataTransfer.files;
        if (files.length === 0) {
            console.warn('Ningún archivo fue soltado.');
            return;
        }

        const file = files[0]; // Procesar solo el primer archivo si se sueltan varios
        if (!file.type.startsWith('audio/')) {
            baseLabelElement.textContent = `Solo audio 🚫`; // Mensaje temporal
            setTimeout(() => {
                const playableInst = playableInstruments.find(p => p.groupKey === groupKey && p.variationType === 'base');
                baseLabelElement.textContent = playableInst.name; // Volver al nombre actual
            }, 2000);
            console.warn('El archivo soltado no es de audio.');
            return;
        }

        baseLabelElement.textContent = `Cargando '${file.name.slice(0, 10)}...' ⏳`; // Mostrar snippet del nombre

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const baseBuffer = await audioContext.decodeAudioData(e.target.result);
                
                const instGroup = instrumentGroups.find(g => g.key === groupKey);

                // Generar y almacenar todas las variaciones (base, up, down)
                for (const variation of instGroup.variations) {
                    const fullKey = `${groupKey}_${variation.type}`;
                    soundBuffers[fullKey] = await pitchShiftBuffer(baseBuffer, variation.pitchSemitones);

                    // Actualizar nombre en la estructura de datos
                    const playableInst = playableInstruments.find(p => p.fullKey === fullKey);
                    if (playableInst) {
                        playableInst.name = `${file.name.split('.').slice(0, -1).join('.')} (${variation.label})`; // Usa solo el nombre del archivo sin extensión
                        // Actualizar la etiqueta correspondiente en la UI
                        const labelElement = sequencerGrid.querySelector(`[data-full-key="${fullKey}"]`);
                        if (labelElement) {
                            labelElement.textContent = playableInst.name;
                        }
                    }
                }
                console.log(`Sonido custom '${file.name}' y sus variaciones cargados para '${groupKey}'.`);
                // Actualizar el estado visual final solo para la etiqueta base
                baseLabelElement.textContent = `${file.name.split('.').slice(0, -1).join('.')} (Base) ✅`;
            } catch (error) {
                baseLabelElement.textContent = `Error: ${file.name.slice(0, 10)}... ❌`;
                console.error('Error al decodificar el audio:', error);
                setTimeout(() => {
                    const playableInst = playableInstruments.find(p => p.groupKey === groupKey && p.variationType === 'base');
                    baseLabelElement.textContent = playableInst.name; // Volver al nombre actual
                }, 3000);
            }
        };
        reader.onerror = () => {
            baseLabelElement.textContent = `Error lectura: ${file.name.slice(0, 10)}... ❌`;
            console.error('Error al leer el archivo con FileReader.');
            setTimeout(() => {
                const playableInst = playableInstruments.find(p => p.groupKey === groupKey && p.variationType === 'base');
                baseLabelElement.textContent = playableInst.name; // Volver al nombre actual
            }, 3000);
        };
        reader.readAsArrayBuffer(file);
    }

    // Función para generar un sonido Poko Synth (directamente en un AudioBuffer) y sus variaciones
    async function generatePokoSynthSound(groupKey) {
        generationStatus.textContent = 'Generando sonido Poko Synth... 🧪';
        const freq = 200 + Math.random() * 800; // Frecuencia aleatoria entre 200-1000 Hz
        const duration = 0.3 + Math.random() * 0.2; // Duración aleatoria entre 0.3-0.5s
        const waveTypes = ['sine', 'square', 'sawtooth', 'triangle'];
        const type = waveTypes[Math.floor(Math.random() * waveTypes.length)]; // Tipo de onda aleatorio

        const sampleRate = audioContext.sampleRate;
        const numSamples = Math.floor(sampleRate * duration);
        const baseAudioBuffer = audioContext.createBuffer(1, numSamples, sampleRate);
        const data = baseAudioBuffer.getChannelData(0);

        let phase = 0;
        for (let i = 0; i < numSamples; i++) {
            // Simple ADSR-like envelope (Attack-Decay-Release)
            let amplitude = 0;
            const attackTime = 0.01 * sampleRate;
            const decayTime = 0.05 * sampleRate;
            const releaseTime = 0.2 * sampleRate; // Un poco de release al final

            if (i < attackTime) {
                amplitude = i / attackTime; // Attack
            } else if (i < attackTime + decayTime) {
                amplitude = 1 - ((i - attackTime) / decayTime) * 0.5; // Decay to 0.5 sustain
            } else if (i < numSamples - releaseTime) {
                amplitude = 0.5; // Sustain
            } else {
                amplitude = 0.5 * (1 - (i - (numSamples - releaseTime)) / releaseTime); // Release
            }

            // Apply wave type
            switch (type) {
                case 'sine':
                    data[i] = amplitude * Math.sin(phase);
                    break;
                case 'square':
                    data[i] = amplitude * (Math.sin(phase) > 0 ? 1 : -1);
                    break;
                case 'sawtooth':
                    data[i] = amplitude * (2 * (phase / (2 * Math.PI) % 1) - 1);
                    break;
                case 'triangle':
                    data[i] = amplitude * (2 * Math.abs(phase / (2 * Math.PI) % 1) - 1);
                    break;
                default:
                    data[i] = amplitude * Math.sin(phase);
            }
            phase += 2 * Math.PI * freq / sampleRate;
        }

        // Asignar y pitch-shift las variaciones del synth
        const instGroup = instrumentGroups.find(g => g.key === groupKey);
        if (instGroup) {
            for (const variation of instGroup.variations) {
                const fullKey = `${groupKey}_${variation.type}`;
                soundBuffers[fullKey] = await pitchShiftBuffer(baseAudioBuffer, variation.pitchSemitones);

                // Actualizar nombre en la estructura de datos
                const playableInst = playableInstruments.find(p => p.fullKey === fullKey);
                if (playableInst) {
                    playableInst.name = `Synth Poko (${type.charAt(0).toUpperCase() + type.slice(1)}) (${variation.label})`;
                    // Actualizar la etiqueta correspondiente en la UI
                    const labelElement = sequencerGrid.querySelector(`[data-full-key="${fullKey}"]`);
                    if (labelElement) {
                        labelElement.textContent = playableInst.name;
                    }
                }
            }
        }

        generationStatus.textContent = `¡Sonido ${type} generado para Clap y sus variaciones! ✨`;
        console.log(`Sonido synth '${type}' generado para '${groupKey}' y sus variaciones.`);
    }

    // Event listener para el botón de generar sonido synth
    generateSynthBtn.addEventListener('click', () => {
        generatePokoSynthSound('clap'); // Asignar el sonido generado al grupo de instrumento 'clap'
    });

    // ----- Control por teclado ----- 
    document.addEventListener('keydown', (event) => {
        // Evitar el comportamiento por defecto de algunas teclas (scroll, etc.)
        if (['Space', 'ArrowUp', 'ArrowDown', 'Tab', '1', '2', '3', '4', 'q', 'w', 'e', 'r', 'a', 's', 'd', 'f', 'z', 'x', 'c', 'v'].includes(event.key.toLowerCase())) {
            event.preventDefault();
        }

        const lowerKey = event.key.toLowerCase();

        switch (lowerKey) {
            case ' ':
                playPauseBtn.click();
                break;
            case 'c':
                // 'c' es usado para borrar, pero también para reproducir Clap +1. Priorizamos borrar si no se está tocando.
                // Si el secuenciador está en reproducción o 'c' no está mapeado a un sonido, borra.
                if (isPlaying || !keyToInstrumentIndex.hasOwnProperty(lowerKey)) {
                    clearBtn.click();
                } else { // Si no está tocando, y 'c' es para un sonido, lo reproduce.
                     const instrumentIndexToPlay = keyToInstrumentIndex[lowerKey];
                    const soundKeyToPlay = playableInstruments[instrumentIndexToPlay].fullKey;
                    playSound(soundKeyToPlay);
                    console.log(`Reproduciendo sonido con tecla '${lowerKey}': ${soundKeyToPlay}`);
                }
                break;
            case 'arrowup':
                updateBPM(bpm + 5);
                break;
            case 'arrowdown':
                updateBPM(bpm - 5);
                break;
            case 'tab':
                // Mover la selección a la siguiente fila
                selectedRowIndex = (selectedRowIndex + 1) % totalPlayableRows;
                highlightSelectedRow();
                break;
            case '1':
            case '2':
            case '3':
            case '4':
                const stepIndex = parseInt(lowerKey) - 1; // '1' -> 0, '2' -> 1, etc.
                if (stepIndex >= 0 && stepIndex < numSteps) {
                    const targetButton = sequencerGrid.querySelector(`[data-global-index="${selectedRowIndex}"][data-step="${stepIndex}"]`);
                    if (targetButton) {
                        toggleStep(selectedRowIndex, stepIndex, targetButton);
                    }
                }
                break;
            default:
                // Reproducir sonidos directamente si el secuenciador no está en reproducción
                if (!isPlaying && keyToInstrumentIndex.hasOwnProperty(lowerKey)) {
                    const instrumentIndexToPlay = keyToInstrumentIndex[lowerKey];
                    const soundKeyToPlay = playableInstruments[instrumentIndexToPlay].fullKey;
                    playSound(soundKeyToPlay);
                    console.log(`Reproduciendo sonido con tecla '${lowerKey}': ${soundKeyToPlay}`);
                }
                break;
        }
    });
    // ----- Fin Control por teclado ----- 

    // ----- Funciones de Extras ----- 
    function savePattern() {
        try {
            localStorage.setItem('pokoSequencerPattern', JSON.stringify(pattern));
            localStorage.setItem('pokoSequencerBPM', bpm);
            localStorage.setItem('pokoSequencerInstrumentNames', JSON.stringify(playableInstruments.map(inst => inst.name)));
            extrasStatus.textContent = '¡Patrón y BPM guardados! 🎉';
            console.log('Patrón y BPM guardados en localStorage.');
        } catch (e) {
            extrasStatus.textContent = 'Error al guardar. ¿Espacio lleno? 💾❌';
            console.error('Error saving pattern:', e);
        }
        setTimeout(() => extrasStatus.textContent = '', 3000);
    }

    function loadPattern() {
        try {
            const savedPattern = localStorage.getItem('pokoSequencerPattern');
            const savedBPM = localStorage.getItem('pokoSequencerBPM');
            const savedInstrumentNames = localStorage.getItem('pokoSequencerInstrumentNames');

            if (savedPattern && savedBPM && savedInstrumentNames) {
                const loadedPattern = JSON.parse(savedPattern);
                const loadedBPM = parseInt(savedBPM);
                const loadedNames = JSON.parse(savedInstrumentNames);

                // Asegurarse de que el patrón cargado tiene el tamaño correcto
                if (loadedPattern.length === totalPlayableRows && loadedPattern[0].length === numSteps) {
                    // Actualizar el patrón actual
                    for (let i = 0; i < totalPlayableRows; i++) {
                        for (let j = 0; j < numSteps; j++) {
                            pattern[i][j] = loadedPattern[i][j];
                        }
                    }
                    // Actualizar BPM
                    updateBPM(loadedBPM);

                    // Actualizar los nombres de los instrumentos en la UI
                    loadedNames.forEach((name, index) => {
                        if (playableInstruments[index]) {
                            playableInstruments[index].name = name;
                        }
                    });
                    
                    updateSequencerUI(); // Redibujar la interfaz con el patrón y nombres cargados
                    extrasStatus.textContent = '¡Patrón y BPM cargados! 🚀';
                    console.log('Patrón y BPM cargados desde localStorage.');
                } else {
                    extrasStatus.textContent = 'Patrón guardado no compatible. 🤔';
                    console.warn('Loaded pattern size mismatch.');
                }
            } else {
                extrasStatus.textContent = 'No hay patrón guardado para cargar. 🤷‍♀️';
                console.log('No saved pattern found.');
            }
        } catch (e) {
            extrasStatus.textContent = 'Error al cargar el patrón. 💾❌';
            console.error('Error loading pattern:', e);
        }
        setTimeout(() => extrasStatus.textContent = '', 3000);
    }

    function randomizePattern() {
        for (let i = 0; i < totalPlayableRows; i++) {
            for (let j = 0; j < numSteps; j++) {
                pattern[i][j] = Math.random() < 0.3; // Aproximadamente 30% de probabilidad de activar un paso
            }
        }
        updateSequencerUI(); // Actualizar la UI para reflejar el patrón aleatorio
        extrasStatus.textContent = '¡Ritmo aleatorio generado! 🎲✨';
        console.log('Patrón aleatorio generado.');
        setTimeout(() => extrasStatus.textContent = '', 3000);
    }

    // Event listeners para los botones de Extras
    savePatternBtn.addEventListener('click', savePattern);
    loadPatternBtn.addEventListener('click', loadPattern);
    randomizePatternBtn.addEventListener('click', randomizePattern);
    // ----- Fin Funciones de Extras ----- 

    // Inicializar cargando los sonidos predeterminados y luego la cuadrícula
    // Cargar la base de cada instrumento y luego generar sus variaciones pitched
    Promise.all(instrumentGroups.map(async (group) => {
        const baseKey = `${group.key}_base`;
        await loadSoundBuffer(baseKey, group.defaultUrl);
        // Generar variaciones para cada sonido predeterminado
        for (const variation of group.variations) {
            if (variation.type !== 'base') { // Ya cargamos la base
                const fullKey = `${group.key}_${variation.type}`;
                soundBuffers[fullKey] = await pitchShiftBuffer(soundBuffers[baseKey], variation.pitchSemitones);
            }
        }
    }))
    .then(() => {
        createSequencerGrid();
        console.log("Cuadrícula del secuenciador lista después de cargar sonidos y variaciones.");
        loadPattern(); // Intentar cargar un patrón si existe al inicio
    })
    .catch(error => console.error("Error al inicializar sonidos y cuadrícula:", error));

});