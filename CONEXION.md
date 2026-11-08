# Conexión Frontend ⇄ Backend

## Cómo correr los dos

**1. Backend** (carpeta `AquiPe-back`)

```bash
docker compose up -d                       # Postgres + tablas
python scripts/seed_demo.py                # usuarios y publicaciones de prueba
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

> `--host 0.0.0.0` es obligatorio: sin eso el celular no puede llegar al servidor.

**2. Frontend** (esta carpeta)

```bash
npm install
npx expo start
```

El celular y la PC deben estar en la **misma red Wi-Fi**. La app detecta la IP de tu PC
automáticamente. Si no funciona, copia `.env.example` a `.env` y pon la URL a mano.
Comprueba que el backend responde abriendo `http://TU_IP:8000/health` en el navegador del celular.

**Usuarios de prueba** (contraseña `demo1234`): `ana@aquipe.pe`, `carlos@aquipe.pe`,
`luis@aquipe.pe`, `andrea@aquipe.pe`, `miguel@aquipe.pe`, `maria@aquipe.pe`.

## Qué se agregó

| Archivo | Para qué |
|---|---|
| `src/lib/api.ts` | Cliente HTTP, tipos y todas las llamadas al backend (`Api.login`, `Api.publicaciones`, …) |
| `src/lib/session.ts` | Guarda el usuario con sesión iniciada y lo manda como `X-User-Id` |
| `src/lib/ui.ts` | Utilidades: precios, distancias, "Hace 10 min", GPS, manejo de errores |

## Qué pantalla usa qué endpoint

| Pantalla | Endpoints |
|---|---|
| Login / Registro | `POST /auth/login`, `POST /auth/registro`, `GET /zonas` |
| Inicio | `GET /publicaciones/mias`, `GET /publicaciones?tipo=SERVICIO&lat&lng` |
| Servicios | `GET /publicaciones?tipo=SERVICIO&direccion=OFRECE`, `GET /categorias`, `GET /usuarios/{id}` (teléfono), `POST /publicaciones/{id}/respuestas` |
| Favores | `GET /publicaciones?tipo=FAVOR`, `POST /publicaciones` |
| Publicar | `GET /categorias?tipo=FAVOR`, `POST /publicaciones` |
| Emergencias | `GET /publicaciones?tipo=EMERGENCIA`, `POST /publicaciones` |
| Mapa | `GET /publicaciones`, `POST /publicaciones/{id}/respuestas` |
| Coincidencias | `GET /publicaciones/mias` + `GET /publicaciones?direccion=OFRECE` (se cruzan en la app) |
| Perfil | `GET /publicaciones/mias`, `DELETE /publicaciones/{id}`, `PATCH /usuarios/me` |

## Lo que sigue siendo local (aún no hay endpoint en el backend)

- **Mis recursos** (Perfil): la tabla `recurso` existe pero faltan sus endpoints.
- **Descartar coincidencia**: se guarda solo mientras la app está abierta.
- **Sesión**: vive en memoria; al cerrar la app hay que iniciar sesión otra vez.
  (Se puede persistir con `expo-secure-store` cuando pasen a JWT.)
- **Notificaciones, "¿Olvidaste tu contraseña?" y soporte**: siguen como avisos.

## Problemas típicos

- *"No se pudo conectar con el servidor"* → backend apagado, sin `--host 0.0.0.0`,
  o celular y PC en redes distintas. Revisa también el firewall de Windows (puerto 8000).
- *Android emulador* → usa `http://10.0.2.2:8000` en `EXPO_PUBLIC_API_URL`.
- *Build de producción* → Android e iOS bloquean `http://` sin cifrar; usa HTTPS al desplegar.
- *"Falta el header X-User-Id"* → la sesión se perdió; vuelve a iniciar sesión.
