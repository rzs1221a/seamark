import type { StyleSpecification } from "maplibre-gl";

/**
 * The living-coast style, in the lineage of the studio's prior storefront and
 * the Heymann Williams build: a dark-graded Esri World Imagery raster plate
 * with real OpenStreetMap building footprints extruding in past zoom 14. Both
 * tile sources are key-free — nothing to configure, no per-request billing.
 *
 * The grade is pushed dark: here the map carries marketing copy and the
 * Passage on top of it, and has to stay subordinate to both.
 */

const IMAGERY_TILES =
  "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const VECTOR_TILES = "https://tiles.openfreemap.org/planet";

export const coastStyle: StyleSpecification = {
  version: 8,
  sources: {
    imagery: {
      type: "raster",
      tiles: [IMAGERY_TILES],
      tileSize: 256,
      maxzoom: 18,
      attribution: "Imagery © Esri, Maxar, Earthstar Geographics",
    },
    osm: { type: "vector", url: VECTOR_TILES },
  },
  layers: [
    { id: "base", type: "background", paint: { "background-color": "#04070a" } },
    {
      id: "imagery",
      type: "raster",
      source: "imagery",
      paint: {
        // Desaturated but not drained — the marsh greens and the Atlantic
        // still need to read as a real place through the shade above.
        "raster-saturation": -0.3,
        "raster-contrast": 0.14,
        "raster-brightness-max": 0.78,
        "raster-fade-duration": 120,
      },
    },
    {
      id: "buildings-3d",
      type: "fill-extrusion",
      source: "osm",
      "source-layer": "building",
      minzoom: 14,
      paint: {
        "fill-extrusion-color": [
          "interpolate",
          ["linear"],
          ["coalesce", ["get", "render_height"], 18],
          0,
          "#252b33",
          20,
          "#39434e",
          50,
          "#525d6a",
        ] as unknown as string,
        "fill-extrusion-height": ["coalesce", ["get", "render_height"], 18] as unknown as number,
        "fill-extrusion-base": [
          "coalesce",
          ["get", "render_min_height"],
          0,
        ] as unknown as number,
        "fill-extrusion-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          14,
          0,
          15,
          0.85,
        ] as unknown as number,
      },
    },
  ],
};
