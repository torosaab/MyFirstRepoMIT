# Cazador de Alucinaciones

App educativa gamificada construida en Lovable para entrenar a alumnos en la
detección y verificación de alucinaciones de IA.

- Editor: https://lovable.dev/projects/8a4d68e9-3a64-427c-98c4-c38614fb628f
- Preview: https://id-preview--8a4d68e9-3a64-427c-98c4-c38614fb628f.lovable.app

## Concepto

Cada ronda muestra **5 respuestas generadas por IA** sobre un tema.
**Exactamente 2 contienen datos falsos.** El alumno debe:

1. **Detectar** las 2 falsas (Fase 1).
2. **Verificar** cada una eligiendo la corrección correcta entre 3 opciones (Fase 2).

La Fase 2 es el núcleo pedagógico: sospechar no es suficiente, hay que comprobar.

## Paleta

| Rol | Hex |
| --- | --- |
| Violeta primario | `#6A0DAD` |
| Magenta acento | `#FF00FF` |
| Blanco | `#FFFFFF` |
| Azul marino | `#000080` |
| Negro | `#000000` |
| Cian eléctrico | `#00BFFF` |

Estética cyberpunk/neón sobre degradado negro → azul marino.

## Mecánica de puntuación

| Acción | Puntos |
| --- | --- |
| Alucinación detectada correctamente | +100 |
| Respuesta verdadera marcada como falsa | −25 |
| Verificación correcta (Fase 2) | +50 |
| Bonus de tiempo | segundos restantes × 2 |

- **Vidas:** 3. Se pierde una al fallar las 2 detecciones de una ronda.
- **Racha:** rondas consecutivas perfectas. ×1.5 desde racha 3, ×2 desde racha 5.
- **Temporizador:** 60 s por ronda (solo afecta al bonus, no elimina).

## Insignias

| Insignia | Condición |
| --- | --- |
| Ojo Clínico | Ronda perfecta |
| Detective de Datos | 5 verificaciones correctas |
| Racha de Fuego | Racha de 3 |
| Escéptico Profesional | 3 rondas perfectas seguidas |
| Cazador Legendario | Completar las 6 rondas sin perder vidas |
| Verificador | Todas las verificaciones correctas de una partida |

## Rangos

| Rango | Puntuación |
| --- | --- |
| Novato | < 500 |
| Aprendiz Crítico | 500 – 1199 |
| Detector Avanzado | 1200 – 1999 |
| Cazador Experto | 2000 – 2799 |
| Leyenda Anti-Alucinaciones | 2800 + |

## Rondas y contenido

Las 6 rondas viven en `src/data/rounds.ts`. Cada afirmación lleva texto,
marca de veracidad, explicación, corrección correcta, 2 señuelos y una pista
de verificación con la fuente recomendada.

| Ronda | Tema | Las 2 falsas |
| --- | --- | --- |
| 1 | Ciencia y espacio | Muralla China visible desde la Luna · Nobel de Einstein por la relatividad |
| 2 | Historia | Napoleón excepcionalmente bajo · Cascos vikingos con cuernos |
| 3 | Cuerpo humano | Usamos el 10 % del cerebro · Pelo y uñas crecen tras la muerte |
| 4 | Inteligencia artificial | Los LLM consultan siempre internet · Una cita con formato completo es real |
| 5 | Geografía | El Sahara es el mayor desierto · Sídney es la capital de Australia |
| 6 | Datos y estadística | Una muestra grande elimina el sesgo · p = 0,05 ⇒ 95 % de que sea verdad |

Las rondas y las tarjetas dentro de cada ronda se barajan en cada partida.

## Cierre: "Qué aprendiste"

Cuatro consejos de verificación al terminar la partida:

1. Comprobar siempre la fuente primaria.
2. Desconfiar de cifras y fechas demasiado precisas.
3. Contrastar con dos fuentes independientes.
4. Pedir al modelo que cite — y después verificar esas citas.

## Stack

React + TypeScript + Tailwind + shadcn/ui. Sin backend ni login: el ranking
top 10 se guarda en `localStorage`. Interfaz íntegramente en español,
responsive y accesible por teclado.
