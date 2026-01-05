Perfecto. Te escribo **el MVP por sprints** de forma **definitiva y limpia**, incorporando **el core conceptual de Tonal Field** y **dejando preparadas las features de pago**, pero sin inflar el alcance.

Esto está redactado para que puedas usarlo tal cual en:

* Notion / Jira
* Documento de producto
* Pitch / memoria de proyecto

---

# MVP — **Tonal Field**

**Explore color as a continuous space**

## Objetivo del MVP

Construir una primera versión pública de **Tonal Field** que permita:

* Explorar el color como un **campo continuo**
* Controlar combinaciones mediante **Energía** y **Tensión**
* Obtener **sistemas de color utilizables**
* Introducir de forma natural un modelo **Free / Pro**

---

## 🟦 Sprint 0 — Visión, Setup y Fundaciones

**Duración:** 2–3 días

### Objetivo

Alinear producto, concepto y base técnica antes de construir.

### Alcance

* Definición final del producto:

  * Nombre: **Tonal Field**
  * Tagline:

    * *Explore color as a continuous space*
    * *Color is not discrete. It’s a field.*
* Decisiones técnicas:

  * Next.js + TypeScript
  * Espacio de color OKLCH
* Estructura inicial del proyecto
* Skeleton de la UI (layout base)

### Entregables

* Repositorio inicial
* README con visión y alcance del MVP
* Layout base navegable

### DoD

* El proyecto arranca sin fricción
* El alcance está claramente acotado

---

## 🟦 Sprint 1 — Core Concept: Energy & Tension

**Duración:** 1 semana

### Objetivo

Convertir el concepto central en un sistema funcional.

### Alcance

* Implementación de los dos ejes:

  * **Energy** (Calm → Vivid)
  * **Tension** (Soft → Sharp)
* Definición algorítmica:

  * Chroma
  * Hue difference
  * Lightness contrast
  * Vibration
* Función de scoring unificada
* Generación de pares de color condicionados por los sliders

### Entregables

* Sliders funcionales
* Generación coherente y reproducible
* Base del modelo matemático

### DoD

* Los cambios en sliders producen resultados predecibles
* No hay sensación de aleatoriedad

---

## 🟦 Sprint 2 — El Field: Exploración Continua

**Duración:** 1 semana

### Objetivo

Materializar la idea de “campo tonal”.

### Alcance

* Mood Field 2D:

  * Eje X → Energy
  * Eje Y → Tension
* Interacción directa:

  * Click / drag sobre el campo
  * Sincronización con sliders
* Generación de variaciones cercanas (continuidad espacial)

### Entregables

* Mapa 2D interactivo
* Exploración fluida y comprensible

### DoD

* El usuario entiende el “field” sin explicación
* El mapa tiene coherencia espacial

---

## 🟦 Sprint 3 — De Pares a Sistemas (Palette Kits)

**Duración:** 1 semana

### Objetivo

Transformar exploración en resultado usable.

### Alcance

* Construcción de **palette kits**:

  * Primary
  * Background
  * Surface
  * Text / Muted
  * Accent
* Derivación automática desde el par base
* Visualización por roles de uso

### Entregables

* Sistema de color completo
* UI clara orientada a diseño de interfaces

### DoD

* La paleta puede usarse directamente en un producto
* Se percibe como sistema, no como inspiración

---

## 🟦 Sprint 4 — Accesibilidad y Confianza

**Duración:** 4–5 días

### Objetivo

Hacer que Tonal Field sea utilizable en producción real.

### Alcance

* Cálculo de contraste WCAG:

  * AA / AAA
* Indicadores visuales claros
* **Fix contrast**:

  * Ajuste automático de lightness
  * Manteniendo el carácter tonal

### Entregables

* Badges de accesibilidad
* Corrección automática funcional

### DoD

* El usuario no necesita herramientas externas
* Accesibilidad integrada, no opcional

---

## 🟦 Sprint 5 — Free vs Pro (Monetización suave)

**Duración:** 4–5 días

### Objetivo

Introducir el modelo de pago sin romper la experiencia.

### Alcance

* Definición de límites Free:

  * Preview de kits
  * Export básico (HEX)
  * Guardado limitado
* Features Pro activables:

  * Kits completos
  * Auto-fix avanzado
  * Guardado ilimitado
* UX de upgrade contextual (no intrusivo)

### Entregables

* Lógica Free / Pro
* Mensajes de upgrade claros y elegantes

### DoD

* El valor Pro se entiende antes de pagar
* No hay paywalls agresivos

---

## 🟦 Sprint 6 — Export & Persistencia

**Duración:** 4–5 días

### Objetivo

Cerrar el ciclo de uso del producto.

### Alcance

* Export PRO:

  * CSS variables
  * Tailwind config
  * JSON tokens
* Seeds en URL
* Guardado local / cuenta básica

### Entregables

* Export funcional
* Paletas reproducibles y compartibles

