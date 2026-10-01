# Test PPOF · Operational Focus Score

Página del test PPOF de PEAK LATAM. Tiene tres pasos: registro, 10 preguntas Sí/No y resultado.
Al terminar, la persona ve su resultado en pantalla y lo recibe por correo.
Cada respuesta también se guarda en una hoja de Google Sheets.

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La página del test. |
| `contenido.json` | **Todos los textos**: preguntas, resultados, cierre, contacto y link de WhatsApp. Edita aquí; la página y el correo lo leen de este archivo. |
| `apps-script/Code.gs` | Código que envía el correo y registra en Google Sheets. |
| `qr-test-ppof.png` / `.svg` | Código QR que apunta a `https://torosaab.github.io/MyFirstRepoMIT/ppof/`. |

**Puntuación:** cada "Sí" vale 1 punto. 0–3 🟢 Enfoque de Alto Rendimiento · 4–6 🟡 Distracción Moderada · 7–10 🔴 Ceguera Operativa Severa.

## 1. Publicar la página (GitHub Pages)

1. Une (merge) esta rama con `main`.
2. En GitHub ve a **Settings → Pages** y confirma que publica desde la rama `main`, carpeta `/ (root)`.
3. Abre `https://torosaab.github.io/MyFirstRepoMIT/ppof/`. Puede tardar 1–2 minutos en aparecer.

## 2. Activar el envío por correo (Google Apps Script, gratis)

1. Crea una hoja nueva en [Google Sheets](https://sheets.new) llamada, por ejemplo, "Respuestas Test PPOF".
2. En la hoja, ve a **Extensiones → Apps Script**.
3. Borra el contenido de `Código.gs` y pega todo el contenido de `apps-script/Code.gs`. Guarda.
4. Revisa las constantes del inicio (`COPIA_A`, `REMITENTE`, `RESPONDER_A`).
5. Selecciona la función `prueba` en el menú de arriba y presiona **Ejecutar**. Google pedirá permisos: acéptalos.
   Esto te envía un correo de prueba a ti y crea la pestaña "Respuestas".
6. Ve a **Implementar → Nueva implementación**. En el engrane, elige **Aplicación web**, con esta configuración:
   - *Ejecutar como:* **Yo**
   - *Quién tiene acceso:* **Cualquier usuario**
7. Copia la **URL de la aplicación web** (termina en `/exec`).
8. En `index.html`, pega esa URL en la línea `const APPS_SCRIPT_URL = "";`. Guarda y sube el cambio.

> Si después cambias `Code.gs`, entra a **Implementar → Gestionar implementaciones**, edita la implementación y elige **Nueva versión**. Así la URL no cambia.

**Límites:** los correos salen desde la cuenta de Google que instaló el script. Una cuenta Gmail gratuita puede enviar unos 100 correos al día; una cuenta de Google Workspace, unos 1,500.
Para que el remitente aparezca como `contacto@engagepeak.com`, instala el script con esa cuenta, si es de Google Workspace.

## 3. WhatsApp y QR

- El link de WhatsApp está en `contenido.json` → `"whatsapp"`. Usa el formato `https://wa.me/52XXXXXXXXXX?text=...`.
- El QR ya apunta a la URL final. Si cambias la dirección de la página, genera un QR nuevo.
