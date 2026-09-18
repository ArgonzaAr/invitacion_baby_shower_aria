# SPEC 02 — Puesta en marcha de Supabase y verificación end-to-end

> **Status:** Aprobado
> **Depends on:** SPEC 01
> **Date:** 2026-09-18
> **Objective:** Crear la tabla `rsvps` en el proyecto real de Supabase con RLS activado, conectar el backend con las credenciales de `backend/.env.local` y comprobar de punta a punta, en local, que una confirmación viaja del formulario a la base y aparece en `/admin`.

## Por qué existe este spec

El SPEC 01 dejó el código listo (`lib/supabase.js`, `POST /api/rsvp`, `GET /api/rsvps`, `/admin`), pero nunca se ha probado contra un Supabase real. `backend/.env.local` solo tiene `SUPABASE_URL` y `SUPABASE_SERVICE_KEY`, y la tabla no existe en el proyecto. Este spec cubre esa brecha sin rediseñar nada.

## Alcance

**Dentro:**

- Actualizar `backend/supabase/schema.sql` para activar RLS en `rsvps` sin políticas.
- Ejecutar ese SQL en el SQL Editor de Supabase (paso manual del usuario, porque la clave de servicio no puede ejecutar DDL por la API REST).
- Completar `backend/.env.local` con `ADMIN_PASSWORD` (la define el usuario) y `FRONTEND_ORIGIN=http://localhost:5173`.
- Script `backend/scripts/check-supabase.js` que verifica la conexión y la existencia de la tabla con la clave de servicio, sin imprimir credenciales.
- Corregir lo que falle al probar contra el Supabase real (ajustes mínimos en el código de SPEC 01).
- Prueba end-to-end local documentada en el `README.md` raíz.

**Fuera de alcance:**

- Despliegue (Vercel u otro) y variables de entorno de producción.
- Configuración precisa de Telegram.
- Migraciones con Supabase CLI o conexión directa a Postgres (`SUPABASE_DB_URL`).
- Limitación de tasa por IP, duplicados, cuentas de usuario.
- Cambios de diseño o de contrato de la API.
- Pruebas automatizadas.

## Modelo de datos

La tabla `rsvps` no cambia de estructura respecto al SPEC 01. Solo se agrega al final de `backend/supabase/schema.sql`:

```sql
alter table rsvps enable row level security;
-- Sin políticas: la anon key no puede leer ni escribir; solo la service key (que omite RLS).
```

## Plan de implementación

1. Agregar el `alter table ... enable row level security` a `backend/supabase/schema.sql`. Comprobación: el archivo contiene la sentencia y sigue siendo válido SQL.
2. **Paso manual del usuario:** pegar y ejecutar `schema.sql` completo en el SQL Editor de Supabase. Comprobación: en Table Editor aparece `rsvps` con RLS activado y sin políticas.
3. **Paso manual del usuario:** agregar `ADMIN_PASSWORD=<clave elegida>` y `FRONTEND_ORIGIN=http://localhost:5173` a `backend/.env.local`. Comprobación: el archivo tiene las cuatro variables (Claude solo verifica que existen, sin mostrar valores).
4. Crear `backend/scripts/check-supabase.js` y el script `npm run check:supabase` en `backend/package.json`. Hace un `select` con `head: true` sobre `rsvps` y devuelve "OK" o el error de Supabase. Comprobación: con la tabla creada imprime OK; sin ella, un error claro.
5. Levantar `npm run dev` en `backend/` y validar con `curl`: `POST /api/rsvp` válido → `201`; nombre vacío → `400`; honeypot → `201` sin fila; `GET /api/rsvps` sin header → `401`; con `Bearer <ADMIN_PASSWORD>` → `200` con la fila creada. Corregir lo que falle.
6. Levantar `npm run dev` en `invitación_baby_shower_nat/` y hacer la prueba end-to-end: enviar el formulario, verificar la fila en Supabase, entrar a `/admin`, comprobar el total de asistentes y descargar el CSV. Corregir lo que falle.
7. Agregar al `README.md` raíz la sección "Configurar Supabase" con los pasos 2, 3 y 4 y el comando de verificación. Comprobación: seguir esa sección desde cero deja el backend conectado.
8. Confirmar que `git status` no muestra `.env.local` y que `SUPABASE_SERVICE_KEY` no aparece en el bundle de `npm run build` del frontend.

