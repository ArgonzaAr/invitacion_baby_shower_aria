# SPEC 01 — Invitación de baby shower con Vue y API en Next.js

> **Status:** Aprobado
> **Depends on:** Ninguna
> **Date:** 2026-09-18
> **Objective:** Construir la invitación web del baby shower de Aria Natasha con un frontend Vue 3 basado en `resources/` y un backend Next.js que guarda las confirmaciones de asistencia en Supabase (Postgres) y las muestra en un panel admin protegido por clave.

## Por qué existe este spec

Es el inicio del proyecto. Hoy solo existe un prototipo en `resources/Invitacion Aria A Editorial.dc.html`, escrito para un runtime propio (`support.js`, etiquetas `<x-dc>` y `<sc-if>`), cuyo formulario RSVP no guarda nada. Este spec lo convierte en una aplicación real, y fija la arquitectura y las decisiones base para los specs siguientes.

## Alcance

**Dentro:**

- Migrar el diseño de `resources/Invitacion Aria A Editorial.dc.html` a componentes Vue 3 (Vite) en el proyecto base `invitación_baby_shower_nat/`, con el mismo aspecto y textos.
- Usar solo el design system `modernist` (`resources/_ds/modernist-.../styles.css`) copiado al frontend.
- Sustituir los dos placeholders (foto y ultrasonido) por imágenes estáticas reales.
- Botón "Agregar al calendario" que descarga un archivo `.ics` real (10 de octubre de 2026, 3:00 pm).
- Backend en `backend/` con Next.js usado solo como API (route handlers), sin páginas.
- Endpoint público para registrar una confirmación (nombre, acompañantes, mensaje opcional).
- Persistencia en Supabase usado solo como Postgres, con acceso únicamente desde el servidor de Next.js.
- Ruta `/admin` en el frontend: listado de confirmaciones, total de asistentes y envío de notificacion por telegram cada que alguien confirma, protegida por una contraseña única.
- Configuración local: archivos `.env.example`, `README.md` raíz con comandos de arranque.

**Fuera de alcance (para specs futuros):**

- Despliegue (Vercel u otro). Solo se documentan las variables de entorno.
- Cuentas de usuario, login por invitado, edición o eliminación de una confirmación por el invitado.
- Bloqueo de duplicados por nombre.
- Campos de teléfono o correo en el formulario.
- Notificaciones por correo o WhatsApp al recibir una confirmación.
- Múltiples eventos o multi-idioma.
- Los design systems `industry` y `nocturne` de `resources/_ds`.
- Pruebas automatizadas end-to-end.

## Modelo de datos

Tabla en Supabase, definida en `backend/supabase/schema.sql`:

```sql
create table rsvps (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 120),
  guests      int  not null default 0 check (guests between 0 and 8),
  message     text check (char_length(message) <= 500),
  created_at  timestamptz not null default now()
);
```

Contrato de la API (JSON):

```js
// POST /api/rsvp  (público)
// request:  { name: "Ana López", guests: 2, message: "¡Felicidades!", website: "" }
// 201:      { ok: true }
// 400:      { ok: false, error: "name_required" | "guests_invalid" | "message_too_long" }

// GET /api/rsvps  (header: Authorization: Bearer <ADMIN_PASSWORD>)
// 200:      { items: [{ id, name, guests, message, created_at }], totalRows, totalAttendees }
// 401:      { ok: false, error: "unauthorized" }

// GET /api/rsvps/export  (mismo header) -> text/csv
```

Datos del evento, centralizados en `invitación_baby_shower_nat/src/content/event.js`:

```js
export const event = {
  babyName: "Aria Natasha",
  mother: "Alexandra Rangel Olvera",
  father: "Angel Rogelio Argonza Roblero",
  startsAt: "2026-10-10T15:00:00",   // hora local, sin zona
  rsvpDeadline: "3 de octubre",
  address: { street: "Calle Hidalgo \#159", area: "Col. San Pablo Tepetlapa", zip: "04620" },
  photo: "/img/foto.jpg",
  ultrasound: "/img/ultrasonido.jpg",
};
```

Convenciones:

- `guests` es el número de acompañantes. Cada fila cuenta como `1 + guests` asistentes en `totalAttendees`.
- El campo `website` es un honeypot: si llega con contenido, la API responde `201` sin guardar nada.
- Variables de entorno de `backend/.env.local`: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `ADMIN_PASSWORD`, `FRONTEND_ORIGIN`.
- Variable de `invitación_baby_shower_nat/.env`: `VITE_API_URL`.
- La clave de servicio de Supabase nunca se expone al frontend.

## Plan de implementación

