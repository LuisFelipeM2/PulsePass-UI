# PulsePass Web

Frontend SPA de PulsePass construida con React, TypeScript, Tailwind CSS v4, React Router, TanStack Query, React Hook Form y Zod.

## Requisitos

- Node.js 22.22 o superior.
- API PulsePass disponible en `http://localhost:8080` para los flujos conectados.

## Desarrollo

```bash
npm install
cp .env.example .env
npm run dev
```

Vite reenvía `/api` a `http://localhost:8080`. Para otro origen, cambia `VITE_API_BASE_URL` en `.env` y configura CORS en el backend.

## Comandos

- `npm run dev`: servidor de desarrollo.
- `npm run build`: comprobación TypeScript y compilación de producción.
- `npm run lint`: reglas ESLint.
- `npm test`: suite Vitest existente.

## Rutas principales

- Público: `/`, `/eventos`, `/artistas`, `/sedes`, `/login`, `/registro`.
- Usuario: `/cuenta`, `/mis-tickets`, `/mis-tickets/:ticketCode`.
- STAFF: `/staff/validacion`, `/staff/eventos/:eventCode/tickets`.
- ADMIN: `/admin/eventos`, `/admin/eventos/nuevo`, `/admin/eventos/:eventCode`.

## Estructura

- `src/funcionalidades/<dominio>/api.ts`: funciones HTTP; no contiene hooks ni componentes.
- `src/funcionalidades/<dominio>/hooks.ts`: consultas y mutaciones TanStack Query, incluidas sus claves e invalidaciones.
- `src/pages/`: una página por ruta, cargada de forma perezosa; `compartidos.tsx` contiene elementos de presentación reutilizados.
- `src/componentes/`: controles visuales generales.
- `src/layouts/`: navegación y guardas de sesión/rol.
- `src/lib/`: cliente HTTP, rutas, formato y configuración de caché.

La interfaz oculta acciones según rol para facilitar el uso; la API sigue siendo responsable de autorizar cada operación. El token de sesión se guarda en `sessionStorage` y se envía únicamente mediante `Authorization: Bearer`.

## Integración pendiente de confirmar

Los esquemas Zod deben contrastarse con los DTO reales de las fases REST y Seguridad antes de conectar la API. En particular: campos de `GET /api/auth/me`, datos incluidos en respuestas de eventos y tickets, códigos HTTP de creación/asociación y forma del objeto `details` de errores. Este proyecto no implementa pagos reales, QR, refresh token ni cambios al backend.
