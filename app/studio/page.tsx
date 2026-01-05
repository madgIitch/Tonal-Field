"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { Frame } from "@/components/Frame";
import { Field } from "@/components/Field";
import { Section } from "@/components/Section";
import { Slider } from "@/components/Slider";
import { generatePair } from "@/lib/color/model";
import { buildPalette, buildExtendedPalette } from "@/lib/color/palette";
import type { OKLCH } from "@/lib/color/oklch";
import { clamp, fromRgb, toCss } from "@/lib/color/oklch";
import {
  contrastRatio,
  fixPaletteContrast,
  fixPaletteContrastBasic,
  getContrastLevel,
  pickTextColor,
} from "@/lib/color/contrast";
import type { PaletteRole } from "@/lib/color/palette";
import {
  buildColorTokens,
  buildCssVariablesExtended,
  buildJsonTokens,
  buildMuiTheme,
  buildPluginPayload,
  buildTailwindConfig,
  buildMaterial3Json,
  buildTonalCssVariables,
  buildTonalTailwindConfig,
  buildFigmaPlugin,
  buildSketchPlugin,
  buildVSCodeTheme,
  buildAppleColorList,
} from "@/lib/color/export";
import type { TokenFormat } from "@/lib/color/export";
import { STANDARD_TONES } from "@/lib/color/tonal";
import { extractDominantColors } from "@/lib/color/extract";
import {
  simulateColorBlindness,
  analyzeTextBackgroundPairs,
  generateAccessibleAlternatives,
  type ColorBlindnessType,
  type PairAnalysis,
} from "@/lib/color/accessibility";
import { publishPalette } from "@/lib/community/service";
import type { MoodTag, StyleTag } from "@/lib/community/types";
import { MOOD_TAGS, STYLE_TAGS } from "@/lib/community/types";

const formatOklch = (color: OKLCH) =>
  `oklch(${Math.round(color.l * 100)}% ${color.c.toFixed(3)} ${Math.round(
    color.h
  )})`;

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

const swatchText = (color: OKLCH) =>
  color.l > 0.6 ? "oklch(20% 0.02 90)" : "oklch(98% 0.02 90)";

const formatRole = (role: PaletteRole) =>
  role.charAt(0).toUpperCase() + role.slice(1);

const variationOffsets = [-12, 0, 12];

const FULL_ROLES: PaletteRole[] = [
  "background",
  "surface",
  "primary",
  "accent",
  "text",
  "muted",
];

const PREVIEW_ROLES: PaletteRole[] = [
  "background",
  "surface",
  "primary",
  "text",
];

const TOKEN_FORMATS: { id: TokenFormat; label: string }[] = [
  { id: "hex", label: "HEX" },
  { id: "oklch", label: "OKLCH" },
  { id: "rgb", label: "RGB" },
  { id: "hsl", label: "HSL" },
  { id: "lch", label: "LCH" },
];

const PRESETS = [
  { id: "calm-sage", name: "Calm Sage", energy: 18, tension: 12 },
  { id: "soft-sand", name: "Soft Sand", energy: 28, tension: 22 },
  { id: "studio-blue", name: "Studio Blue", energy: 48, tension: 38 },
  { id: "vivid-citrus", name: "Vivid Citrus", energy: 72, tension: 55 },
  { id: "sharp-ink", name: "Sharp Ink", energy: 62, tension: 78 },
  { id: "neon-dusk", name: "Neon Dusk", energy: 80, tension: 68 },
];

const mapExtractedToRoles = (colors: OKLCH[]) => {
  if (!colors.length) {
    return {};
  }

  const byLightness = [...colors].sort((a, b) => a.l - b.l);
  const byChroma = [...colors].sort((a, b) => b.c - a.c);
  const background = byLightness[byLightness.length - 1];
  const surface = byLightness[Math.max(0, byLightness.length - 2)] ?? background;
  const text = byLightness[0];
  const primary = byChroma[0] ?? background;
  const accent = byChroma[1] ?? primary;

  const muted = [...colors].sort((a, b) => {
    const scoreA = Math.abs(a.l - 0.6) + a.c;
    const scoreB = Math.abs(b.l - 0.6) + b.c;
    return scoreA - scoreB;
  })[0];

  return {
    background,
    surface,
    text,
    primary,
    accent,
    muted: muted ?? surface,
  };
};

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const generateFromSeed = (seed: number) => {
  const rng = mulberry32(seed);
  return {
    energy: Math.round(rng() * 100),
    tension: Math.round(rng() * 100),
    hueBase: Math.round(rng() * 360),
  };
};

type ExportType =
  | "css"
  | "json"
  | "tailwind"
  | "mui"
  | "plugin"
  | "material3"
  | "tonal-css"
  | "tonal-tailwind"
  | "figma"
  | "sketch"
  | "vscode"
  | "apple-clr";

type SavedPalette = {
  id: string;
  energy: number;
  tension: number;
  hueBase?: number;
  hueAuto?: boolean;
  spectrumMode?: boolean;
  autoFix: boolean;
  createdAt: string;
};

type PaletteDisplayItem = {
  key: PaletteRole;
  label: string;
  color: OKLCH;
  proLocked?: boolean;
  userLocked?: boolean;
};