1. Copiar `styles.css` de `modernist` a `invitación_baby_shower_nat/src/styles/modernist.css` e importarlo en `main.js`, junto con las fuentes Archivo y Baloo 2 en `index.html`. Prueba manual: `npm run dev` muestra una página vacía con el fondo de puntos rosas.
2. Crear `invitación_baby_shower_nat/src/content/event.js` y los componentes de presentación `HeroHeader.vue`, `WelcomeSection.vue`, `EventDetails.vue` y `SiteFooter.vue`, ensamblados en `views/InvitationView.vue`. Prueba manual: la página se ve igual que el prototipo, salvo el formulario.
3. Agregar `RsvpSection.vue` con el formulario (nombre, acompañantes 0–8, mensaje, honeypot oculto) y los estados "sin enviar", "enviando", "enviado" y "error". Por ahora el envío se simula sin llamar a la red. Prueba manual: enviar muestra "¡Gracias, te esperamos!" y "Enviar otra respuesta" reinicia el formulario.
4. Agregar los componentes de imagen para foto y ultrasonido, que leen `event.photo` y `event.ultrasound` desde `invitación_baby_shower_nat/public/img/` y muestran el placeholder punteado si la imagen falla (`@error`). Prueba manual: sin imágenes se ve el placeholder; con imágenes se ven las reales.
5. Implementar `invitación_baby_shower_nat/src/utils/calendar.js` (genera el texto `.ics` con `BEGIN:VEVENT`, `DTSTART` local, `SUMMARY`, `LOCATION`) y conectar el botón "Agregar al calendario" para descargar `baby-shower-aria.ics`. Prueba manual: el archivo abre en un cliente de calendario con la fecha y hora correctas.
6. Crear `backend/` con Next.js (solo `app/api/`), `.env.example`, cliente de Supabase en `backend/lib/supabase.js` y `backend/supabase/schema.sql`. Implementar `POST /api/rsvp` con validación y honeypot, y CORS limitado a `FRONTEND_ORIGIN`. Prueba manual: un `curl` válido devuelve `201` y la fila aparece en Supabase; uno inválido devuelve `400`.
7. Conectar el formulario del frontend a `POST /api/rsvp` mediante `invitación_baby_shower_nat/src/api/rsvp.js` usando `VITE_API_URL`. Prueba manual: enviar el formulario crea una fila real; con el backend apagado se muestra el estado de error con opción de reintentar.
8. Implementar en el backend `GET /api/rsvps` y `GET /api/rsvps/export` con la verificación `Authorization: Bearer <ADMIN_PASSWORD>` en `backend/lib/auth.js`. Prueba manual: sin header o con clave errónea devuelven `401`; con la clave correcta devuelven datos y un CSV descargable.
9. Agregar `views/AdminView.vue` en la ruta `/admin` con pantalla de clave, tabla de confirmaciones, total de asistentes y botón "Exportar CSV". La clave se guarda solo en `sessionStorage`. Prueba manual: entrar con la clave correcta lista lo enviado en el paso 7.
10. Escribir `README.md` raíz (requisitos, creación de la tabla en Supabase, variables de entorno, comandos de arranque de ambas apps) y `.gitignore` (`node_modules`, `.env*` salvo `.env.example`, `.next`, `dist`). Prueba manual: seguir el README desde cero levanta el proyecto completo.

## Criterios de aceptación

- [ ] `npm run dev` en `invitación_baby_shower_nat/` y `npm run dev` en `backend/` arrancan sin errores en consola.
- [ ] La invitación muestra: nombre "Aria Natasha", "Sábado 10 de octubre de 2026 · 3:00 pm", la dirección completa y los nombres de mamá y papá, con los mismos textos que el prototipo.
- [ ] La página no depende de `resources/support.js` ni de etiquetas `<x-dc>` o `<sc-if>`.
- [ ] Solo se carga el CSS de `modernist`; no hay referencias a `industry` ni `nocturne` en `invitación_baby_shower_nat/`.
- [ ] Con imágenes en `invitación_baby_shower_nat/public/img/foto.jpg` y `ultrasonido.jpg` se muestran las reales; sin ellas se muestra el placeholder.
- [ ] "Agregar al calendario" descarga un `.ics` con inicio el 2026-10-10 a las 15:00 hora local.
- [ ] "Ver en Google Maps" abre una búsqueda con "Calle Hidalgo 159 San Pablo Tepetlapa 04620".
- [ ] Enviar el formulario con nombre válido crea exactamente una fila en la tabla `rsvps` y muestra "¡Gracias, te esperamos!".
- [ ] Enviar con nombre vacío, `guests` fuera de 0–8 o mensaje de más de 500 caracteres no crea fila y muestra un mensaje de error en el formulario.
- [ ] Un envío con el campo honeypot `website` con texto responde `201` y no crea fila.
- [ ] Con el backend apagado, el formulario muestra un error y conserva lo escrito.
- [ ] `GET /api/rsvps` sin header `Authorization` o con clave incorrecta responde `401`.
- [ ] `/admin` con la clave correcta lista las confirmaciones, y `totalAttendees` es igual a la suma de `1 + guests` de todas las filas.
- [ ] "Exportar CSV" descarga un archivo con una fila por confirmación y encabezados `name,guests,message,created_at`.
- [ ] Una petición desde un origen distinto a `FRONTEND_ORIGIN` es rechazada por CORS.
- [ ] `SUPABASE_SERVICE_KEY` no aparece en ningún archivo bajo `frontend/` ni en el bundle de `npm run build`.
- [ ] Seguir el `README.md` desde un clon limpio permite levantar ambas apps.

