export const THEME_MODE_OPTIONS = [
  {
    label: "Light",
    value: "light",
  },
  {
    label: "Dark",
    value: "dark",
  },
] as const;

export const THEME_MODE_VALUES = THEME_MODE_OPTIONS.map((m) => m.value);

export type ThemeMode = (typeof THEME_MODE_VALUES)[number];

// --- generated:themePresets:start ---

export const THEME_PRESET_OPTIONS = [
  {
    label: "Default",
    value: "default",
    primary: {
      light: "oklch(0.205 0 0)",
      dark: "oklch(0.922 0 0)",
    },
  },
    {
    label: "ROOMIQ",
    value: "roomiq",
    primary: {
      light: "#03045E", // azul escuro (primary)
      dark: "#CAF0F8",  // azul claro no dark mode
    },
  },
  {
    label: "Tangerine",
    value: "tangerine",
    primary: {
      light: "oklch(0.64 0.17 36.44)",
      dark: "oklch(0.64 0.17 36.44)",
    },
  },
] as const;

export const THEME_PRESET_VALUES = THEME_PRESET_OPTIONS.map((p) => p.value);

export type ThemePreset = (typeof THEME_PRESET_OPTIONS)[number]["value"];

// --- generated:themePresets:end ---
