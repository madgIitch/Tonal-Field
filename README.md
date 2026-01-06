# Tonal Field

Explore color as a continuous space

Tonal Field es una herramienta de diseño de sistemas de color que permite explorar el color como un campo continuo, controlado por dos dimensiones intuitivas: **Energy** (Calm → Vivid) y **Tension** (Soft → Sharp).

A diferencia de herramientas como Coolors que generan paletas aleatorias, Tonal Field ofrece **control inteligente y criterio matemático** para crear sistemas de color utilizables directamente en producción.

---

## ✨ Características principales

### 🎨 Field 2D (Diferencial de producto)

Explora el color como un espacio continuo en lugar de colores discretos. Manipula Energy y Tension para entender cómo se relacionan los colores.

### ⚡ Energy & Tension

* **Energy:** Controla la saturación y vivacidad (Calm → Vivid)
* **Tension:** Define la armonía y contraste (Soft → Sharp)
* Algoritmo propio basado en métricas de color OKLCH

### 🎯 Palette Kits

Generación automática de sistemas de color utilizables:

* **Primary, Accent, Background, Surface, Text, Muted**
* Roles claramente definidos para diseño de UI
* Jerarquía visual integrada

### ♿ Accesibilidad integrada

* Cálculo automático de contraste WCAG (AA/AAA)
* Simulador de daltonismo (protanopia, deuteranopia, tritanopia)
* Auto-fix de contraste manteniendo coherencia tonal

### 🌓 Tema dual (Light/Dark)

Genera automáticamente variantes light y dark coherentes con métricas de contraste.

### 📤 Exports profesionales

* CSS variables
* Tailwind config
* JSON tokens
* Material UI theme
* Plugins para Figma, Sketch, VS Code
* Apple .clr format

---

## 🚀 Estado del MVP

| Sprint | Feature | Estado |
| ------ | ------- | ------ |
| 0      | Setup fundacional | ✅ Completado |
| 1      | Energy & Tension | ✅ Completado |
| 2      | Field 2D interactivo | ✅ Completado |
| 3      | Palette kits | ✅ Completado |
| 4      | Accesibilidad | ✅ Completado |
| 5      | Free/Pro model | ✅ Completado |
| 6      | Export & persistencia | ✅ Completado |
| 7      | Polish & release | ✅ Completado |
| 8+     | Post-MVP features | 📋 Planificado |

**Versión actual:** MVP funcional y público

---

## 📊 Posicionamiento vs Competencia

| Aspecto | Coolors | Tonal Field | Ventaja |
| ------- | ------- | ----------- | ------- |
| Entrada rápida | ✅ | ⚠️ mejora | Coolors |
| Control real | ❌ | ✅ | TF |
| Sistema de color | ❌ | ✅ | TF |
| Accesibilidad | ❌ | ✅ | TF |
| Comunidad | Pasiva | Activa | TF |
| Dev friendliness | Media | Alta | TF |
| Diferenciación | Baja | Muy alta | TF |

**Veredicto:** Tonal Field es más inteligente y potente. El próximo paso es mejorar accesibilidad/claridad para nuevos usuarios.

---

## 🛠️ Stack técnico

* **Frontend:** Next.js 14 + TypeScript + React 18
* **Color space:** OKLCH (native, WCAG-aware)
* **Styling:** CSS + CSS variables
* **State management:** React hooks
* **Build:** Webpack (Next.js default)
* **Deploy:** Vercel (recomendado)

---

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/yourusername/tonal-field.git
cd tonal-field

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm run start
```

El servidor estará disponible en `http://localhost:3000`

---

## 📖 Documentación

Consulta [MVP.md](./MVP.md) para:

* Desglose detallado de sprints
* Evaluación estratégica
* Recomendaciones de UX
* Roadmap post-MVP

---

## 🎯 Próximas mejoras (Sprints 8+)

### Sprint 8 — Generación rápida y presets

* Shuffle automático con seed consistente
* Galería de presets populares
* Variaciones rápidas

### Sprint 9 — Lock por rol

* Fijar colores individuales
* Recalcular respetando locks
* UI intuitiva de bloqueo

### Sprint 10 — Importación desde imagen

* Upload de imagen
* Extracción de colores dominantes
* OCR opcional para tonos

### Sprint 11 — Exports ampliados

* RGB, HSL, LCH además de OKLCH/HEX
* Configs para más frameworks
* Plugins para diseño (Figma, Sketch, VS Code)

### Sprint 12 — Accesibilidad avanzada

* Auto-fix para AA/AAA en todos los roles
* Recomendaciones detalladas por par
* Simulación visual mejorada

### Sprint 13+ — AI y comunidad

* Sugerencias inteligentes por estilo
* Biblioteca pública de paletas
* Sistema de colaboración

---

## 🤝 Contribuir

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/mi-feature`)
3. Commit tus cambios (`git commit -m "Add mi-feature"`)
4. Push a la rama (`git push origin feature/mi-feature`)
5. Abre un Pull Request

Consulta [MVP.md](./MVP.md) para entender el roadmap y prioridades.

---

## 📄 Licencia

MIT

---

## 🙋 Soporte

Para reportar bugs o sugerir features:

* Issues en GitHub
* Email: [tu-email]
* Twitter: [@tonalfield]

---

## 🎓 Créditos

Tonal Field fue creado como herramienta educativa y profesional para diseño de sistemas de color.

**Basado en:**

* OKLCH color space (CSS Working Group)
* Material Design 3 tonal system
* WCAG 2.1 accessibility standards
* Color science best practices

---

**Made with ❤️ for designers and developers**