export default function StudioPage() {
  const [energy, setEnergy] = useState(45);
  const [tension, setTension] = useState(35);
  const [hueBase, setHueBase] = useState(220);
  const [hueAuto, setHueAuto] = useState(false);
  const [spectrumMode, setSpectrumMode] = useState(false);
  const [autoFix, setAutoFix] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [exportType, setExportType] = useState<ExportType>("css");
  const [tokenFormat, setTokenFormat] = useState<TokenFormat>("hex");
  const [copyNotice, setCopyNotice] = useState("");
  const [copyScope, setCopyScope] = useState<"" | "export" | "share" | "tokens">(
    ""
  );
  const [shareUrl, setShareUrl] = useState("");
  const [hasLoadedSeed, setHasLoadedSeed] = useState(false);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);
  const [seed, setSeed] = useState(4242);
  const [locks, setLocks] = useState<Partial<Record<PaletteRole, OKLCH>>>({});
  const [imagePreview, setImagePreview] = useState("");
  const [imageName, setImageName] = useState("");
  const [extractedColors, setExtractedColors] = useState<OKLCH[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [showTonalPalettes, setShowTonalPalettes] = useState(false);
  const [colorBlindnessMode, setColorBlindnessMode] = useState<ColorBlindnessType>("normal");
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishName, setPublishName] = useState("");
  const [publishDescription, setPublishDescription] = useState("");
  const [publishMoods, setPublishMoods] = useState<MoodTag[]>([]);
  const [publishStyles, setPublishStyles] = useState<StyleTag[]>([]);
  const maxFreeSaves = 2;
  const storageKey = "tonal-field:saved";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const energyParam = params.get("e");
    const tensionParam = params.get("t");
    const hueParam = params.get("h");
    const hueAutoParam = params.get("ha");
    const spectrumParam = params.get("sm");
    const autoFixSeed = params.get("af");
    const randomSeedParam = params.get("s");

    if (energyParam !== null) {
      const energySeed = Number(energyParam);
      if (!Number.isNaN(energySeed)) {
        setEnergy(clamp(energySeed, 0, 100));
      }
    }

    if (tensionParam !== null) {
      const tensionSeed = Number(tensionParam);
      if (!Number.isNaN(tensionSeed)) {
        setTension(clamp(tensionSeed, 0, 100));
      }
    }

    if (hueParam !== null) {
      const hueSeed = Number(hueParam);
      if (!Number.isNaN(hueSeed)) {
        setHueBase(clamp(hueSeed, 0, 360));
      }
    }

    if (hueAutoParam === "0" || hueAutoParam === "1") {
      setHueAuto(hueAutoParam === "1");
    }

    if (spectrumParam === "0" || spectrumParam === "1") {
      setSpectrumMode(spectrumParam === "1");
    }

    if (autoFixSeed === "0" || autoFixSeed === "1") {
      setAutoFix(autoFixSeed === "1");
    }

    if (randomSeedParam !== null) {
      const nextSeed = Number(randomSeedParam);
      if (!Number.isNaN(nextSeed)) {
        setSeed(Math.max(0, Math.round(nextSeed)));
      }
    }

    setHasLoadedSeed(true);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SavedPalette[];
        if (Array.isArray(parsed)) {
          setSavedPalettes(parsed);
        }
      } catch {
        setSavedPalettes([]);
      }
    }
    setHasLoadedStorage(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(savedPalettes));
  }, [hasLoadedStorage, savedPalettes, storageKey]);

  useEffect(() => {
    if (!hasLoadedSeed) {
      return;
    }
    const params = new URLSearchParams();
    params.set("e", String(Math.round(energy)));
    params.set("t", String(Math.round(tension)));
    params.set("h", String(Math.round(hueBase)));
    params.set("ha", hueAuto ? "1" : "0");
    params.set("sm", spectrumMode ? "1" : "0");
    params.set("af", autoFix ? "1" : "0");
    params.set("s", String(seed));
    const query = params.toString();
    const nextUrl = `${window.location.pathname}?${query}`;
    window.history.replaceState(null, "", nextUrl);
    setShareUrl(`${window.location.origin}${nextUrl}`);
  }, [autoFix, energy, hasLoadedSeed, tension, seed, hueBase, hueAuto, spectrumMode]);

  const resolveHueBase = useCallback(
    (energyValue: number, tensionValue: number) => {
      // If Spectrum mode is active, map Energy/Tension to hue wheel
      if (spectrumMode) {
        const x = clamp(energyValue, 0, 100) - 50;
        const y = clamp(tensionValue, 0, 100) - 50;
        if (Math.abs(x) + Math.abs(y) < 0.001) {
          return hueBase;
        }
        const angle = Math.atan2(y, x);
        return ((angle * 180) / Math.PI + 360) % 360;
      }

      // If Auto mode is active, let the model determine hue
      if (hueAuto) {
        return undefined;
      }

      // Otherwise use the manual hueBase value
      return hueBase;
    },
    [hueBase, hueAuto, spectrumMode]
  );

  const pair = useMemo(
    () => generatePair({ energy, tension, hueBase: resolveHueBase(energy, tension) }),
    [energy, tension, resolveHueBase]
  );

  const presetSwatches = useMemo(
    () =>
      PRESETS.map((preset) => {
        const presetPair = generatePair({
          energy: preset.energy,
          tension: preset.tension,
          hueBase: resolveHueBase(preset.energy, preset.tension),
        });
        return {
          ...preset,
          gradient: `linear-gradient(135deg, ${toCss(presetPair.a)} 0 50%, ${toCss(
            presetPair.b
          )} 50% 100%)`,
        };
      }),
    [resolveHueBase]
  );

  const basePalette = useMemo(() => buildPalette(pair), [pair]);
  const extendedPalette = useMemo(() => buildExtendedPalette(pair), [pair]);

  // Apply color blindness simulation if active
  const simulatedPalette = useMemo(() => {
    if (colorBlindnessMode === "normal") return basePalette;

    const simulated: typeof basePalette = {} as typeof basePalette;
    (Object.keys(basePalette) as PaletteRole[]).forEach((role) => {
      simulated[role] = simulateColorBlindness(basePalette[role], colorBlindnessMode);
    });
    return simulated;
  }, [basePalette, colorBlindnessMode]);

  // Accessibility analysis
  const accessibilityAnalysis = useMemo(() => {
    return analyzeTextBackgroundPairs(basePalette);
  }, [basePalette]);

  const paletteSeed = useMemo(() => {
    const next = { ...basePalette };
    (Object.entries(locks) as [PaletteRole, OKLCH][]).forEach(([role, color]) => {
      if (color) {
        next[role] = color;
      }
    });
    return next;
  }, [basePalette, locks]);

  const autoFixResult = useMemo(() => {
    if (autoFix) {
      return isPro
        ? fixPaletteContrast(paletteSeed)
        : fixPaletteContrastBasic(paletteSeed);
    }

    return {
      palette: paletteSeed,
      primaryText: pickTextColor(paletteSeed.primary).color,
    };
  }, [autoFix, isPro, paletteSeed]);

  const palette = useMemo(() => {
    const next = { ...autoFixResult.palette };
    (Object.entries(locks) as [PaletteRole, OKLCH][]).forEach(([role, color]) => {
      if (color) {
        next[role] = color;
      }
    });
    return next;
  }, [autoFixResult.palette, locks]);

  const primaryText = useMemo(() => {
    if (locks.primary) {
      return pickTextColor(locks.primary).color;
    }
    return autoFixResult.primaryText;
  }, [autoFixResult.primaryText, locks]);

  const swatchA = toCss(pair.a);
  const swatchB = toCss(pair.b);
  const swatchTextA = swatchText(pair.a);
  const swatchTextB = swatchText(pair.b);

  const fieldBackground = useMemo(
    () =>
      `radial-gradient(280px circle at 20% 30%, ${swatchA}, transparent 65%),
      radial-gradient(260px circle at 80% 70%, ${swatchB}, transparent 70%),
      color-mix(in oklch, var(--surface), white 25%)`,
    [swatchA, swatchB]
  );

  const paletteStyles = useMemo(
    () => ({
      background: toCss(palette.background),
      surface: toCss(palette.surface),
      text: toCss(palette.text),
      muted: toCss(palette.muted),
      primary: toCss(palette.primary),
      primaryText: toCss(primaryText),
      accent: toCss(palette.accent),
    }),
    [palette, primaryText]
  );

  const paletteDisplay = useMemo(() => {
    const roles = isPro ? FULL_ROLES : PREVIEW_ROLES;
    const locked: PaletteRole[] = isPro ? [] : ["accent", "muted"];

    const visible: PaletteDisplayItem[] = roles.map((role) => ({
      key: role,
      label: formatRole(role),
      color: palette[role],
      userLocked: Boolean(locks[role]),
    }));

    const lockedItems: PaletteDisplayItem[] = locked.map((role) => ({
      key: role,
      label: formatRole(role),
      color: palette[role],
      proLocked: true,
    }));

    return [...visible, ...lockedItems];
  }, [isPro, locks, palette]);

  const exportRoles = isPro ? FULL_ROLES : PREVIEW_ROLES;
  const colorTokens = useMemo(
    () => buildColorTokens(palette, exportRoles, tokenFormat),
    [exportRoles, palette, tokenFormat]
  );
  const tokenCopyText = useMemo(
    () =>
      colorTokens.map((token) => `${token.label}: ${token.value}`).join("\n"),
    [colorTokens]
  );

  const exportContent = useMemo(() => {
    switch (exportType) {
      case "css":
        return buildCssVariablesExtended(palette, FULL_ROLES);
      case "json":
        return buildJsonTokens(palette, FULL_ROLES);
      case "tailwind":
        return buildTailwindConfig(palette, FULL_ROLES);
      case "mui":
        return buildMuiTheme(palette);
      case "plugin":
        return buildPluginPayload(palette, FULL_ROLES);
      case "material3":
        return buildMaterial3Json(extendedPalette);
      case "tonal-css":
        return buildTonalCssVariables(extendedPalette.tonal);
      case "tonal-tailwind":
        return buildTonalTailwindConfig(extendedPalette.tonal);
      case "figma":
        return buildFigmaPlugin(extendedPalette);
      case "sketch":
        return buildSketchPlugin(palette, FULL_ROLES);
      case "vscode":
        return buildVSCodeTheme(extendedPalette);
      case "apple-clr":
        return buildAppleColorList(palette, FULL_ROLES);
      default:
        return buildCssVariablesExtended(palette, FULL_ROLES);
    }
  }, [exportType, palette, extendedPalette]);

  const savedCount = savedPalettes.length;
  const canSave = isPro || savedCount < maxFreeSaves;

  const handleSave = () => {
    if (!canSave) {
      return;
    }

    const entry: SavedPalette = {
      id: `${Date.now()}`,
      energy,
      tension,
      hueBase,
      hueAuto,
      spectrumMode,
      autoFix,
      createdAt: new Date().toISOString(),
    };

    setSavedPalettes((prev) => [entry, ...prev]);
  };

  const handleShuffle = useCallback(() => {
    const next = generateFromSeed(seed);
    setEnergy(next.energy);
    setTension(next.tension);
    setHueBase(next.hueBase);
    setSeed((value) => Math.max(0, Math.round(value + 1)));
  }, [seed]);

  const handleToggleLock = (role: PaletteRole, color: OKLCH) => {
    setLocks((prev) => {
      const next = { ...prev };
      if (next[role]) {
        delete next[role];
      } else {
        next[role] = { ...color };
      }
      return next;
    });
  };

  const handleClearLocks = () => {
    setLocks({});
  };

  const handleApplyExtracted = () => {
    if (!extractedColors.length) {
      return;
    }
    const mapped = mapExtractedToRoles(extractedColors);
    setLocks((prev) => ({ ...mapped, ...prev }));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setExtractError("");
    setIsExtracting(true);
    setExtractedColors([]);
    setImageName(file.name);

    const objectUrl = URL.createObjectURL(file);
    setImagePreview((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return objectUrl;
    });

    const img = new Image();
    img.onload = () => {
      const maxSize = 260;
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setExtractError("Canvas not available");
        setIsExtracting(false);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const data = ctx.getImageData(0, 0, width, height);
      const colors = extractDominantColors(data, 6);
      const parsed = colors.map((color) => fromRgb(color));
      setExtractedColors(parsed);
      setIsExtracting(false);
    };
    img.onerror = () => {
      setExtractError("Image load failed");
      setIsExtracting(false);
    };
    img.src = objectUrl;
  };

  const handleUpgrade = () => {
    setIsPro(true);
  };

  const handleLoad = (entry: SavedPalette) => {
    setEnergy(entry.energy);
    setTension(entry.tension);
    if (typeof entry.hueBase === "number") {
      setHueBase(entry.hueBase);
    }
    if (typeof entry.hueAuto === "boolean") {
      setHueAuto(entry.hueAuto);
    }
    if (typeof entry.spectrumMode === "boolean") {
      setSpectrumMode(entry.spectrumMode);
    }
    setAutoFix(entry.autoFix);
  };

  const handleDelete = (id: string) => {
    setSavedPalettes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCopy = async (
    text: string,
    notice: string,
    scope: "export" | "share" | "tokens"
  ) => {
    if (!navigator.clipboard) {
      setCopyScope(scope);
      setCopyNotice("Clipboard unavailable");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyScope(scope);
      setCopyNotice(notice);
      window.setTimeout(() => {
        setCopyNotice("");
        setCopyScope("");
      }, 1500);
    } catch {
      setCopyScope(scope);
      setCopyNotice("Copy failed");
    }
  };

  const handleDownload = () => {
    const filename = (() => {
      switch (exportType) {
        case "css":
        case "tonal-css":
          return "tonal-field.css";
        case "json":
        case "material3":
        case "plugin":
          return "tonal-field.json";
        case "tailwind":
        case "tonal-tailwind":
          return "tailwind.config.js";
        case "mui":
          return "theme.ts";
        case "figma":
          return "tonal-field-figma.json";
        case "sketch":
          return "tonal-field.sketch.json";
        case "vscode":
          return "tonal-field-theme.json";
        case "apple-clr":
          return "tonal-field.clr.json";
        default:
          return "tonal-field.txt";
      }
    })();

    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setCopyScope("export");
    setCopyNotice("Downloaded");
    window.setTimeout(() => {
      setCopyNotice("");
      setCopyScope("");
    }, 1500);
  };

  const handlePublish = () => {
    if (!publishName.trim()) {
      alert("Please enter a name for your palette");
      return;
    }

    if (publishMoods.length === 0) {
      alert("Please select at least one mood tag");
      return;
    }

    try {
      publishPalette({
        name: publishName.trim(),
        description: publishDescription.trim() || undefined,
        palette: palette,
        parameters: {
          energy,
          tension,
          hueBase,
          hueAuto,
          spectrumMode,
        },
        tags: {
          mood: publishMoods,
          style: publishStyles,
        },
      });

      // Reset form
      setPublishName("");
      setPublishDescription("");
      setPublishMoods([]);
      setPublishStyles([]);
      setShowPublishModal(false);

      // Show success message
      setCopyScope("share");
      setCopyNotice("Published to community!");
      window.setTimeout(() => {
        setCopyNotice("");
        setCopyScope("");
      }, 2000);
    } catch (error) {
      alert("Failed to publish palette. Please try again.");
      console.error(error);
    }
  };

  const handleTogglePublishMood = (mood: MoodTag) => {
    setPublishMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const handleTogglePublishStyle = (style: StyleTag) => {
    setPublishStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const lockedRoles = useMemo(() => Object.keys(locks) as PaletteRole[], [locks]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      event.preventDefault();
      handleShuffle();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleShuffle]);

  const contrastChecks = useMemo(() => {
    const items = [
      {
        key: "text-bg",
        label: "Text on background",
        foreground: palette.text,
        background: palette.background,
      },
      {
        key: "text-surface",
        label: "Text on surface",
        foreground: palette.text,
        background: palette.surface,
      },
      {
        key: "muted-bg",
        label: "Muted on background",
        foreground: palette.muted,
        background: palette.background,
      },
      {
        key: "primary",
        label: "Primary text on primary",
        foreground: primaryText,
        background: palette.primary,
      },
      {
        key: "accent",
        label: "Accent on background",
        foreground: palette.accent,
        background: palette.background,
      },
    ];

    return items.map((item) => {
      const ratio = contrastRatio(item.foreground, item.background);
      return {
        ...item,
        ratio,
        level: getContrastLevel(ratio),
      };
    });
  }, [palette, primaryText]);

  const variations = useMemo(() => {
    return variationOffsets.flatMap((yOffset) =>
      variationOffsets.map((xOffset) => {
        const nextEnergy = clamp(energy + xOffset, 0, 100);
        const nextTension = clamp(tension + yOffset, 0, 100);
        const nextPair = generatePair({
          energy: nextEnergy,
          tension: nextTension,
          hueBase: resolveHueBase(nextEnergy, nextTension),
        });

        return {
          key: `${nextEnergy}-${nextTension}`,
          energy: Math.round(nextEnergy),
          tension: Math.round(nextTension),
          gradient: `linear-gradient(135deg, ${toCss(nextPair.a)} 0 50%, ${toCss(
            nextPair.b
          )} 50% 100%)`,
        };
      })
    );
  }, [energy, tension, resolveHueBase]);

  return (
    <Frame>
      <div className="page">
        <Section
          id="field"
          className="reveal"
          title="Field Studio"
          subtitle="Tune Energy and Tension to generate palette kits."
        >
          <div className="field-grid">
            <div className="panel panel-controls">
              <div className="panel-title">Energy + Tension</div>
              <div className="controls-toolbar">
                <button
                  type="button"
                  className="shuffle-btn"
                  onClick={handleShuffle}
                >
                  Shuffle
                  <span className="key-hint">Space</span>
                </button>
                <button
                  type="button"
                  className="shuffle-btn"
                  onClick={() => setShowPublishModal(true)}
                  style={{ marginLeft: "8px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)" }}
                >
                  📤 Publish
                </button>
                <div className="seed-field">
                  <label className="seed-label" htmlFor="seed-input">
                    Seed
                  </label>
                  <input
                    id="seed-input"
                    className="seed-input"
                    type="number"
                    min={0}
                    value={seed}
                    onChange={(event) => {
                      const nextSeed = Number(event.target.value);
                      setSeed(
                        Number.isNaN(nextSeed)
                          ? 0
                          : Math.max(0, Math.round(nextSeed))
                      );
                    }}
                  />
                </div>
                <div className="seed-hint">Same seed = same result.</div>
              </div>
              <div className="controls">
                <Slider
                  label="Energy"
                  description="Calm to vivid"
                  value={energy}
                  minLabel="Calm"
                  maxLabel="Vivid"
                  onChange={setEnergy}
                />
                <Slider
                  label="Tension"
                  description="Soft to sharp"
                  value={tension}
                  minLabel="Soft"
                  maxLabel="Sharp"
                  onChange={setTension}
                />
                <Slider
                  label="Hue base"
                  description={
                    hueAuto
                      ? "Auto mode (driven by Energy/Tension)"
                      : spectrumMode
                      ? "Overridden by Spectrum mode"
                      : "Manual anchor 0 to 360"
                  }
                  value={hueBase}
                  min={0}
                  max={360}
                  step={1}
                  minLabel="0"
                  maxLabel="360"
                  onChange={setHueBase}
                  disabled={hueAuto || spectrumMode}
                />
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={hueAuto}
                    onChange={(event) => {
                      const isAuto = event.target.checked;
                      setHueAuto(isAuto);
                      if (isAuto) {
                        setSpectrumMode(false);
                      }
                    }}
                  />
                  <span>Auto (let Energy/Tension drive hue)</span>
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={spectrumMode}
                    onChange={(event) => {
                      const isSpectrum = event.target.checked;
                      setSpectrumMode(isSpectrum);
                      if (isSpectrum) {
                        setHueAuto(false);
                      }
                    }}
                  />
                  <span>Spectrum mode (map field to full hue wheel)</span>
                </label>
              </div>
              <div className="preset-block">
                <div className="preset-header">
                  <div className="preset-title">Presets</div>
                  <div className="preset-note">Popular moods</div>
                </div>
                <div className="preset-grid">
                  {presetSwatches.map((preset) => {
                    const isActive =
                      preset.energy === energy && preset.tension === tension;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        className={`preset-btn${
                          isActive ? " preset-active" : ""
                        }`}
                        onClick={() => {
                          setEnergy(preset.energy);
                          setTension(preset.tension);
                        }}
                      >
                        <span
                          className="preset-swatch"
                          style={{ background: preset.gradient }}
                        />
                        <span className="preset-name">{preset.name}</span>
                        <span className="preset-values">
                          {preset.energy}/{preset.tension}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="import-block">
                <div className="preset-header">
                  <div className="preset-title">Image import</div>
                  <div className="preset-note">Extract palette</div>
                </div>
                <input
                  className="import-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <label className="toggle toggle-inline">
                  <input type="checkbox" disabled />
                  <span>OCR (coming soon)</span>
                </label>
                {imagePreview ? (
                  <div className="import-preview">
                    <img src={imagePreview} alt="Uploaded preview" />
                    <span>{imageName}</span>
                  </div>
                ) : (
                  <div className="import-placeholder">No image loaded.</div>
                )}
                {isExtracting ? (
                  <div className="import-status">Extracting colors...</div>
                ) : null}
                {extractError ? (
                  <div className="import-error">{extractError}</div>
                ) : null}
                {extractedColors.length ? (
                  <div className="import-results">
                    <div className="import-swatches">
                      {extractedColors.map((color, index) => (
                        <span
                          key={`${color.h}-${index}`}
                          className="import-swatch"
                          style={{ background: toCss(color) }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="import-apply"
                      onClick={handleApplyExtracted}
                    >
                      Apply to palette
                    </button>
                  </div>
                ) : null}
              </div>
              {lockedRoles.length ? (
                <div className="lock-summary">
                  <span>Locked: {lockedRoles.map(formatRole).join(", ")}</span>
                  <button
                    type="button"
                    className="lock-clear"
                    onClick={handleClearLocks}
                  >
                    Clear locks
                  </button>
                </div>
              ) : null}
            </div>

            <div className="panel panel-preview">
              <div className="panel-title">Palette Kit</div>
              <div className="field-block">
                <div className="field-header">
                  <div className="field-title">Mood Field</div>
                  <div className="field-values">
                    <span>Energy {energy}</span>
                    <span>Tension {tension}</span>
                    <span>
                      Hue {Math.round(resolveHueBase(energy, tension) ?? 0)}
                    </span>
                    {hueAuto ? <span>Auto</span> : null}
                    {spectrumMode ? <span>Spectrum</span> : null}
                  </div>
                </div>
                <Field
                  energy={energy}
                  tension={tension}
                  background={fieldBackground}
                  onChange={({ energy: nextEnergy, tension: nextTension }) => {
                    setEnergy(nextEnergy);
                    setTension(nextTension);
                  }}
                  spectrumMode={spectrumMode}
                />
                <div className="variation-grid">
                  {variations.map((variant) => (
                    <div
                      key={variant.key}
                      className="variation-swatch"
                      style={{ background: variant.gradient }}
                    >
                      <span className="variation-label">
                        {variant.energy}/{variant.tension}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pair pair-compact">
                <div
                  className="swatch"
                  style={{ background: swatchA, color: swatchTextA }}
                >
                  <div className="swatch-label">A</div>
                  <div className="swatch-value">{formatOklch(pair.a)}</div>
                </div>
                <div
                  className="swatch"
                  style={{ background: swatchB, color: swatchTextB }}
                >
                  <div className="swatch-label">B</div>
                  <div className="swatch-value">{formatOklch(pair.b)}</div>
                </div>
              </div>
              <div className="palette-grid">
                {paletteDisplay.map((item) => (
                  <div
                    key={item.key}
                    className={[
                      "palette-swatch",
                      item.proLocked ? "palette-locked" : "",
                      item.userLocked ? "palette-user-locked" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={{
                      background: toCss(item.color),
                      color: swatchText(item.color),
                    }}
                  >
                    <div className="palette-role">{item.label}</div>
                    <div className="palette-value">{formatOklch(item.color)}</div>
                    {item.proLocked ? <div className="locked-pill">Pro</div> : null}
                    {!item.proLocked ? (
                      <button
                        type="button"
                        className={`lock-btn${item.userLocked ? " is-locked" : ""}`}
                        onClick={() => handleToggleLock(item.key, item.color)}
                      >
                        {item.userLocked ? "Locked" : "Lock"}
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Material Design 3 Tonal Palettes Section */}
              <div className="tonal-palettes-section" style={{ marginTop: "32px" }}>
                <div className="panel-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Tonal Palettes (Material Design 3)</span>
                  <button
                    type="button"
                    className="shuffle-btn"
                    style={{ fontSize: "12px", padding: "4px 12px" }}
                    onClick={() => setShowTonalPalettes(!showTonalPalettes)}
                  >
                    {showTonalPalettes ? "Hide" : "Show"}
                  </button>
                </div>
                {showTonalPalettes && extendedPalette.tonal ? (
                  <div style={{ display: "grid", gap: "24px", marginTop: "16px" }}>
                    {Object.entries(extendedPalette.tonal).map(([paletteName, tones]) => (
                      <div key={paletteName} className="tonal-palette-row">
                        <div className="tonal-palette-label" style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          marginBottom: "8px",
                          textTransform: "capitalize"
                        }}>
                          {paletteName}
                        </div>
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
                          gap: "4px"
                        }}>
                          {STANDARD_TONES.map((tone) => {
                            const color = tones[tone];
                            if (!color) return null;
                            return (
                              <div
                                key={tone}
                                style={{
                                  background: toCss(color),
                                  color: tone <= 50 ? "white" : "black",
                                  padding: "12px 8px",
                                  borderRadius: "6px",
                                  fontSize: "11px",
                                  textAlign: "center",
                                  fontWeight: 500,
                                  border: "1px solid rgba(0,0,0,0.1)",
                                }}
                              >
                                {tone}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Accessibility Section */}
              <div className="accessibility-section" style={{ marginTop: "32px" }}>
                <div className="panel-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Accessibility & Color Blindness</span>
                  <button
                    type="button"
                    className="shuffle-btn"
                    style={{ fontSize: "12px", padding: "4px 12px" }}
                    onClick={() => setShowAccessibility(!showAccessibility)}
                  >
                    {showAccessibility ? "Hide" : "Show"}
                  </button>
                </div>
                {showAccessibility ? (
                  <div style={{ display: "grid", gap: "24px", marginTop: "16px" }}>
                    {/* Color Blindness Simulator */}
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>
                        Color Blindness Simulation
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px", marginBottom: "16px" }}>
                        {(["normal", "protanopia", "deuteranopia", "tritanopia"] as ColorBlindnessType[]).map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`export-btn${colorBlindnessMode === type ? " export-active" : ""}`}
                            style={{ fontSize: "12px", padding: "8px 12px" }}
                            onClick={() => setColorBlindnessMode(type)}
                          >
                            {type === "normal" ? "Normal" :
                             type === "protanopia" ? "Protanopia (Red-blind)" :
                             type === "deuteranopia" ? "Deuteranopia (Green-blind)" :
                             "Tritanopia (Blue-blind)"}
                          </button>
                        ))}
                      </div>
                      {colorBlindnessMode !== "normal" ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
                          {FULL_ROLES.map((role) => {
                            const original = basePalette[role];
                            const simulated = simulateColorBlindness(original, colorBlindnessMode);
                            return (
                              <div key={role} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "capitalize", marginBottom: "4px" }}>
                                  {role}
                                </div>
                                <div style={{
                                  background: toCss(original),
                                  color: swatchText(original),
                                  padding: "12px",
                                  borderRadius: "6px",
                                  fontSize: "10px",
                                  textAlign: "center",
                                  border: "1px solid rgba(0,0,0,0.1)"
                                }}>
                                  Original
                                </div>
                                <div style={{
                                  background: toCss(simulated),
                                  color: swatchText(simulated),
                                  padding: "12px",
                                  borderRadius: "6px",
                                  fontSize: "10px",
                                  textAlign: "center",
                                  border: "1px solid rgba(0,0,0,0.1)"
                                }}>
                                  Simulated
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>

                    {/* Contrast Analysis */}
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>
                        Text/Background Contrast Analysis
                      </div>
                      <div style={{ display: "grid", gap: "12px" }}>
                        {accessibilityAnalysis.map((analysis, idx) => {
                          const { contrast, recommendations } = analysis;
                          const passesAA = contrast.passes.AA;
                          const passesAAA = contrast.passes.AAA;

                          return (
                            <div key={idx} style={{
                              padding: "16px",
                              background: "rgba(0,0,0,0.03)",
                              borderRadius: "8px",
                              border: `2px solid ${passesAAA ? "#22c55e" : passesAA ? "#eab308" : "#ef4444"}`
                            }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                <div style={{ fontSize: "12px", fontWeight: 600 }}>
                                  {analysis.foregroundRole} / {analysis.backgroundRole}
                                </div>
                                <div style={{
                                  fontSize: "11px",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  background: passesAAA ? "#22c55e" : passesAA ? "#eab308" : "#ef4444",
                                  color: "white",
                                  fontWeight: 600
                                }}>
                                  {contrast.level.toUpperCase()} - {contrast.ratio.toFixed(2)}:1
                                </div>
                              </div>

                              <div style={{ display: "flex", gap: "12px", marginBottom: recommendations ? "12px" : "0" }}>
                                <div style={{
                                  flex: 1,
                                  background: toCss(analysis.background),
                                  color: toCss(analysis.foreground),
                                  padding: "12px",
                                  borderRadius: "6px",
                                  fontSize: "11px",
                                  textAlign: "center",
                                  fontWeight: 500
                                }}>
                                  Sample Text
                                </div>
                                <div style={{ flex: 1, display: "grid", gap: "4px", fontSize: "10px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span>{passesAA ? "✓" : "✗"}</span>
                                    <span>WCAG AA (4.5:1)</span>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span>{passesAAA ? "✓" : "✗"}</span>
                                    <span>WCAG AAA (7:1)</span>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span>{contrast.passes.AALarge ? "✓" : "✗"}</span>
                                    <span>AA Large (3:1)</span>
                                  </div>
                                </div>
                              </div>

                              {recommendations ? (
                                <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "12px" }}>
                                  <div style={{ fontSize: "11px", fontWeight: 600, marginBottom: "8px" }}>
                                    Recommended Adjustments:
                                  </div>
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                    <div>
                                      <div style={{ fontSize: "10px", marginBottom: "4px" }}>AA Compliant:</div>
                                      <div style={{
                                        background: toCss(analysis.background),
                                        color: toCss(recommendations.aa),
                                        padding: "8px",
                                        borderRadius: "4px",
                                        fontSize: "10px",
                                        textAlign: "center"
                                      }}>
                                        L: {Math.round(recommendations.aa.l * 100)}%
                                      </div>
                                    </div>
                                    <div>
                                      <div style={{ fontSize: "10px", marginBottom: "4px" }}>AAA Compliant:</div>
                                      <div style={{
                                        background: toCss(analysis.background),
                                        color: toCss(recommendations.aaa),
                                        padding: "8px",
                                        borderRadius: "4px",
                                        fontSize: "10px",
                                        textAlign: "center"
                                      }}>
                                        L: {Math.round(recommendations.aaa.l * 100)}%
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="palette-preview">
                <div className="panel-title">Usage preview</div>
                <div
                  className={`ui-preview${isPro ? "" : " preview-locked"}`}
                  style={{
                    background: paletteStyles.background,
                    color: paletteStyles.text,
                  }}
                >
                  <div
                    className="ui-card"
                    style={{ background: paletteStyles.surface }}
                  >
                    <span
                      className="ui-chip"
                      style={{
                        background: paletteStyles.muted,
                        color: paletteStyles.text,
                      }}
                    >
                      Muted label
                    </span>
                    <h3 className="ui-title">Interface sample</h3>
                    <p className="ui-body">
                      Primary actions use the main tone. Accent highlights secondary
                      emphasis.
                    </p>
                    <div className="ui-actions">
                      <button
                        className="ui-btn ui-primary"
                        style={{
                          background: paletteStyles.primary,
                          color: paletteStyles.primaryText,
                        }}
                        type="button"
                      >
                        Primary action
                      </button>
                      <button
                        className="ui-btn ui-ghost"
                        style={{
                          borderColor: paletteStyles.accent,
                          color: paletteStyles.accent,
                        }}
                        type="button"
                      >
                        Accent link
                      </button>
                    </div>
                  </div>
                  {!isPro ? (
                    <div className="upgrade-overlay">
                      <div>
                        Unlock full kit previews and advanced exports with Pro.
                      </div>
                      <button
                        type="button"
                        className="upgrade-btn"
                        onClick={handleUpgrade}
                      >
                        Upgrade
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="panel panel-metrics">
              <div className="panel-title">Metrics</div>
              <div className="metrics">
                <div className="metric">
                  <span>Chroma</span>
                  <span>{pair.metrics.chroma.toFixed(3)}</span>
                </div>
                <div className="metric">
                  <span>Hue diff</span>
                  <span>{Math.round(pair.metrics.hueDiff)} deg</span>
                </div>
                <div className="metric">
                  <span>Lightness</span>
                  <span>{pair.metrics.lightnessContrast.toFixed(2)}</span>
                </div>
                <div className="metric">
                  <span>Vibration</span>
                  <span>{pair.metrics.vibration.toFixed(2)}</span>
                </div>
                <div className="metric">
                  <span>Energy fit</span>
                  <span>{formatPercent(pair.metrics.energyFit)}</span>
                </div>
                <div className="metric">
                  <span>Tension fit</span>
                  <span>{formatPercent(pair.metrics.tensionFit)}</span>
                </div>
              </div>
              <div className="score">
                <div className="score-header">
                  <span>Unified score</span>
                  <span>{formatPercent(pair.metrics.score)}</span>
                </div>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{ width: formatPercent(pair.metrics.score) }}
                  />
                </div>
              </div>
              <div className="contrast">
                <div className="panel-title">Accessibility</div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={autoFix}
                    onChange={(event) => setAutoFix(event.target.checked)}
                  />
                  <span>
                    Fix contrast {isPro ? "(advanced)" : "(basic)"}
                  </span>
                </label>
                {!isPro ? (
                  <div className="upgrade-hint">
                    Pro unlocks advanced auto-fix for accent and muted roles.
                  </div>
                ) : null}
                <div className="contrast-list">
                  {contrastChecks.map((item) => (
                    <div key={item.key} className="contrast-item">
                      <span>{item.label}</span>
                      <span className={`badge badge-${item.level.toLowerCase()}`}>
                        {item.level}
                      </span>
                      <span className="contrast-value">
                        {item.ratio.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
                <div className="export" id="export">
                  <div className="panel-title">Export</div>
                  <div className="export-block">
                  <div className="export-title">Tokens</div>
                  <div className="export-options">
                    {TOKEN_FORMATS.map((format) => (
                      <button
                        key={format.id}
                        className={`export-btn${
                          tokenFormat === format.id ? " export-active" : ""
                        }`}
                        type="button"
                        onClick={() => setTokenFormat(format.id)}
                      >
                        {format.label}
                      </button>
                    ))}
                  </div>
                  <div className="export-grid">
                    {colorTokens.map((token) => (
                      <div key={token.role} className="export-token">
                        <span>{token.label}</span>
                        <span>{token.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="export-toolbar">
                    <button
                      className="copy-btn"
                      type="button"
                      onClick={() =>
                        handleCopy(tokenCopyText, "Tokens copied", "tokens")
                      }
                    >
                      Copy tokens
                    </button>
                    {copyNotice && copyScope === "tokens" ? (
                      <span className="copy-status">{copyNotice}</span>
                    ) : null}
                  </div>
                </div>
                <div className={`export-block${isPro ? "" : " export-locked"}`}>
                  <div className="export-title">Pro exports</div>
                  <div className="export-options">
                    <button
                      className={`export-btn${exportType === "css" ? " export-active" : ""}`}
                      type="button"
                      disabled={!isPro}
                      onClick={() => setExportType("css")}
                    >
                      CSS variables
                    </button>
                    <button
                      className={`export-btn${exportType === "json" ? " export-active" : ""}`}
                      type="button"
                      disabled={!isPro}
                      onClick={() => setExportType("json")}
                    >
                      JSON tokens
                    </button>
                    <button
                      className={`export-btn${exportType === "tailwind" ? " export-active" : ""}`}
                      type="button"
                      disabled={!isPro}
                      onClick={() => setExportType("tailwind")}
                    >
                      Tailwind config
                    </button>
                    <button
                      className={`export-btn${exportType === "mui" ? " export-active" : ""}`}
                      type="button"
                      disabled={!isPro}
                      onClick={() => setExportType("mui")}
                    >
                      Material UI
                    </button>
                    <button
                      className={`export-btn${exportType === "plugin" ? " export-active" : ""}`}
                      type="button"
                      disabled={!isPro}
                      onClick={() => setExportType("plugin")}
                    >
                      Plugin JSON
                    </button>
                  </div>
                  <div className="export-title" style={{ marginTop: "20px" }}>
                    Material Design 3 (Tonal Palettes)
                  </div>
                  <div className="export-options">
                    <button
                      className={`export-btn${exportType === "material3" ? " export-active" : ""}`}
                      type="button"
                      disabled={!isPro}
                      onClick={() => setExportType("material3")}
                    >
                      Material 3 JSON
                    </button>
                    <button
                      className={`export-btn${exportType === "tonal-css" ? " export-active" : ""}`}
                      type="button"
                      disabled={!isPro}
                      onClick={() => setExportType("tonal-css")}
                    >
                      Tonal CSS
                    </button>
                    <button
                      className={`export-btn${exportType === "tonal-tailwind" ? " export-active" : ""}`}
                      type="button"
                      disabled={!isPro}
                      onClick={() => setExportType("tonal-tailwind")}
                    >
                      Tonal Tailwind
                    </button>
                  </div>
                  <div className="export-title" style={{ marginTop: "20px" }}>
                    Design Tools (Plugins)
                  </div>
                  <div className="export-options">
                    <button
                      className={`export-btn${exportType === "figma" ? " export-active" : ""}`}
                      type="button"
                      disabled={!isPro}
                      onClick={() => setExportType("figma")}
                    >
                      Figma
                    </button>
                    <button
                      className={`export-btn${exportType === "sketch" ? " export-active" : ""}`}
                      type="button"
                      disabled={!isPro}
                      onClick={() => setExportType("sketch")}
                    >
                      Sketch
                    </button>
                    <button
                      className={`export-btn${exportType === "vscode" ? " export-active" : ""}`}
                      type="button"
                      disabled={!isPro}
                      onClick={() => setExportType("vscode")}
                    >
                      VS Code
                    </button>
                    <button
                      className={`export-btn${exportType === "apple-clr" ? " export-active" : ""}`}
                      type="button"
                      disabled={!isPro}
                      onClick={() => setExportType("apple-clr")}
                    >
                      Apple .clr
                    </button>
                  </div>
                  {isPro ? (
                    <div className="export-code">
                      <pre className="export-pre">{exportContent}</pre>
                      <div className="export-toolbar">
                        <button
                          className="copy-btn"
                          type="button"
                          onClick={() =>
                            handleCopy(exportContent, "Export copied", "export")
                          }
                        >
                          Copy
                        </button>
                        <button
                          className="copy-btn"
                          type="button"
                          onClick={handleDownload}
                          style={{ marginLeft: "8px" }}
                        >
                          Download
                        </button>
                        {copyNotice && copyScope === "export" ? (
                          <span className="copy-status">{copyNotice}</span>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div className="upgrade-hint">
                      Upgrade to export full kits and developer formats.
                    </div>
                  )}
                </div>
                <div className="export-block">
                  <div className="export-title">Share</div>
                  <div className="share-row">
                    <input
                      className="share-input"
                      type="text"
                      readOnly
                      value={shareUrl}
                    />
                    <button
                      className="copy-btn"
                      type="button"
                      disabled={!shareUrl}
                      onClick={() => handleCopy(shareUrl, "Link copied", "share")}
                    >
                      Copy link
                    </button>
                  </div>
                  {copyNotice && copyScope === "share" ? (
                    <div className="copy-status">{copyNotice}</div>
                  ) : null}
                </div>
              </div>
              <div className="plan">
                <div className="panel-title">Plan</div>
                <div className="plan-row">
                  <span className={`plan-pill ${isPro ? "plan-pro" : "plan-free"}`}>
                    {isPro ? "Pro" : "Free"}
                  </span>
                  {!isPro ? (
                    <button
                      type="button"
                      className="upgrade-btn"
                      onClick={handleUpgrade}
                    >
                      Upgrade
                    </button>
                  ) : (
                    <span className="plan-status">Unlocked</span>
                  )}
                </div>
                <div className="plan-row">
                  <button
                    type="button"
                    className="save-btn"
                    onClick={handleSave}
                    disabled={!canSave}
                  >
                    Save palette
                  </button>
                  <span className="save-count">
                    {isPro ? "Unlimited saves" : `Saved ${savedCount}/${maxFreeSaves}`}
                  </span>
                </div>
                {!canSave && !isPro ? (
                  <div className="upgrade-hint">
                    Free plan limit reached. Upgrade for unlimited saves.
                  </div>
                ) : null}
                {savedPalettes.length ? (
                  <div className="saved-list">
                    {savedPalettes.map((item) => (
                      <div key={item.id} className="saved-item">
                        <div className="saved-meta">
                          <span>
                            Energy {item.energy} / Tension {item.tension}
                            {typeof item.hueBase === "number"
                              ? ` / Hue ${Math.round(item.hueBase)}`
                              : ""}
                            {item.spectrumMode ? " / Spectrum" : ""}
                          </span>
                          <span>{item.autoFix ? "Auto-fix" : "No fix"}</span>
                        </div>
                        <div className="saved-actions">
                          <button
                            type="button"
                            className="saved-btn"
                            onClick={() => handleLoad(item)}
                          >
                            Load
                          </button>
                          <button
                            type="button"
                            className="saved-btn saved-remove"
                            onClick={() => handleDelete(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="saved-empty">No saved palettes yet.</div>
                )}
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* Publish Modal */}
      {showPublishModal ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setShowPublishModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
              Publish to Community
            </h2>
            <p style={{ fontSize: "14px", opacity: 0.7, marginBottom: "24px" }}>
              Share your palette with the Tonal Field community
            </p>

            {/* Name */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                Palette Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Ocean Breeze, Sunset Warmth"
                value={publishName}
                onChange={(e) => setPublishName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "14px",
                  border: "1px solid rgba(0,0,0,0.15)",
                  borderRadius: "6px",
                  outline: "none",
                }}
                maxLength={50}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                Description (optional)
              </label>
              <textarea
                placeholder="Describe your palette and its inspiration..."
                value={publishDescription}
                onChange={(e) => setPublishDescription(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "14px",
                  border: "1px solid rgba(0,0,0,0.15)",
                  borderRadius: "6px",
                  outline: "none",
                  minHeight: "80px",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                maxLength={200}
              />
            </div>

            {/* Mood Tags */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                Mood Tags * (select at least one)
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {MOOD_TAGS.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTogglePublishMood(tag.id)}
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      border: "1px solid rgba(0,0,0,0.15)",
                      borderRadius: "6px",
                      background: publishMoods.includes(tag.id) ? "rgba(59, 130, 246, 0.15)" : "transparent",
                      cursor: "pointer",
                    }}
                    title={tag.description}
                  >
                    {publishMoods.includes(tag.id) ? "✓ " : ""}{tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Tags */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                Style Tags (optional)
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {STYLE_TAGS.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTogglePublishStyle(tag.id)}
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      border: "1px solid rgba(0,0,0,0.15)",
                      borderRadius: "6px",
                      background: publishStyles.includes(tag.id) ? "rgba(59, 130, 246, 0.15)" : "transparent",
                      cursor: "pointer",
                    }}
                    title={tag.description}
                  >
                    {publishStyles.includes(tag.id) ? "✓ " : ""}{tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div style={{ marginBottom: "24px", padding: "16px", background: "rgba(0,0,0,0.03)", borderRadius: "8px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "8px", opacity: 0.7 }}>
                Preview:
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "4px", height: "60px" }}>
                {(["background", "surface", "primary", "accent", "text", "muted"] as const).map((role) => (
                  <div
                    key={role}
                    style={{
                      background: toCss(palette[role]),
                      borderRadius: "4px",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  border: "1px solid rgba(0,0,0,0.15)",
                  borderRadius: "6px",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublish}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  border: "none",
                  borderRadius: "6px",
                  background: "rgb(59, 130, 246)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Publish to Community
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Frame>
  );
}
