# Plan de Reorganización del Field Studio

## Estado Actual

El Field Studio está contenido en un **archivo monolítico** (`app/studio/page.tsx`) de **2,500+ líneas** con:
- ~30 variables de estado
- Layout de 4 columnas CSS Grid
- Toda la lógica, estado y JSX mezclados

### Estructura Actual del Grid

```
┌─────────────┬──────────────────┬───────────────┬─────────────┐
│  COLUMNA 1  │    COLUMNA 2     │   COLUMNA 3   │  COLUMNA 4  │
│   300px     │     flexible     │    320px      │    280px    │
├─────────────┼──────────────────┼───────────────┼─────────────┤
│ Controles   │ Mood Field       │ Dual Theme    │ Usage       │
│ Energy      │ Pair A/B         │ Light/Dark    │ Preview     │
│ Tension     │ Palette Grid     │ Preview       │             │
│ Hue         │ (6 roles)        │ Contrast      │ Metrics     │
│             │                  │               │ Chroma      │
│ Spectrum    │ Tonal Palettes   │ Export        │ Hue diff    │
│ Kit Size    │ (collapsible)    │ Buttons       │ Lightness   │
│             │                  │               │ Score       │
│ Presets     │ Accessibility    │               │             │
│             │ (collapsible)    │               │ Contrast    │
│ Image       │                  │               │ Checks      │
│ Import      │ Hierarchy        │               │             │
└─────────────┴──────────────────┴───────────────┴─────────────┘
```

---

## Propuesta de Nueva Estructura

### Concepto: Flujo en 4 Pasos + Sidebar de Navegación

```
┌──────────────────────────────────────────────────────────────┐
│                    HEADER (sticky)                           │
│  [Logo] [Save] [Share] [Export ▼]        [Free] [Upgrade]   │
└──────────────────────────────────────────────────────────────┘
┌────────┬─────────────────────────────────────────────────────┐
│ SIDEBAR│                   CONTENIDO                         │
│ (nav)  │                                                     │
├────────┤  ┌─────────────────────────────────────────────────┐│
│        │  │ PASO 1: CONFIGURACIÓN INICIAL                  ││
│ ● Paso1│  │ ┌─────────────────┬─────────────────────────┐  ││
│ ○ Paso2│  │ │ Mood Field      │ Energy [====●====]      │  ││
│ ○ Paso3│  │ │ (canvas 2D)     │ Tension [===●=====]     │  ││
│ ○ Paso4│  │ │                 │ Hue [=====●====] [Auto] │  ││
│        │  │ │    ·            │                         │  ││
│        │  │ │                 │ Kit: [3] [5] [7]        │  ││
│        │  │ └─────────────────┴─────────────────────────┘  ││
│        │  │                                                 ││
│        │  │ [▸ Opciones Avanzadas]                         ││
│        │  │   └─ Spectrum Mode, Import Image, OCR          ││
│        │  │                                                 ││
│        │  │ ┌─ Inspiración ─────────────────────────────┐  ││
│        │  │ │ [Preset 1] [Preset 2] [Preset 3]          │  ││
│        │  │ │ [Preset 4] [Preset 5] [Preset 6]          │  ││
│        │  │ │ [📷 Importar imagen]                       │  ││
│        │  │ └───────────────────────────────────────────┘  ││
│        │  └─────────────────────────────────────────────────┘│
│        │                                                     │
│        │  ┌─────────────────────────────────────────────────┐│
│        │  │ PASO 2: PALETA GENERADA                        ││
│        │  │ ┌────────────────────────────────────────────┐ ││
│        │  │ │ Pair: [██ A] [██ B]    Variations: [grid]  │ ││
│        │  │ └────────────────────────────────────────────┘ ││
│        │  │ ┌──────────────────────────────────────────┐   ││
│        │  │ │ FONDOS        │ ACCIÓN        │ TEXTO    │   ││
│        │  │ │ [Background]  │ [Primary]     │ [Text]   │   ││
│        │  │ │ [Surface]     │ [Accent]      │ [Muted]  │   ││
│        │  │ │     🔒 lock   │     🔒 lock   │   🔒     │   ││
│        │  │ └──────────────────────────────────────────┘   ││
│        │  │                                                 ││
│        │  │ [▸ Paletas Tonales (Material Design 3)]        ││
│        │  │ [▸ Jerarquía y Uso (60-30-10)]                 ││
│        │  └─────────────────────────────────────────────────┘│
│        │                                                     │
│        │  ┌─────────────────────────────────────────────────┐│
│        │  │ PASO 3: PREVISUALIZACIÓN                       ││
│        │  │ [Light ◉] [Dark ○]                              ││
│        │  │ ┌─────────────────────────────────────────────┐││
│        │  │ │        Sample Card Preview                  │││
│        │  │ │   ┌─────────────────────────────────────┐   │││
│        │  │ │   │  Card Title                         │   │││
│        │  │ │   │  Description text here              │   │││
│        │  │ │   │  [Primary] [Secondary]              │   │││
│        │  │ │   └─────────────────────────────────────┘   │││
│        │  │ └─────────────────────────────────────────────┘││
│        │  │                                                 ││
│        │  │ ┌─ Contraste WCAG ─────────────────────────┐   ││
│        │  │ │ Text/Bg: 12.4:1 [AAA]  Text/Surf: 8.2:1 │   ││
│        │  │ │ Muted/Bg: 4.8:1 [AA]   Primary: 4.6:1   │   ││
│        │  │ └─────────────────────────────────────────┘   ││
│        │  │                                                 ││
│        │  │ [▸ Simulador de Daltonismo]                    ││
│        │  └─────────────────────────────────────────────────┘│
│        │                                                     │
│        │  ┌─────────────────────────────────────────────────┐│
│        │  │ PASO 4: MÉTRICAS Y EXPORTAR                    ││
│        │  │ ┌─ Métricas ───────────────────────────────┐   ││
│        │  │ │ Chroma: 0.15   │ Hue diff: 45°          │   ││
│        │  │ │ Lightness: 72% │ Vibration: Low         │   ││
│        │  │ │ Energy fit: 92% │ Tension fit: 88%      │   ││
│        │  │ │ ══════════════════════════ Score: 87    │   ││
│        │  │ └─────────────────────────────────────────┘   ││
│        │  │                                                 ││
│        │  │ ┌─ Exportar ───────────────────────────────┐   ││
│        │  │ │ [CSS] [JSON] [Tailwind] [MUI] [Figma]    │   ││
│        │  │ │ Format: [HEX ▼]  [📋 Copy] [⬇ Download]  │   ││
│        │  │ └─────────────────────────────────────────┘   ││
│        │  │                                                 ││
│        │  │ [🌐 Publicar en Comunidad]                      ││
│        │  └─────────────────────────────────────────────────┘│
└────────┴─────────────────────────────────────────────────────┘
```

