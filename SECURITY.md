# Seguridad del frontend

La API aplica la autorización. Los permisos, rutas privadas y datos guardados en el navegador sirven para la interfaz y no constituyen controles de acceso.

## Configuración y secretos

- Configurar únicamente la URL pública de API mediante `REACT_APP_API_URL`. El valor por defecto de producción es `/api`, que requiere el proxy correspondiente; una API separada debe usar HTTPS y CORS con el origen exacto del frontend.
- Ningún secreto debe usar prefijo `REACT_APP_`: estas variables se incorporan al JavaScript público.
- Las métricas de integración pasan por `/api/integration/dashboard`. Las credenciales del proveedor pertenecen a configuración privada del backend. Una clave que haya aparecido en versiones anteriores debe revocarse y rotarse en el proveedor, incluso después de eliminarla del código.
- Los mensajes de consola se redactan a través de `clientLogger`; no agregar logs de tokens, respuestas completas, archivos o enlaces firmados.

## Compilación y comprobación

`npm run lint` revisa el código y los scripts y falla si encuentra errores o warnings. Las URL hostiles de las pruebas tienen excepciones puntuales documentadas; la regla sigue activa en la aplicación.

`npm ci --include=dev --omit=optional` instala las herramientas de compilación y aplica mediante `postinstall` el parche versionado `patches/react-dev-utils+12.0.1.patch`. Corrige el uso obsoleto de `fs.F_OK` en Create React App por `fs.constants.F_OK`, manteniendo la comprobación de archivos requeridos. No se desactivan los avisos de Node. Si se instala con `--ignore-scripts`, ejecutar después `npm run postinstall` antes de compilar.

`npm run build` fuerza la desactivación de mapas de código fuente. Para validación aislada puede configurarse `BUILD_PATH=.audit-build`; no es necesario publicar esa carpeta temporal.

Después de compilar, ejecutar `npm run security:check -- --build-dir=.audit-build` (o sin argumento para revisar `build`). El proceso falla si detecta mapas, artefactos sensibles o patrones de credenciales conocidos. Los valores detectados no se imprimen. La comprobación no sustituye auditoría de dependencias, revisión de código ni pruebas del servidor.

No desplegar solo encima de una versión anterior: los mapas o archivos retirados pueden seguir publicados si el despliegue conserva archivos sobrantes. Preparar una versión limpia y retirar la anterior conforme al procedimiento de respaldo del entorno.

`public/.htaccess` y `public/web.config` incluyen bloqueo de mapas, archivos ocultos/configuración y respaldos, desactivación de índices y cabeceras de seguridad. Su efectividad depende de Apache con módulos/permisos correspondientes o IIS con URL Rewrite. Nginx requiere reglas equivalentes. Verificar las cabeceras y códigos HTTP efectivos después de desplegar. El CSP inicial limita framing, objetos, base y formularios; una política completa de scripts debe probarse contra los recursos legítimos antes de imponerla.

## Archivos privados

Documentos internos y adjuntos de helpdesk se recuperan mediante la API autenticada como blobs. La interfaz utiliza la URL entregada por el servidor, no reconstruye rutas `/storage`. Los enlaces firmados caducan; si caducan, volver a consultar el registro. El encabezado de autorización solo se envía al origen configurado de la API. Evitar proxies de terceros para documentos o imágenes privadas.

## Pruebas automatizadas

`npm test -- --watchAll=false --runInBand --runTestsByPath src/api/index.test.js src/utils/secureFiles.test.js src/utils/clientLogger.test.js`

Usar cuentas y archivos sintéticos. Confirmar además con la aplicación que un administrador puede descargar un borrador/adjunto, que un usuario sin permiso recibe rechazo y que los documentos públicos aprobados siguen visibles. Eliminar un token o cambiar el usuario en el navegador no debe ampliar el acceso al servidor.
