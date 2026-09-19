# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Invitación de baby shower con confirmación de asistencia (RSVP). Dos paquetes independientes, cada uno con su propio `package.json` y `npm install`:

- `backend/`: Next.js 16 usado solo como API (sin páginas). Guarda en Supabase (solo Postgres) y avisa por Telegram.
- `invitación_baby_shower_nat/`: frontend Vue 3 (`rc`) + Vite 8, JS sin TypeScript. Alias `@` apunta a `src`.

`resources/` está ignorado por git. No hay formatter configurado.

## Comandos

- Local: backend en `:3000` (`npm run dev` en `backend/`) y frontend en `:5173` (`npm run dev` en el frontend), en dos terminales.
- `npm run lint` en ambos paquetes (ESLint flat config, `eslint.config.mjs`; el frontend usa el preset `essential` de Vue). `npm test` en `backend/` corre `node --test` sobre `tests/*.test.js` (sin dependencias, no toca Supabase).
- `npm run check:supabase` y `npm run check:telegram` (en `backend/`) validan credenciales con `node --env-file=.env.local`; requieren Node 22.18+ o 24.12+.
- `backend/AGENTS.md` avisa que este Next.js tiene cambios incompatibles: lee `backend/node_modules/next/dist/docs/` antes de escribir código de Next.

## Variables de entorno

- `backend/.env.local`: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (clave `service_role`, no la anon), `ADMIN_PASSWORD`, `FRONTEND_ORIGIN`, y opcionales `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`.
- Frontend `.env`: `VITE_API_URL` (URL del backend, sin `/` final).
- `.env*` está ignorado salvo `.env.example`. Nunca expongas la clave de servicio al frontend.

## Gotchas

- CORS (`backend/lib/cors.js`) acepta un único origen exacto: `FRONTEND_ORIGIN`. Sin comodines; si cambia el dominio del frontend, hay que actualizarlo y redesplegar el backend.
- Admin sin sesión: el frontend envía `Authorization: Bearer <ADMIN_PASSWORD>` en cada petición. Si `ADMIN_PASSWORD` no está definida, la API responde 401 siempre.
- `POST /api/rsvp` tiene un honeypot: si el campo `website` trae texto, responde 201 sin guardar.
- Telegram es opcional: si faltan las variables se omite el aviso; si falla, la confirmación se guarda igual. Si el grupo pasa a supergrupo, su chat ID cambia.
- Supabase tiene RLS activado sin políticas: solo funciona con la clave de servicio.
- El router usa `createWebHistory()`: el hosting necesita fallback SPA a `index.html` para que `/admin` no dé 404 (ya está en `vercel.json` del frontend).
- La carpeta del frontend lleva tilde (`invitación_baby_shower_nat`): entrecomilla la ruta en comandos.

## Estilo

JS con ESM, sin punto y coma, comillas simples. Comentarios, README y commits en español. Los errores usan clases con `code` (`RsvpError`, `AdminError`).
