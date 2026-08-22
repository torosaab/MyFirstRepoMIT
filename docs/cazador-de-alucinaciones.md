# Cazador de Alucinaciones

App educativa gamificada construida en Lovable para entrenar a alumnos en la
detección y verificación de alucinaciones de IA.

- Editor: https://lovable.dev/projects/8a4d68e9-3a64-427c-98c4-c38614fb628f
- Preview: https://id-preview--8a4d68e9-3a64-427c-98c4-c38614fb628f.lovable.app

## Concepto

Cada ronda arranca con **una pregunta hecha a un chatbot**. Las 5 tarjetas
siguientes son **su respuesta**, y exactamente 2 contienen datos inventados.

La idea central: **el alumno no necesita saber el dato correcto**. Debe
reconocer las marcas con las que se disfraza una invención. Por eso el juego
enseña primero las señales y luego hace jugar.

1. **Detectar** las 2 falsas (Fase 1), apoyándose en el panel de señales.
2. **Verificar** cada una eligiendo la corrección correcta entre 3 opciones
   (Fase 2). Sospechar no basta: hay que comprobar.

## Las 4 señales de alarma

Disponibles en todo momento desde el botón "Señales de alarma" de la barra
superior, y repetidas en el modal de "¿Cómo se juega?".

| Señal | En qué consiste |
| --- | --- |
| Cifras demasiado precisas | Un porcentaje con decimales o una cantidad "exacta" en algo que en realidad es un rango. |
| Fuentes que no se pueden abrir | "Según un estudio", "un informe de la NASA de 2019", sin título, autor ni enlace. |
| Absolutos | "El único", "siempre", "nunca", "todos". Rara vez sobreviven a una comprobación. |
| Un dato falso escondido entre datos correctos | La frase es casi toda cierta y el error está en un solo detalle. |

Al revelar los resultados, cada tarjeta falsa muestra un bloque
**🚩 Señal de alarma** explicando cuál de las cuatro la delataba, más una
pista de verificación con la fuente recomendada.

## Paleta

| Rol | Hex |
| --- | --- |
| Violeta primario | `#6A0DAD` |
| Magenta acento | `#FF00FF` |
| Blanco | `#FFFFFF` |
| Azul marino | `#000080` |
| Negro | `#000000` |
| Cian eléctrico | `#00BFFF` |

Estética cyberpunk/neón sobre degradado negro → azul marino. Los seis colores
están definidos como tokens oklch en `src/styles.css`.

## Mecánica de puntuación

| Acción | Puntos |
| --- | --- |
| Alucinación detectada correctamente | +100 |
| Respuesta verdadera marcada como falsa | −25 |
| Verificación correcta (Fase 2) | +50 |
| Bonus de tiempo | segundos restantes × 2 |

- **Vidas:** 3. Se pierde una al fallar las 2 detecciones de una ronda.
- **Racha:** rondas consecutivas perfectas. ×1,5 desde racha 3, ×2 desde racha 5.
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

Las 6 rondas viven en `src/data/rounds.ts`. Nivel de cultura general
(secundaria), deliberadamente no especializado: la dificultad está en detectar
la señal, no en dominar el tema. Cada `Round` lleva la `question` al chatbot;
cada afirmación falsa lleva `correction`, 2 `decoys`, el `redFlag` y la pista
de `verification`.

| Ronda | Tema | Las 2 alucinaciones | Señal que las delata |
| --- | --- | --- | --- |
| 1 | El Sistema Solar | Júpiter es el planeta más cercano al Sol (con la distancia real de Mercurio) | Cifra precisa junto a un dato falso |
| | | La Luna genera un 12 % de luz propia "según un informe de la NASA de 2019" | Fuente que no se puede abrir |
| 2 | El cuerpo humano | Usamos el 10 % del cerebro "según un estudio de Harvard de 1998" | Estudio inventado |
| | | El mapa de sabores de la lengua | Mito muy repetido |
| 3 | Geografía | Sídney es la capital de Australia (con su población real) | Dato cierto que valida al falso |
| | | El Everest está entre Nepal y la India | Error escondido en un detalle |
| 4 | Historia | Cascos vikingos con cuernos "según el yacimiento de Gjermundbu" | Fuente real que dice lo contrario |
| | | La Muralla China es "la única" construcción visible desde el espacio | Absoluto |
| 5 | Cómo funciona la IA | Un modelo no puede inventar referencias | La señal en la que más confiamos |
| | | La IA consulta internet siempre, así que está actualizada | Frase tranquilizadora |
| 6 | Cifras y estadísticas | El cuerpo tiene "exactamente 7,4 litros" de sangre | Precisión falsa sobre un rango |
| | | "El 73 % de los estudiantes usa IA a diario, según un estudio reciente" | Porcentaje sin fuente localizable |

Las rondas y las tarjetas dentro de cada ronda se barajan en cada partida.

## Cierre: "Qué aprendiste"

Cuatro consejos de verificación al terminar la partida:

1. Comprobar siempre la fuente primaria.
2. Desconfiar de cifras y fechas demasiado precisas.
3. Contrastar con dos fuentes independientes.
4. Pedir al modelo que cite — y después verificar esas citas.

## Stack

React + TypeScript + TanStack Start + Tailwind + shadcn/ui. Sin backend ni
login: el ranking top 10 se guarda en `localStorage`. Interfaz íntegramente en
español, responsive y accesible por teclado.
