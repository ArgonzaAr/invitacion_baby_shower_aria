---
name: deploy-check
description: Revisión previa al despliegue a producción de la invitación (build, variables de entorno, CORS y fallback SPA).
disable-model-invocation: true
---

Verifica que el proyecto esté listo para producción. No modifiques nada sin avisar; reporta cada punto como OK o con el problema.

1. Ejecuta `npm run build` en `backend/` y en `invitación_baby_shower_nat/` (entrecomilla la ruta por la tilde). Reporta errores.
2. Compara las variables usadas en el código (`process.env.*` en `backend/`, `import.meta.env.*` en el frontend) con los `.env.example` de cada paquete; señala las que falten.
3. Recuerda que en producción hay que definir en el hosting: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `ADMIN_PASSWORD` (distinta a la de pruebas), `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` y `FRONTEND_ORIGIN` en el backend; `VITE_API_URL` en el frontend.
4. Confirma que `FRONTEND_ORIGIN` debe ser el origen exacto del frontend publicado (https, sin `/` final) y `VITE_API_URL` la URL del backend.
5. Comprueba que exista un fallback SPA para el frontend (p. ej. `vercel.json` con rewrite a `/index.html`), ya que el router usa `createWebHistory()`.
6. Confirma con `git status` que no haya secretos ni archivos `.env*` (salvo `.env.example`) por subirse.
7. Termina con una lista de pasos pendientes, ordenada.
