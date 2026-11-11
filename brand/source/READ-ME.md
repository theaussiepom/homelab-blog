# Source artwork | v3.0

The native portrait geometry is carried forward unchanged from the approved suite. The name-bearing layouts and supporting line have been rebuilt for **The Aussie Pom**.

`tap-portrait-master.svg` has six named paths: hair-and-glasses, eye-right, eye-left, goatee, mouth and under-lip. `tap-micro-master.svg` uses the same paths, omitting only the two eyes. Both are tightly fitted 658 x 881 drawings. Preserve their tilt, proportions, thin frames, connected goatee and small balanced smile.

The micro favicon retains its approved optical stroke weight. It has a white circle and transparent corners. The main portrait uses black on lilac in both themes; only logo lettering changes from dark ink to warm white.

Production SVG/PDF lettering is outlined. `tap-primary-editable-text.svg` retains live text for editing. Install `fonts/LiberationSans-Bold.ttf` before editing it; application text layout may differ slightly from the outlined production assets. The font is distributed under the SIL Open Font License in `fonts/OFL-Liberation.txt`.

## Rebuilding

From a Python environment with the dependencies in `requirements.txt`:

    python3 source/build_assets.py
    python3 source/build_docs.py

The scripts locate this kit from their own path. They rebuild name-bearing artwork, brand tokens, HTML preview, documentation and the PDF guide. The approved icon, favicon and avatar exports are supplied unchanged; these scripts do not regenerate them. `build-info.json` records layout canvas sizes and measured text widths. Refresh the file manifest after rebuilding assets.

The live website remains Arial/Helvetica for headings and UI, and Georgia for reading. Bundled Liberation Sans is for logo source editing and the guide, not a request to change the site's typography.

Use SVG for new sizes instead of enlarging PNGs. Keep the original aspect ratio, flat fills and clear space. The approved raster in `reference/` is a visual reference only. All production artwork is RGB; proof separately for colour-critical printing.