## Decisiones

- **Sí:** Vue 3 + Vite como base del frontend. Es la decisión explícita del usuario.
- **Sí:** Next.js solo como API, en `backend/` separado del frontend. Respeta "Vue como base" y usa Next.js únicamente donde hace falta servidor.
- **No:** Nuxt como proyecto único. Se aparta de la mención de Next.js del usuario.
- **Sí:** Supabase (Postgres) accedido solo desde Next.js con la clave de servicio. El navegador nunca toca la base, así que no hay políticas RLS públicas que mantener.
- **No:** Vue hablando directo a Supabase. Exigiría RLS y dejaría a Next.js sin función.
- **No:** SQLite en archivo. Fue la opción recomendada, pero el usuario eligió Postgres/Supabase.
- **Sí:** Sin cuentas, duplicados permitidos y límite de 0–8 acompañantes. Coincide con el formulario del prototipo y evita complejidad para un evento único.
- **Sí:** Honeypot como antispam. Es barato y sin fricción para el invitado.
- **Sí:** Panel `/admin` en el frontend con contraseña única en variable de entorno. Alcanza para una sola persona administradora.
- **Sí:** Contraseña enviada como `Authorization: Bearer` y guardada solo en `sessionStorage`, para que se borre al cerrar la pestaña.
- **Sí:** Solo el design system `modernist`, porque es el único que enlaza la invitación. `resources/` queda intacto como referencia.
- **Sí:** Imágenes estáticas en `invitación_baby_shower_nat/public/img/`, con placeholder de respaldo. Permite que el proyecto corra antes de tener las fotos.
- **Sí (por defecto, no confirmado):** JavaScript sin TypeScript, para mantener el arranque simple. Cambiarlo antes de implementar si se prefiere TypeScript.
- **Sí (por defecto, no confirmado):** El `.ics` usa hora local flotante sin zona, y no incluye `DTEND`. El evento no tiene hora de fin definida.
- **Sí:** Solo desarrollo local en este spec. El despliegue se decide en otro spec.
- **No:** Dividir este trabajo en varios specs. Toca frontend, API y panel admin (tres áreas), y cada paso es pequeño; dividirlo agregaría trámite sin reducir riesgo.

## Riesgos

| Riesgo                                                          | Mitigación                                                                                                        |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Spam o envíos masivos al endpoint público                       | Honeypot y validación estricta. Limitación por IP queda para un spec futuro si aparece abuso.                     |
| Filtración de `ADMIN_PASSWORD` o `SUPABASE_SERVICE_KEY`         | Solo en `backend/.env.local`, ignorado por git; criterio de aceptación que verifica que no llegan al bundle.     |
| CORS mal configurado bloquea el front o deja abierta la API     | `FRONTEND_ORIGIN` explícito, sin `*`, con prueba en los criterios de aceptación.                                  |
| Diferencias visuales al migrar de `<x-dc>` a Vue                | Comparar contra el prototipo en el paso 2; los estilos inline se trasladan sin rediseñar.                         |
| El prototipo tiene tamaños fijos (`width: 413px`, `height: 91px`) | Reemplazarlos por reglas responsivas al migrar, para que no se rompa en móvil.                                    |
| Fotos aún no disponibles                                        | Placeholder de respaldo; el proyecto funciona sin ellas.                                                          |

## Qué **no** está en este spec

- Despliegue en Vercel u otro hosting.
- Cuentas de usuario, edición o eliminación de confirmaciones por el invitado.
- Bloqueo de duplicados, teléfono o correo en el formulario.
- Notificaciones por correo o WhatsApp.
- Los design systems `industry` y `nocturne`.
- Pruebas automatizadas end-to-end.

Cada uno de esos puntos, si se hace, va en su propio spec.