## Criterios de aceptación

- [ ] `backend/supabase/schema.sql` incluye `enable row level security` sobre `rsvps`.
- [ ] La tabla `rsvps` existe en el proyecto de Supabase, con RLS activado y sin políticas.
- [ ] `backend/.env.local` define `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `ADMIN_PASSWORD` y `FRONTEND_ORIGIN`.
- [ ] `npm run check:supabase` en `backend/` imprime OK y no muestra ninguna credencial.
- [ ] Un `POST /api/rsvp` válido responde `201` y crea exactamente una fila visible en Supabase.
- [ ] Un `POST /api/rsvp` con nombre vacío responde `400` y no crea fila.
- [ ] Un `POST /api/rsvp` con `website` con texto responde `201` y no crea fila.
- [ ] `GET /api/rsvps` sin header o con clave errónea responde `401`.
- [ ] `GET /api/rsvps` con la clave correcta responde `200` y `totalAttendees` es la suma de `1 + guests` de las filas.
- [ ] Una petición con la anon key directa a la API REST de Supabase sobre `rsvps` no devuelve filas (RLS efectivo).
- [ ] Enviar el formulario real en `http://localhost:5173` crea una fila y muestra "¡Gracias, te esperamos!".
- [ ] `/admin` con la clave correcta lista esa confirmación y "Exportar CSV" descarga un archivo con encabezados `name,guests,message,created_at`.
- [ ] `git status` no lista `backend/.env.local` y `SUPABASE_SERVICE_KEY` no aparece en el resultado de `npm run build` del frontend.
- [ ] Las filas de prueba creadas durante la verificación quedan eliminadas o identificadas antes de dar el spec por terminado.

## Decisiones

- **Sí:** El usuario ejecuta `schema.sql` en el SQL Editor. Es lo más simple; la service key no puede hacer DDL y evita sumar credenciales de base de datos o instalar la CLI.
- **No:** `SUPABASE_DB_URL` con el paquete `pg`. Agrega una credencial más sensible sin necesidad para una sola tabla.
- **No:** Supabase CLI con migraciones. Exige instalación y login para una tabla única.
- **Sí:** RLS activado sin políticas. Aunque el navegador nunca toca la base, protege la tabla si la anon key se expone.
- **Sí:** El usuario define `ADMIN_PASSWORD`. Es su clave de acceso al panel y no debe quedar en la conversación ni generarse por terceros.
- **Sí:** `FRONTEND_ORIGIN=http://localhost:5173`, puerto por defecto de Vite, igual que `.env.example`.
- **Sí:** Verificación end-to-end completa (formulario, base, `/admin`, CSV) y no solo `curl`, porque los fallos típicos (CORS, `VITE_API_URL`) solo aparecen con el frontend real.
- **Sí:** Este trabajo es un spec nuevo y no una reapertura del SPEC 01, que queda como "Implementado".

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| `SUPABASE_SERVICE_KEY` filtrada en pantalla, logs o git | El script de verificación no imprime valores; `.env.local` ya está ignorado; se revisa `git status` y el bundle (paso 8). |
| La clave en `.env.local` no es la `service_role` (por ejemplo, es la anon key) | Con la anon key y RLS activo, el `select` del script falla o devuelve vacío; el criterio de RLS lo detecta y el script debe avisar. |
| Tabla creada sin RLS por ejecutar una versión vieja del SQL | El paso 2 usa el archivo actualizado; el criterio de aceptación comprueba RLS. |
| Filas de prueba contaminan la lista real de invitados | Se borran o identifican antes de cerrar el spec (último criterio). |
| CORS o `VITE_API_URL` mal configurados al conectar el frontend | Se detectan en el paso 6 con el navegador real. |

## Qué **no** está en este spec

- Despliegue y variables de producción.
- Configuración de Telegram.
- Migraciones, CLI de Supabase o conexión directa a Postgres.
- Limitación de tasa, duplicados, cuentas de usuario.
- Pruebas automatizadas.

Cada uno, si se hace, va en su propio spec.
