# Mi entreno: notas para publicar

- La app es `index.html` (un solo archivo), `sw.js` (funciona sin conexión), `manifest.webmanifest` e `icons/`.
- Al publicar una versión nueva:
  1. Sube `VERSION` en `index.html` y el nombre de caché `V` en `sw.js`.
  2. Copia la versión nueva a `versiones/mi-entreno-<versión>.html` y añádela arriba de la lista de `versiones/index.html` (marca «actual» solo en la más nueva).
  3. Crea la etiqueta git `v<versión>` y súbela con el commit.
- Nunca subas aquí claves de sincronización ni enlaces de Apps Script: el repositorio es público.
