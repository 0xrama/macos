import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
  transformerAttributifyJsx
} from "unocss";

const colorReg = (prefix: string) => new RegExp("^" + prefix + "-([0-9a-z]+)(/(\\d+))?$");

const colorAttr = (prefix: string, [, color, , opacity]: RegExpMatchArray) => {
  let lightColor = "",
    darkColor = "";

  if (["black", "white"].includes(color)) {
    lightColor = color;
    darkColor = color === "white" ? "black" : "white";
  } else {
    lightColor = `gray-${color}`;
    darkColor = `gray-${(
      (+color === 900 || +color === 50 ? 950 : 900) - +color
    ).toString()}`;
  }

  const attr = `${prefix}-${lightColor}${opacity ? "/" + opacity : ""}`;
  const darkAttr = `${prefix}-${darkColor}${opacity ? "/" + opacity : ""}`;

  return `${attr} dark:${darkAttr}`;
};

export default defineConfig({
  shortcuts: [
    ["flex-center", "flex items-center justify-center"],
    ["hstack", "flex items-center"],
    ["vstack", "hstack flex-col"],
    ["no-outline", "outline-none focus:outline-none"],
    [colorReg("text-c"), (v) => colorAttr("text", v)],
    [colorReg("border-c"), (v) => colorAttr("border", v)],
    [colorReg("bg-c"), (v) => colorAttr("bg", v)],
    [
      "shadow-menu",
      "shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
    ],
    ["window-btn", "size-3 text-black rounded-full flex-center no-outline"],
    ["border-menu", "border-black/10 dark:border-white/10"],
    [
      "menu-box",
      "fixed top-7.5 text-c-black glass-thick rounded-glass shadow-menu lg-refract"
    ],
    [
      "safari-btn",
      "h-6 outline-none focus:outline-none rounded flex-center border border-c-300"
    ],
    [
      "cc-btn",
      "flex-center rounded-full size-8 text-white bg-blue-500 transition-all duration-150 hover:bg-blue-400 active:scale-95"
    ],
    [
      "cc-btn-active",
      "flex-center rounded-full size-8 text-c-700 bg-gray-300/40 dark:bg-gray-500/30 transition-all duration-150 hover:bg-gray-300/50 dark:hover:bg-gray-500/40 active:scale-95"
    ],
    ["cc-text", "text-xs text-c-500"],
    [
      "cc-grid",
      "bg-white/40 dark:bg-white/8 rounded-glass border-[0.5px] border-white/40 dark:border-white/10 glass-specular"
    ],
    ["battery-level", "absolute rounded-[1px] h-2 top-1/2 -mt-1 ml-0.5 left-0"],

    /* ============ Liquid Glass material system ============
       Tiered translucent materials. Each combines backdrop blur +
       saturation + adaptive tint + hairline border + a specular
       edge highlight (see glass-specular rule). Pair with a
       rounded-glass* radius and optionally `lg-refract` for the
       SVG lensing layer. */
    [
      "glass-thin",
      "bg-white/35 dark:bg-gray-900/30 backdrop-blur-[10px] backdrop-saturate-[180%] border-[0.5px] border-white/40 dark:border-white/10 glass-specular"
    ],
    [
      "glass-regular",
      "bg-white/55 dark:bg-gray-900/45 backdrop-blur-[20px] backdrop-saturate-[180%] border-[0.5px] border-white/50 dark:border-white/10 glass-specular"
    ],
    [
      "glass-thick",
      "bg-white/70 dark:bg-gray-900/60 backdrop-blur-[30px] backdrop-saturate-[200%] border-[0.5px] border-white/60 dark:border-white/12 glass-specular"
    ],
    [
      "glass-clear",
      "bg-white/12 dark:bg-white/8 backdrop-blur-[6px] backdrop-saturate-[150%] border-[0.5px] border-white/30 dark:border-white/10 glass-specular"
    ],
    /* Semantic surfaces */
    ["glass-panel", "glass-thick rounded-glass-lg shadow-glass"],
    ["glass-bar", "glass-regular glass-specular"],
    [
      "glass-control",
      "glass-thin rounded-full glass-specular transition-all duration-150 active:scale-95"
    ]
  ],
  rules: [
    [
      "cc-grid-shadow",
      { "box-shadow": "0 2px 12px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.03)" }
    ],
    /* Specular edge lighting: bright top-inner rim + soft bottom-inner
       shade, the signature of Liquid Glass surfaces. */
    [
      "glass-specular",
      {
        "box-shadow":
          "inset 0 1px 0.5px 0 rgba(255,255,255,0.55), inset 0 -1px 1px 0 rgba(0,0,0,0.06), inset 0 0 0 0.5px rgba(255,255,255,0.08)"
      }
    ],
    /* Layered ambient shadow for floating glass panels */
    [
      "shadow-glass",
      {
        "box-shadow":
          "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 24px 60px rgba(0,0,0,0.12)"
      }
    ],
    /* Continuous (squircle-scale) corner radii for Tahoe chrome */
    ["rounded-glass", { "border-radius": "16px" }],
    ["rounded-glass-lg", { "border-radius": "24px" }],
    ["rounded-glass-xl", { "border-radius": "32px" }]
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      warn: true,
      extraProperties: {
        display: "inline-block"
      }
    })
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    transformerAttributifyJsx()
  ]
});