---

## Plan de Implementación por Fases

### FASE 1: Quick Wins (Sin reestructurar el layout)
**Esfuerzo: Bajo | Impacto: Medio**

#### 1.1 Colapsar secciones por defecto
- [ ] Tonal Palettes → colapsado por defecto
- [ ] Accessibility & Color Blindness → colapsado
- [ ] Hierarchy → colapsado
- [ ] Agregar animación suave al expandir/colapsar

#### 1.2 Agrupar "Opciones Avanzadas"
- [ ] Crear un collapsible "Opciones Avanzadas" que contenga:
  - Spectrum Mode + Saturation slider
  - Auto hue toggle
  - Image import
- [ ] Mover import de imagen dentro del panel de opciones avanzadas

#### 1.3 Mejorar jerarquía visual
- [ ] Agregar subcabeceras a la paleta grid:
  - "Fondos" (Background, Surface)
  - "Acción" (Primary, Accent)
  - "Texto" (Text, Muted)
- [ ] Agregar tooltips contextuales a métricas (Chroma, Hue diff, etc.)

#### 1.4 Unificar previsualización Light/Dark
- [ ] Cambiar de side-by-side a tabs (Light | Dark)
- [ ] Mostrar solo un modo a la vez (reduce scroll)

**Archivos a modificar:**
- `app/studio/page.tsx` (principalmente JSX y estado de collapsibles)
- `app/globals.css` (estilos de tabs y tooltips)

---

### FASE 2: Reorganización del Layout
**Esfuerzo: Medio | Impacto: Alto**

#### 2.1 Agregar Sidebar de Navegación
- [ ] Crear componente `StudioSidebar.tsx`
- [ ] Implementar navegación con scroll-to-section
- [ ] Indicador de sección activa (intersection observer)
- [ ] Sticky positioning

#### 2.2 Mover acciones al Header
- [ ] Crear componente `StudioHeader.tsx`
- [ ] Mover botones: Save, Share, Export (dropdown)
- [ ] Mover indicador de plan (Free/Pro) y CTA de Upgrade
- [ ] Header sticky

#### 2.3 Reestructurar en Pasos
- [ ] Paso 1: Configuración (Field + Sliders + Presets)
- [ ] Paso 2: Paleta (Grid de roles + Tonal + Hierarchy)
- [ ] Paso 3: Previsualización (Preview + Contraste + Daltonismo)
- [ ] Paso 4: Métricas + Exportar

#### 2.4 Responsive mejorado
- [ ] Mobile: Pasos como accordion vertical
- [ ] Tablet: 2 columnas por paso
- [ ] Desktop: Layout actual optimizado

**Nuevos archivos:**
- `components/studio/StudioSidebar.tsx`
- `components/studio/StudioHeader.tsx`
- `components/studio/steps/ConfigStep.tsx`
- `components/studio/steps/PaletteStep.tsx`
- `components/studio/steps/PreviewStep.tsx`
- `components/studio/steps/ExportStep.tsx`

