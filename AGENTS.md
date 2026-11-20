<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Reglas de trabajo y seguridad acordadas

## Comunicación

- Comunícate siempre conmigo en español.
- Explica los cambios de forma sencilla y clara.
- Avanza paso a paso y confirma qué cambiarás antes de modificar archivos.
- Haz cambios pequeños y fáciles de comprobar.
- Conserva las funcionalidades existentes.

## Modificaciones

- No modifiques ningún archivo sin explicar previamente qué vas a cambiar.
- Antes de terminar una tarea, indica qué archivos modificaste y cómo comprobar el resultado.
- Limita cada modificación a lo necesario para la solicitud.

## Base de datos y migraciones

- No ejecutes migraciones ni modifiques la base de datos sin mi autorización explícita.
- No modifiques archivos `.env`.
- No muestres contraseñas, claves API ni otros secretos.

## Git y despliegues

- No ejecutes `git push`.
- No despliegues cambios en producción sin mi permiso.
- No crees commits, ramas ni otros cambios de Git a menos que yo lo solicite explícitamente.
