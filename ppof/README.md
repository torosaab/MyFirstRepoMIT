# Test PPOF · Operational Focus Score

Página del test PPOF de PEAK LATAM. Tiene tres pasos: registro, 10 preguntas Sí/No y resultado.
Al terminar, la persona ve su resultado en pantalla y lo recibe por correo.
Cada respuesta también se guarda en una hoja de Google Sheets.

| Archivo | Para qué sirve |
|---|---|
| `contenido.json` | **Todos los textos**: preguntas, resultados, cierre, contacto y link de WhatsApp. Edita aquí y luego ejecuta `python3 build.py`. |
| `index.html` | La página del test (código fuente). |
| `build.py` | Genera `notion/test-ppof.html` y `apps-script/Contenido.gs` a partir de `contenido.json`. |
| `notion/test-ppof.html` | La página completa en un solo archivo, lista para subir a Notion como bloque HTML. |
| `apps-script/Code.gs` + `Contenido.gs` | Código que envía los correos y registra cada respuesta en Google Sheets. |
| `qr-test-ppof.png` / `.svg` | Código QR. |

**Correos (modo prueba):** la persona que hace el test recibe su resultado, y `torosaab@gmail.com` recibe un segundo correo con sus datos y el mismo resultado.
Para producción, cambia `COPIA_A` y `RESPONDER_A` en `Code.gs` a `contacto@engagepeak.com`.

**Puntuación:** cada "Sí" vale 1 punto. 0–3 🟢 Enfoque de Alto Rendimiento · 4–6 🟡 Distracción Moderada · 7–10 🔴 Ceguera Operativa Severa.

## 1. La página en Notion

El test vive en una página de Notion como bloque HTML, creado a partir de `notion/test-ppof.html`.
Para que cualquiera pueda abrirlo desde el QR, en Notion ve a **Compartir → Publicar** y activa la publicación en la web.
Copia la URL pública (`….notion.site/…`): con ella se genera el QR.

Cada vez que cambies textos o la URL del script, ejecuta `python3 build.py` y vuelve a subir `notion/test-ppof.html` al bloque HTML.

## 2. Activar el envío por correo (Google Apps Script, gratis)

1. Crea una hoja nueva en [Google Sheets](https://sheets.new) llamada, por ejemplo, "Respuestas Test PPOF".
2. En la hoja, ve a **Extensiones → Apps Script**.
3. Borra el contenido de `Código.gs` y pega todo el contenido de `apps-script/Code.gs`. Luego crea un segundo archivo (**+ → Secuencia de comandos**) llamado `Contenido` y pega ahí `apps-script/Contenido.gs`. Guarda.
4. Revisa las constantes del inicio (`COPIA_A`, `REMITENTE`, `RESPONDER_A`).
5. Selecciona la función `prueba` en el menú de arriba y presiona **Ejecutar**. Google pedirá permisos: acéptalos.
   Esto te envía un correo de prueba a ti y crea la pestaña "Respuestas".
6. Ve a **Implementar → Nueva implementación**. En el engrane, elige **Aplicación web**, con esta configuración:
   - *Ejecutar como:* **Yo**
   - *Quién tiene acceso:* **Cualquier usuario**
7. Copia la **URL de la aplicación web** (termina en `/exec`).
8. En `index.html`, pega esa URL en la línea `const APPS_SCRIPT_URL = "";`, ejecuta `python3 build.py` y vuelve a subir el HTML a Notion. Si quieres, pásale la URL a Claude y lo hace por ti.

> Si después cambias `Code.gs`, entra a **Implementar → Gestionar implementaciones**, edita la implementación y elige **Nueva versión**. Así la URL no cambia.

**Límites:** los correos salen desde la cuenta de Google que instaló el script. Una cuenta Gmail gratuita puede enviar unos 100 correos al día; una cuenta de Google Workspace, unos 1,500.
Para que el remitente aparezca como `contacto@engagepeak.com`, instala el script con esa cuenta, si es de Google Workspace.

## 3. WhatsApp y QR

- El link de WhatsApp está en `contenido.json` → `"whatsapp"`. Usa el formato `https://wa.me/52XXXXXXXXXX?text=...`.
- El QR actual apunta a la versión de GitHub Pages. Cuando publiques la página de Notion, genera un QR nuevo con esa URL.
