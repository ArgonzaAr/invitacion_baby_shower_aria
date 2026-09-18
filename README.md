# Invitación de baby shower — Aria Natasha

Invitación web con confirmación de asistencia (RSVP) y panel de administración.

- **Frontend** (`invitación_baby_shower_nat/`): Vue 3 + Vite. Muestra la invitación, el formulario y la ruta `/admin`.
- **Backend** (`backend/`): Next.js usado solo como API (`app/api/`), sin páginas. Guarda en Supabase (solo como Postgres) y avisa por Telegram.

## Requisitos

- Node.js 22.18 o superior (o 24.12+), con npm.
- Un proyecto de [Supabase](https://supabase.com) (el plan gratuito basta).
- Opcional: un bot de Telegram para recibir avisos.

## 1. Crear la tabla en Supabase

En el panel de Supabase abre **SQL Editor**, pega el contenido de [`backend/supabase/schema.sql`](backend/supabase/schema.sql) y ejecútalo. Crea la tabla `rsvps`.

## 2. Variables de entorno

### Backend: `backend/.env.local`

Copia `backend/.env.example` a `backend/.env.local` y completa:

| Variable | Descripción |
| --- | --- |
| `SUPABASE_URL` | URL del proyecto (Settings → API). |
| `SUPABASE_SERVICE_KEY` | Clave `service_role` (Settings → API). **Secreta**: solo vive en el backend. |
| `ADMIN_PASSWORD` | Contraseña única para entrar a `/admin`. |
| `FRONTEND_ORIGIN` | Origen permitido por CORS. En local: `http://localhost:5173`. |
| `TELEGRAM_BOT_TOKEN` | Opcional. Token del bot de Telegram. |
| `TELEGRAM_CHAT_ID` | Opcional. Chat que recibe los avisos. |

Si faltan las dos variables de Telegram, simplemente no se envía el aviso.

### Frontend: `invitación_baby_shower_nat/.env`

Copia `invitación_baby_shower_nat/.env.example` a `.env`:

| Variable | Descripción |
| --- | --- |
| `VITE_API_URL` | URL del backend. En local: `http://localhost:3000`. |

## Configurar Supabase

Pasos para dejar el backend conectado a un proyecto de Supabase real:

1. **Crear la tabla.** En Supabase abre **SQL Editor**, pega el contenido completo de [`backend/supabase/schema.sql`](backend/supabase/schema.sql) y ejecútalo. Además de crear `rsvps`, activa RLS sin políticas: la anon key no puede leer ni escribir, solo la clave de servicio. En **Table Editor** debe aparecer `rsvps` con RLS activado.
2. **Completar `backend/.env.local`.** Deben estar definidas `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (la clave `service_role`, no la anon), `ADMIN_PASSWORD` (la eliges tú) y `FRONTEND_ORIGIN=http://localhost:5173`. No compartas estos valores ni los subas a git: `.env.local` está ignorado.
3. **Verificar la conexión:**

   ```bash
   cd backend
   npm run check:supabase
   ```

   Si todo está bien imprime `OK: conexión correcta y tabla rsvps disponible (N filas).` Si falla, muestra el error de Supabase (por ejemplo, tabla inexistente o clave anon en lugar de `service_role`). El script nunca imprime credenciales.

### Prueba end-to-end en local

1. Levanta backend y frontend (sección 4).
2. En <http://localhost:5173> envía el formulario. Debe aparecer "¡Gracias, te esperamos!" y una fila nueva en Supabase (Table Editor).
3. En <http://localhost:5173/admin> entra con `ADMIN_PASSWORD`: la confirmación aparece en la lista, el total de asistentes suma `1 + acompañantes` por fila y "Exportar CSV" descarga un archivo con `name,guests,message,created_at`.
4. Borra las filas de prueba (por ejemplo, con nombres que empiecen por `[PRUEBA]`) antes de compartir la invitación.

## 3. Imágenes (opcional)

Coloca las imágenes en `invitación_baby_shower_nat/public/img/`:

- `foto.jpg`
- `ultrasonido.jpg`

Si no existen, se muestra un recuadro punteado de respaldo.

## 4. Arranque

En dos terminales:

```bash
# Backend (http://localhost:3000)
cd backend
npm install
npm run dev
```

```bash
# Frontend (http://localhost:5173)
cd invitación_baby_shower_nat
npm install
npm run dev
```

- Invitación: <http://localhost:5173>
- Panel de administración: <http://localhost:5173/admin> (pide `ADMIN_PASSWORD`)

## API

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| `POST` | `/api/rsvp` | Público | Registra una confirmación `{ name, guests, message, website }`. |
| `GET` | `/api/rsvps` | `Authorization: Bearer <ADMIN_PASSWORD>` | Lista, `totalRows` y `totalAttendees`. |
| `GET` | `/api/rsvps/export` | Igual | CSV con `name,guests,message,created_at`. |

`website` es un campo trampa (honeypot): si trae texto, la API responde `201` sin guardar nada.

## Build del frontend

```bash
cd invitación_baby_shower_nat
npm run build
```

El despliegue no está cubierto todavía; las variables de entorno de arriba son las que hay que configurar en el hosting.
