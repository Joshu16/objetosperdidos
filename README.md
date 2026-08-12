# Objetos Perdidos

App React Native (Expo) para reportar objetos perdidos en el colegio, con API Express y MongoDB.

## Requisitos

- Node.js 20+
- MongoDB local o Atlas
- Expo Go (opcional)

## Configurar MongoDB

1. Copia `server/.env.example` a `server/.env`
2. Local:

```
MONGODB_URI=mongodb://127.0.0.1:27017/objetosperdidos
PORT=3001
```

3. Atlas:

```
MONGODB_URI=mongodb+srv://USER:PASS@CLUSTER/objetosperdidos
PORT=3001
```

## Arrancar API

```powershell
cd server
npm install
npm run dev
```

API: `http://localhost:3001`
Health: `http://localhost:3001/api/health`

## Arrancar app

```powershell
npm install
npm start
```

Si pruebas en un telefono fisico, cambia la IP en `src/api/config.ts` a la IP de tu PC.

## Pantallas

- Login (solo nombre)
- Home (feed, busqueda, filtro por categoria, marcar encontrado)
- Subir objeto (foto, categoria, subir)

## Categorias

Electronica, Ropa, Utiles escolares, Accesorios, Deportes, Otros
