# Estudio 4: Arquitectura de Ecosistemas

Este proyecto es una plantilla web moderna y responsive, diseñada con un enfoque en la arquitectura modular y la experiencia de usuario. Implementa un sistema de **Modo Oscuro dinámico** y utiliza **Bootstrap 5** para la estructura principal y la gestión de la responsividad, manteniendo al mismo tiempo un diseño personalizado y limpio.

---

## Tecnologías Utilizadas

* **HTML5:** Estructura semántica del contenido.
* **CSS3 (Puro):** Estilos modulares para componentes y modo oscuro.
* **Bootstrap 5:** Framework para la cuadrícula (Grid), la responsividad y elementos base del layout.
* **JavaScript (Vainilla):** Para la lógica del interruptor del modo oscuro y la persistencia del estado.

---

## Estructura del Proyecto

Estructura del proyecto:
````
├── assets/                       
├── styles/                       
│   ├── principal.css             
│   ├── base.css               
│   ├── layout.css               
│   └── componentes.css           
├── index.html           
├── script.js                    
└── README.md                    
````
---

## Puntos Clave del Desarrollo

### 1. Modularización CSS y Bootstrap

El CSS se ha dividido en módulos (principal, base, layout, componentes) para facilitar la gestión y escalabilidad del proyecto.

* **`principal.css`**: Utiliza `@import` para ensamblar todos los módulos en un solo archivo, que es el único enlazado al HTML.
* **Integración con Bootstrap**: Aprovecha el sistema de cuadrícula de Bootstrap (`.row`, `.col-auto`, `row-cols-*`) para manejar el layout de la página y la responsividad del Footer (pasando de 4 columnas a 1 en móvil), eliminando la necesidad de escribir media queries complejas en CSS.
* **Separación de Preocupaciones**: Los estilos de **Layout** (posición de la sección Hero) y los **Componentes** (estilo del texto, el Switch) están estrictamente separados para evitar conflictos y facilitar el mantenimiento.

### 2. Implementación del Modo Oscuro Avanzado

El proyecto implementa un sistema de modo oscuro completo con persistencia de estado y cambio de recursos.

#### a) Lógica del Interruptor (JavaScript)

El archivo `script.js` es responsable de:

* **Detección de Click:** Escucha el evento `change` en el interruptor (`#darkModeToggle`).
* **Cambio de Clase:** Añade o remueve la clase **`.dark-mode`** en el elemento `<body>` para activar los estilos oscuros.
* **Persistencia (Local Storage):** Guarda la preferencia del usuario (`'dark-mode'` o `'light-mode'`) en el **Local Storage** del navegador. Al recargar la página, `script.js` comprueba esta preferencia y aplica el tema guardado, manteniendo el estado.

#### b) Estilos Dinámicos (CSS)

Todos los estilos del modo oscuro residen en **`styles/componentes.css`** y están anidados bajo el selector **`body.dark-mode`**.

* **Cambio de Esquema:** Propiedades globales como `background-color` y `color` cambian en el `body` y el `footer` (ej: de `white` a `#1a1a1a`).
* **Intercambio de Imágenes (Image Swap):**
    * La imagen de fondo del Hero cambia utilizando un `url()` diferente dentro del selector `body.dark-mode .hero-section`.
    * El logo del Footer se maneja como una **imagen de fondo CSS** (`.logo-img`) y también se intercambia entre `estudio4_negro.png` y `estudio4_blanco.png` al activar el modo oscuro.

### 3. Header y Responsive

El `Header` utiliza **Flexbox** (gestionado por clases de Bootstrap como `justify-content-between`) para colocar el nombre del sitio a la izquierda y el menú de navegación a la derecha.

* **Media Query Simplificada**: Las media queries en `componentes.css` se reservan solo para ajustes finos que Bootstrap no resuelve (como el tamaño y la posición exacta del texto del Hero en dispositivos móviles), delegando la complejidad del layout al framework.