### DoD

* El usuario puede llevarse el resultado
* Tonal Field entra en el workflow real

---

## 🟦 Sprint 7 — Pulido y Release

**Duración:** 3–4 días

### Objetivo

Publicar un MVP sólido y presentable.

### Alcance

* Landing final
* Microcopy
* Responsive
* Performance
* Detalles visuales y UX

### Entregables

* MVP público
* Dominio conectado
* Versión lista para feedback real

### DoD

* El producto se entiende en <30 segundos
* Se puede compartir con confianza

---

## Resumen Ejecutivo

| Sprint | Enfoque          | Valor          |
| ------ | ---------------- | -------------- |
| 0      | Fundaciones      | Claridad       |
| 1      | Energy & Tension | Control        |
| 2      | Field            | Exploración    |
| 3      | Systems          | Utilidad       |
| 4      | Accessibility    | Confianza      |
| 5      | Monetización     | Sostenibilidad |
| 6      | Export           | Workflow       |
| 7      | Polish           | Credibilidad   |

---

## Sprints futuros (post-MVP)

## Sprint 8 - Generación rápida y presets

**Objetivo:** Acelerar la exploración de paletas con variaciones rápidas.

### Alcance

* Modo aleatorio (atajo tipo barra espaciadora) para mover Energy/Tension
* Seed consistente para reproducir variaciones
* Galería de paletas predefinidas o populares

### Entregables

* Botón / atajo de shuffle
* Presets navegables y aplicables

---

## Sprint 9 - Lock por rol y recalculo parcial

**Objetivo:** Permitir fijar colores clave mientras se ajusta el resto.

### Alcance

* Lock por rol (Primary, Accent, etc.)
* Recalculo del kit respetando colores bloqueados
* UI de bloqueo clara y rápida

### Entregables

* Lock visible por rol
* Ajustes que no afectan colores fijados

---

## Sprint 10 - Importación desde imagen

**Objetivo:** Generar paletas desde imágenes y referencias visuales.

### Alcance

* Upload de imagen
* Extracción de colores dominantes
* OCR opcional para detectar tonos vinculados a texto o marca

### Entregables

* Input de imagen + extracción
* Paleta derivada aplicable al sistema

---

## Sprint 11 - Exportaciones ampliadas y compatibilidad

**Objetivo:** Mejorar el output para distintos workflows sin fricción.

### Alcance

* Export RGB, HSL, LCH además de OKLCH/HEX
* CSS variables completas + tokens
* Configs para frameworks (Tailwind, Material UI)
* Preparación para plugins (Figma/Sketch/VS Code)

### Entregables

* Exportadores multi-formato
* Copia/descarga directa

---

## Sprint 12 - Accesibilidad avanzada

**Objetivo:** Diseñar paletas inclusivas con soporte visual completo.

### Alcance

* Simulador de daltonismo
* Ajustes automáticos para AA/AAA en roles Accent/Muted
* Comparativa de pares texto/fondo

### Entregables

* Modo simulación accesible
* Alternativas recomendadas por rol

---

## Sprint 13 - AI y sugerencias inteligentes

**Objetivo:** Automatizar estilos desde intención creativa.

### Alcance

* Input de estilo (retro, minimalista, corporativo, etc.)
* Ajuste automático de Energy/Tension
* Variaciones sugeridas

### Entregables

* Motor de sugerencias basado en prompts
* Sets de paletas por estilo

---

## Sprint 14 - Biblioteca y comunidad de paletas

**Objetivo:** Construir un repositorio abierto de inspiración.

### Alcance

* Biblioteca pública con filtros por mood/estilo
* Guardado y compartición
* Valoraciones o comentarios

### Entregables

* Feed de paletas comunitarias
* Sistema de interacción social básico

---

## Sprint 15 - Configuración de número de colores y jerarquía

**Objetivo:** Adaptar el sistema a distintos tamaños de paleta.

### Alcance

* Selección de 3/5/7 roles
* Reglas de proporción (60-30-10)
* Recomendaciones de uso por rol

### Entregables

* Selector de tamaño de kit
* Jerarquías aplicables en UI

---

## Sprint 16 - Tema dual (light/dark)

**Objetivo:** Generar variantes light/dark coherentes.

### Alcance

* Derivación automática dual
* Ajustes de contraste por modo
* Preview simultáneo

### Entregables

* Paletas duales consistentes
* Preview de UI en ambos modos

---

### Nota final

Este MVP:

* No es un “color picker”
* Es un **marco conceptual + herramienta práctica**
* Está preparado para crecer (AI, teams, presets, comparación)

Si quieres, el siguiente paso lógico sería:

* convertir estos sprints en **issues técnicas**, o
* redactarlos como **documentación de TFG / pitch deck**, o
* bajar uno de los sprints (por ejemplo el 1 o el 2) a **pseudo-código y arquitectura real**.

Tú decides por dónde seguimos.
