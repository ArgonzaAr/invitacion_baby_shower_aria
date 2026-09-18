# SPEC 03 — Configuración de las notificaciones por Telegram

> **Status:** Aprobado
> **Depends on:** SPEC 01, SPEC 02
> **Date:** 2026-09-18
> **Objective:** Crear el bot y el grupo de Telegram, completar `backend/lib/telegram.js` (mensaje con nombre, acompañantes, mensaje y total acumulado; un reintento y log de errores) y comprobar en local que cada confirmación real llega al grupo.

## Por qué existe este spec

El SPEC 01 dejó una base de Telegram (`notifyRsvp` con un mensaje simple y envío de mejor esfuerzo) y difirió la configuración precisa a otro spec. Este es ese spec: define el destino, el formato final, el manejo de fallos y la verificación. Se apoya en el SPEC 02, que ya deja el backend conectado a Supabase.

## Alcance

**Dentro:**

- Crear el bot con @BotFather y un grupo con el usuario y su pareja (pasos manuales del usuario).
- Completar `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` (ID negativo del grupo) en `backend/.env.local`.
- Reescribir `backend/lib/telegram.js`: mensaje final, total acumulado, un reintento y `console.error` sin exponer el token.
- Ajustar la llamada en `backend/app/api/rsvp/route.js` solo si la firma de `notifyRsvp` cambia.
- Script `backend/scripts/check-telegram.js` y `npm run check:telegram` en `backend/package.json`.
- Prueba real desde el formulario y sección "Configurar Telegram" en el `README.md` raíz.

**Fuera de alcance (para specs futuros):**

- Comandos entrantes del bot (por ejemplo `/total`) y webhooks.
- Despliegue y variables de producción.
- Notificaciones por correo o WhatsApp.
- Botones, formato HTML o Markdown en el mensaje.
- Cola de reintentos persistente o más de un reintento.
- Pruebas automatizadas.

## Modelo de datos

Este spec no introduce estructuras de datos nuevas ni cambia la tabla `rsvps`. Solo cambian las variables de entorno que ya existían como opcionales:

```
TELEGRAM_BOT_TOKEN=<token entregado por @BotFather>
TELEGRAM_CHAT_ID=<ID negativo del grupo, por ejemplo -1001234567890>
```

Formato del mensaje (texto plano, sin `parse_mode`, para no escapar el contenido escrito por el invitado, toma en cuenta los emojis en dado caso de que el invitado coloque):

```
Nueva confirmación
Ana López (+2)
Mensaje: ¡Felicidades!
Total: 14 asistentes
```

Convenciones:

- La línea `Mensaje:` se omite si el invitado no escribió mensaje.
- `Total` es la suma de `1 + guests` de todas las filas de `rsvps`, incluida la recién guardada, igual que `totalAttendees` de `/admin`.
- Si la consulta del total falla, se envía el mensaje sin la línea `Total`.
- `notifyRsvp` sigue devolviendo `true` o `false` y nunca lanza error.

## Plan de implementación

1. **Paso manual del usuario:** crear el bot con @BotFather (`/newbot`), crear un grupo con su pareja, agregar el bot al grupo y escribir un mensaje en él. Comprobación: `https://api.telegram.org/bot<token>/getUpdates` muestra el grupo con su `chat.id` negativo (el token no se comparte en la conversación).
2. **Paso manual del usuario:** agregar `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` a `backend/.env.local`. Comprobación: Claude solo verifica que las variables existen, sin mostrar valores.
3. Reescribir `backend/lib/telegram.js`: formatear el mensaje final, consultar el total acumulado a Supabase, enviar con un reintento y registrar el fallo con `console.error` sin incluir el token ni la URL. Comprobación: con las variables vacías devuelve `false` sin error; con ellas y un `POST /api/rsvp` válido con `curl`, llega el mensaje al grupo.
4. Crear `backend/scripts/check-telegram.js` y el script `npm run check:telegram`: valida el token con `getMe`, envía un mensaje de prueba al grupo e imprime "OK" o el error de Telegram, sin mostrar credenciales. Comprobación: con la configuración correcta imprime OK y llega el mensaje; con un token o chat inválido imprime un error claro.
5. Levantar ambas apps y hacer la prueba real: enviar el formulario en `http://localhost:5173` y confirmar que el aviso llega a los dos integrantes del grupo con nombre, acompañantes, mensaje y total. Corregir lo que falle.
6. Agregar al `README.md` raíz la sección "Configurar Telegram" con los pasos 1, 2 y 4. Comprobación: seguir esa sección desde cero deja las notificaciones activas.
7. Limpiar las filas de prueba creadas y confirmar que `.env.local` no aparece en `git status` y que `TELEGRAM_BOT_TOKEN` no aparece en el bundle de `npm run build` del frontend.

