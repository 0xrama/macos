import { useEffect } from "react";

/**
 * LiquidGlassFilter mounts the single global SVG filter graph that powers
 * the real refraction ("lensing") used by `.lg-refract` surfaces.
 *
 * feTurbulence generates a smooth noise field; feDisplacementMap uses it
 * to bend the backdrop, producing the glass distortion. It is rendered
 * once at the app root and referenced by id via backdrop-filter.
 */
export default function LiquidGlassFilter() {
  useEffect(() => {
    // Detect support for url() backdrop-filter; Safari/Firefox handle SVG
    // backdrop filters inconsistently, so fall back to blur there.
    const isChromium =
      "chrome" in window || /Chrome|Chromium|Edg/.test(navigator.userAgent);
    if (!isChromium) {
      document.documentElement.classList.add("lg-off");
    }
  }, []);

  return (
    <svg className="lg-filter-host" aria-hidden="true">
      <defs>
        <filter
          id="liquid-glass"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.008"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