---

### FASE 3: Componentización
**Esfuerzo: Alto | Impacto: Alto (mantenibilidad)**

#### 3.1 Extraer componentes de UI
- [ ] `PaletteGrid.tsx` - Grid de 6 roles con locks
- [ ] `TonalPalettes.tsx` - Paletas Material Design 3
- [ ] `ContrastChecker.tsx` - Tabla de contraste WCAG
- [ ] `MetricsPanel.tsx` - Métricas con visualización
- [ ] `ColorBlindnessSimulator.tsx` - Simulador
- [ ] `ExportPanel.tsx` - Panel de exportación
- [ ] `PresetGrid.tsx` - Grid de presets
- [ ] `ImageImport.tsx` - Importación de imagen

#### 3.2 Extraer hooks personalizados
- [ ] `usePaletteGeneration.ts` - Lógica de generación
- [ ] `useColorLocks.ts` - Lógica de bloqueo de colores
- [ ] `useExport.ts` - Lógica de exportación
- [ ] `useUrlParams.ts` - Sincronización con URL

#### 3.3 Crear contexto compartido
- [ ] `StudioContext.tsx` - Estado global del studio
- [ ] Eliminar prop drilling

**Estructura de carpetas propuesta:**
```
components/
└── studio/
    ├── StudioSidebar.tsx
    ├── StudioHeader.tsx
    ├── steps/
    │   ├── ConfigStep.tsx
    │   ├── PaletteStep.tsx
    │   ├── PreviewStep.tsx
    │   └── ExportStep.tsx
    ├── palette/
    │   ├── PaletteGrid.tsx
    │   ├── TonalPalettes.tsx
    │   └── ColorSwatch.tsx
    ├── preview/
    │   ├── ThemePreview.tsx
    │   ├── ContrastChecker.tsx
    │   └── ColorBlindnessSimulator.tsx
    ├── metrics/
    │   └── MetricsPanel.tsx
    ├── export/
    │   ├── ExportPanel.tsx
    │   └── ExportButton.tsx
    └── controls/
        ├── PresetGrid.tsx
        └── ImageImport.tsx

hooks/
└── studio/
    ├── usePaletteGeneration.ts
    ├── useColorLocks.ts
    ├── useExport.ts
    └── useUrlParams.ts

contexts/
└── StudioContext.tsx
```

---

## Comparativa: Antes vs Después

| Aspecto | Antes | Después |
|---------|-------|---------|
| Scroll vertical | ~3000px | ~1800px (estimado) |
| Secciones visibles | Todas mezcladas | Organizadas por paso |
| Navegación | Solo scroll | Sidebar + scroll |
| Opciones avanzadas | Siempre visibles | Ocultas por defecto |
| Preview Light/Dark | Side-by-side | Tabs (uno a la vez) |
| Upgrade CTA | En medio del flujo | Header (no intrusivo) |
| Archivo principal | 2500+ líneas | ~500 líneas |
| Componentes | 4 básicos | 15+ especializados |

---

## Prioridad Recomendada

```
                    IMPACTO
                      ↑
         Alta │  FASE 2    │  FASE 3
              │ (Layout)   │ (Components)
              │            │
              ├────────────┼────────────
              │            │
         Baja │  FASE 1    │
              │ (Quick)    │
              └────────────┴──────────→
                Bajo       Alto    ESFUERZO
```

**Recomendación:**
1. Empezar con **Fase 1** (quick wins) para mejorar UX inmediatamente
2. Continuar con **Fase 2** (layout) para el cambio más visible
3. **Fase 3** (componentización) en paralelo o después, para mantenibilidad

---

## Estimación de Cambios por Fase

### Fase 1
- `app/studio/page.tsx`: ~200 líneas modificadas
- `app/globals.css`: ~50 líneas nuevas

### Fase 2
- `app/studio/page.tsx`: ~500 líneas refactorizadas
- 4-6 nuevos componentes
- `app/globals.css`: ~150 líneas nuevas

### Fase 3
- `app/studio/page.tsx`: reducido a ~500 líneas
- 15+ nuevos componentes
- 4+ hooks personalizados
- 1 contexto

---

## Notas Técnicas

### CSS Grid actual
```css
.field-grid {
  grid-template-columns: 300px 1fr 320px 280px;
}
```

### CSS Grid propuesto (Fase 2)
```css
.studio-layout {
  display: grid;
  grid-template-columns: 60px 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    "header header"
    "sidebar content";
  min-height: 100vh;
}

.studio-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  max-width: 1200px;
}

.studio-step {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}
```

### Intersection Observer para sidebar
```typescript
// Para detectar sección activa
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveStep(entry.target.id);
      }
    });
  },
  { threshold: 0.5 }
);
```