## Criterios de aceptación

- [ ] `backend/.env.local` define `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`, y este último es un número negativo.
- [ ] `npm run check:telegram` en `backend/` imprime OK, envía un mensaje al grupo y no muestra ninguna credencial.
- [ ] Con un token inválido, `npm run check:telegram` imprime un error claro y termina con código distinto de cero.
- [ ] Un `POST /api/rsvp` válido responde `201` y envía un mensaje al grupo con el formato de este spec.
- [ ] El mensaje incluye la línea `Mensaje:` solo cuando el invitado escribió texto.
- [ ] La línea `Total` coincide con `totalAttendees` de `GET /api/rsvps` justo después de esa confirmación.
- [ ] Los dos integrantes del grupo reciben el aviso.
- [ ] Si el primer envío a Telegram falla, se hace exactamente un reintento; si también falla, la API responde `201` y el error queda en la consola del servidor sin el token.
- [ ] Con `TELEGRAM_BOT_TOKEN` vacío, la API responde `201` y no lanza error.
- [ ] Una petición con honeypot `website` con texto o con datos inválidos no envía ningún mensaje.
- [ ] Enviar el formulario real en `http://localhost:5173` muestra "¡Gracias, te esperamos!" y el aviso llega al grupo.
- [ ] `git status` no lista `backend/.env.local` y `TELEGRAM_BOT_TOKEN` no aparece en el resultado de `npm run build` del frontend.
- [ ] Las filas de prueba creadas durante la verificación quedan eliminadas o identificadas antes de dar el spec por terminado.

## Decisiones

- **Sí:** Grupo con el usuario y su pareja como destino. Ambos reciben los avisos sin depender de que uno reenvíe.
- **No:** Chat privado o canal. El privado deja fuera a la pareja; el canal agrega pasos sin beneficio para dos personas.
- **Sí:** Mensaje con nombre, acompañantes, mensaje y total acumulado. Permite seguir el aforo sin abrir `/admin`.
- **Sí:** El total incluye la fila recién guardada y usa la misma fórmula (`1 + guests`) que `/admin`, para que ambas cifras coincidan.
- **Sí:** Texto plano sin `parse_mode`. Nombre y mensaje los escribe el invitado y no hay que escapar caracteres especiales.
- **Sí:** Un reintento y log en el servidor, sin exponer el token. Cubre fallos puntuales de red sin complejidad; la fila siempre queda guardada.
- **No:** Cola de reintentos persistente. Es desproporcionada para un evento único.
- **Sí:** Mantener el `await` de `notifyRsvp` en la ruta. Sin él, un entorno serverless podría cortar el envío al terminar la respuesta; el tiempo máximo queda acotado por el timeout.
- **Sí:** Script `check:telegram` además de la prueba real, en línea con `check:supabase` del SPEC 02. Aísla fallos de token o de chat antes de tocar el formulario.
- **Sí:** Solo avisos salientes y solo en local. Los comandos entrantes exigen webhook y despliegue, que van en otro spec.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` filtrado en pantalla, logs o git | El script y `telegram.js` no imprimen el token ni la URL de la API; `.env.local` está ignorado; se revisa `git status` y el bundle (paso 7). |
| El grupo se convierte en supergrupo y su `chat.id` cambia | El aviso falla con error de chat; `check:telegram` lo detecta y se actualiza `TELEGRAM_CHAT_ID`. |
| El bot no está en el grupo o fue expulsado | `check:telegram` imprime el error de Telegram; se vuelve a agregar el bot. |
| Retraso en la respuesta del formulario por reintento (hasta unos 10 s con dos timeouts de 5 s) | Se acepta para volumen bajo; si molesta, se reduce el timeout en otro ajuste. |
| La consulta del total falla o suma mal | Se envía el mensaje sin `Total`; el criterio de aceptación compara contra `totalAttendees`. |
| Filas de prueba contaminan la lista real de invitados | Se borran o identifican antes de cerrar el spec (último criterio). |

## Qué **no** está en este spec

- Comandos entrantes del bot y webhooks.
- Despliegue y variables de producción.
- Notificaciones por correo o WhatsApp.
- Formato HTML o Markdown, botones o adjuntos.
- Cola de reintentos persistente.
- Pruebas automatizadas.

Cada uno, si se hace, va en su propio spec.
