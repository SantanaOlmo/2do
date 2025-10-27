teoría
useState

useEffect(() => {
  // efecto
}, [dependencias]);

[blender kit de pastillas](https://www.blenderkit.com/get-blenderkit/d1bfff0f-a4bb-4fa1-981e-9812a4c2380a/)

## 🎛️ Proyecto: Secuenciador Analógico en React

Este proyecto busca crear un **secuenciador musical interactivo** con estética analógica y flujo modular, inspirado en dispositivos como el **POKO**.  
El objetivo es ofrecer una experiencia **visual, táctil y juguetona**, donde cada parte del sistema pueda ampliarse fácilmente (instrumentos, efectos, secciones, etc.).

---

### 🧠 Concepto General

La aplicación está dividida en **dos niveles principales**:

1. **Vista General (Song Editor)**  
   Donde se crean, organizan y encadenan las secciones que formarán una canción completa.

2. **Vista de Sección (Section Editor)**  
   Donde se edita el contenido de cada sección: instrumentos, patrones y pasos del secuenciador.

Cada **instrumento** puede abrir su propio editor detallado, con control de **steps, notas, efectos** y vinculación de **teclas del teclado físico** a sonidos.

---

### 🎹 Control con Teclado

Para una experiencia analógica, el teclado físico se mapea así:

| Fila | Teclas | Función |
|------|---------|---------|
| 1 | 1, 2, 3, 4 | Disparar sonidos fila 1 |
| 2 | Q, W, E, R | Fila 2 |
| 3 | A, S, D, F | Fila 3 |
| 4 | Z, X, C, V | Fila 4 |
| ↑ / ↓ | Cambiar octava o tono |

Este sistema permite tocar y grabar ritmos o melodías directamente desde el teclado.

---

### 🧩 Arquitectura y Escalabilidad

El proyecto está estructurado para **crecer modularmente**, separando la lógica de audio, los estados globales, los componentes de interfaz y las pantallas principales.

Cada módulo cumple un propósito claro:
- `components/` → piezas reutilizables de la interfaz (botones, knobs, displays…)
- `pages/` → vistas principales de la app (editores y pantallas)
- `hooks/` → lógica reactiva y reutilizable (`useAudioEngine`, `useSequencer`, `useKeyboardInput`)
- `context/` → gestión de estado global (canción, audio engine)
- `utils/` → funciones auxiliares (notas, colores, cálculos)
- `assets/` → sonidos, texturas, modelos 3D, iconos
- `styles/` → estilos globales y específicos por componente

---

### 🚀 Objetivo

Construir una herramienta creativa con un flujo **divertido, modular y visualmente atractivo**, que combine:
- React + Web Audio API  
- Diseño analógico (inspirado en hardware real)  
- Control mediante teclado físico  
- Escalabilidad para añadir instrumentos, efectos y modos de edición

---

### 🗂️ Estructura Base de Carpetas

```plaintext
src/
├── assets/
│   ├── icons/
│   ├── textures/
│   ├── sounds/
│   └── models/
│
├── components/
│   ├── UI/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Knob.jsx
│   │   └── Display.jsx
│   ├── Sequencer/
│   │   ├── Step.jsx
│   │   ├── Bar.jsx
│   │   └── Sequencer.jsx
│   └── Layout/
│       ├── Header.jsx
│       └── Footer.jsx
│
├── pages/
│   ├── SongEditor.jsx
│   ├── SectionEditor.jsx
│   └── InstrumentEditor.jsx
│
├── hooks/
│   ├── useSequencer.js
│   ├── useAudioEngine.js
│   └── useKeyboardInput.js
│
├── context/
│   ├── SongContext.jsx
│   └── AudioContext.jsx
│
├── utils/
│   ├── noteUtils.js
│   ├── colorUtils.js
│   ├── loadSounds.js
│   └── mathUtils.js
│
├── styles/
│   ├── globals.css
│   └── components/
│       ├── sequencer.css
│       ├── input.css
│       └── button.css
│
├── App.jsx
├── main.jsx
└── router/
    └── index.jsx
