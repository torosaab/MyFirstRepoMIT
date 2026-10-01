"""Genera los archivos derivados de contenido.json.

  python3 build.py

- notion/test-ppof.html: página del test en un solo archivo (se sube a Notion).
- apps-script/Contenido.gs: los mismos textos para el script de correo.
"""
import json
import pathlib
import re

aqui = pathlib.Path(__file__).parent
contenido = json.loads((aqui / "contenido.json").read_text(encoding="utf-8"))
compacto = json.dumps(contenido, ensure_ascii=False, separators=(",", ":"))

html = (aqui / "index.html").read_text(encoding="utf-8")
marca = "const CONTENIDO_EMBEBIDO = null;"
assert marca in html
html = html.replace(marca, "const CONTENIDO_EMBEBIDO = " + compacto.replace("</", "<\\/") + ";")
(aqui / "notion").mkdir(exist_ok=True)
(aqui / "notion" / "test-ppof.html").write_text(html, encoding="utf-8")

(aqui / "apps-script" / "Contenido.gs").write_text(
    "// Generado por ppof/build.py a partir de contenido.json. No editar a mano.\n"
    "const CONTENIDO = " + json.dumps(contenido, ensure_ascii=False, indent=2) + ";\n",
    encoding="utf-8",
)
url = re.search(r'const APPS_SCRIPT_URL = "(.*)";', html).group(1)
print("OK · notion/test-ppof.html", len(html.encode()), "bytes · APPS_SCRIPT_URL =", url or "(vacía)")
