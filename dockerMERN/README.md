# MERN + Docker – Proyecto Inicial

## Estructura de carpetas
mern-app/
│
├── backend/
│ ├── server.js # Servidor Express mínimo
│ └── package.json # Dependencias backend
│
├── frontend/
│ ├── package.json # Dependencias frontend
│ └── src/
│ └── App.jsx # Componente React mínimo
│
└── docker-compose.yml # Configuración de contenedores

yaml
Copiar código

---

## Comandos iniciales por carpeta

### Backend
```bash
cd backend
npm init -y
npm install express mongoose
# Crear server.js con servidor mínimo
Frontend
bash
Copiar código
cd frontend
npm init -y
npm install react react-dom react-scripts
# Crear src/App.jsx con componente mínimo
Levantar todo con Docker
Desde la raíz del proyecto (mern-app/):

bash
Copiar código
docker-compose up --build
Frontend: http://localhost:3000

Backend: http://localhost:5000/api

MongoDB: puerto 27017 (datos persistentes con volumen)

css
Copiar código


Si quieres, puedo hacer una **versión aún más corta y tipo “cheat sheet”** para tu README, que sea fácil de seguir de un vistazo.
