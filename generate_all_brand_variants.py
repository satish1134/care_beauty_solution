import os, math

def generate_all_variants():
    # Common color palette matching official sheet:
    # Deep Gold: #8C6A12
    # Primary Gold: #C9A227
    # Highlight Gold: #E8C76A / #FFF8D6 / #FFFFFF
    
    num_loops = 20
    cx, cy = 400, 310
    rx, ry = 175, 58
    
    # Guilloche outer wreath mesh
    wreath_shadows = []
    wreath_wires = []
    wreath_highlights = []
    
    for i in range(num_loops):
        angle = i * (360.0 / num_loops)
        wreath_shadows.append(
            f'<ellipse cx="{cx+1.5}" cy="{cy+3}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" '
            f'fill="none" stroke="#221100" stroke-width="4.5" opacity="0.32" />'
        )
        wreath_wires.append(
            f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" '
            f'fill="none" stroke="url(#goldWireGrad)" stroke-width="4.8" />'
        )
        wreath_highlights.append(
            f'<ellipse cx="{cx-0.8}" cy="{cy-0.8}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" '
            f'fill="none" stroke="url(#goldSpecGrad)" stroke-width="1.4" opacity="0.9" />'
        )
        
    mesh_markup = "\n    ".join(wreath_shadows + wreath_wires + wreath_highlights)

    defs = """
    <linearGradient id="goldMaster3D" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5E3D07" />
      <stop offset="14%" stop-color="#8C6A12" />
      <stop offset="28%" stop-color="#C9A227" />
      <stop offset="44%" stop-color="#FFF9DB" />
      <stop offset="58%" stop-color="#E8C76A" />
      <stop offset="74%" stop-color="#8C6A12" />
      <stop offset="88%" stop-color="#FDF3BA" />
      <stop offset="100%" stop-color="#4F2D02" />
    </linearGradient>

    <linearGradient id="goldWireGrad" x1="12%" y1="0%" x2="88%" y2="100%">
      <stop offset="0%" stop-color="#6B4509" />
      <stop offset="22%" stop-color="#C9A227" />
      <stop offset="48%" stop-color="#FFF8D6" />
      <stop offset="76%" stop-color="#8C6A12" />
      <stop offset="100%" stop-color="#4E2901" />
    </linearGradient>

    <linearGradient id="goldSpecGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3B2001" stop-opacity="0.05" />
      <stop offset="35%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="70%" stop-color="#E8C76A" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.95" />
    </linearGradient>

    <linearGradient id="goldRodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4E2A01" />
      <stop offset="20%" stop-color="#C9A227" />
      <stop offset="46%" stop-color="#FFFFFF" />
      <stop offset="72%" stop-color="#E8C76A" />
      <stop offset="90%" stop-color="#8C6A12" />
      <stop offset="100%" stop-color="#3D1D00" />
    </linearGradient>

    <filter id="softBevel" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1.8" dy="3.2" stdDeviation="2.5" flood-color="#241200" flood-opacity="0.45" />
      <feDropShadow dx="-0.8" dy="-0.8" stdDeviation="1" flood-color="#FFFCE6" flood-opacity="0.8" />
    </filter>

    <filter id="masterDropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="4" stdDeviation="3.5" flood-color="#221100" flood-opacity="0.38" />
      <feDropShadow dx="-1" dy="-1" stdDeviation="1.5" flood-color="#FFFFFF" flood-opacity="0.75" />
    </filter>
    """

    # =========================================================================
    # VARIANT 1: FAVICON VERSION (As labeled in brand sheet: "Favicon Version")
    # Clean inner circle with gold outline + Botanical leaf + dividing rod + Roman C
    # Optimized for crisp rendering at 16x16, 32x32, 64x64, 128x128. Transparent bg.
    # =========================================================================
    favicon_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    {defs}
  </defs>

  <g id="care-favicon-emblem" transform="translate(100, 100)" filter="url(#softBevel)">
    <!-- Main Outer Circle -->
    <circle cx="0" cy="0" r="82" fill="none" stroke="url(#goldMaster3D)" stroke-width="7.5" />
    <circle cx="0" cy="0" r="82" fill="none" stroke="url(#goldSpecGrad)" stroke-width="2.2" />

    <!-- Center Dividing Bar -->
    <rect x="-2.2" y="-58" width="4.4" height="116" rx="2.2" fill="url(#goldRodGrad)" stroke="url(#goldSpecGrad)" stroke-width="0.6" />
    <line x1="-0.6" y1="-56" x2="-0.6" y2="56" stroke="#FFFFFF" stroke-width="0.8" opacity="0.95" />

    <!-- Left Botanical Leaf Crest -->
    <g transform="translate(-42, 0) scale(0.68)">
      <path d="M 0 -46 C -17 -26, -17 -6, 0 8 C 17 -6, 17 -26, 0 -46 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="7" stroke-linejoin="round" />
      <line x1="0" y1="-38" x2="0" y2="5" stroke="url(#goldMaster3D)" stroke-width="3" />
      <path d="M -6 -13 C -33 -32, -44 -9, -8 4 C -3 3, -1 -2, -6 -13 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6.5" stroke-linejoin="round" />
      <path d="M 6 -13 C 33 -32, 44 -9, 8 4 C 3 3, 1 -2, 6 -13 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6.5" stroke-linejoin="round" />
      <path d="M -6 6 C -28 5, -34 20, -7 16 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="5.5" />
      <path d="M 6 6 C 28 5, 34 20, 7 16 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="5.5" />
      <path d="M 0 8 L 0 36" stroke="url(#goldMaster3D)" stroke-width="6.5" stroke-linecap="round" />
      <circle cx="0" cy="36" r="3.5" fill="url(#goldMaster3D)" />
    </g>

    <!-- Right Roman Serif 'C' -->
    <g transform="translate(42, 0) scale(0.68)">
      <path d="M 35 -36 C 29 -45, 20 -50, 7 -50 C -19 -50 -36 -30 -36 0 C -36 30 -19 50 7 50 C 21 50 31 43 36 35 L 28 29 C 23 36 16 41 7 41 C -12 41 -24 25 -24 0 C -24 -25 -12 -41 7 -41 C 16 -41 23 -37 27 -31 Z" 
            fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="2.2" />
      <circle cx="34" cy="-34" r="7.5" fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="1.4" />
      <circle cx="32.5" cy="-35.5" r="2.4" fill="#FFFFFF" opacity="0.95" />
      <path d="M 25 29 L 41 37 L 27 43 Z" fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="1.2" />
    </g>
  </g>
</svg>"""

    # =========================================================================
    # VARIANT 2: ICON / MOBILE VERSION (As labeled in brand sheet: "Icon / Mobile Version")
    # Circular emblem with full outer woven lattice wreath on transparent background.
    # =========================================================================
    mobile_icon_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    {defs}
  </defs>

  <g id="care-mobile-emblem" transform="translate(200, 200)" filter="url(#masterDropShadow)">
    <!-- Woven Guilloche Mesh -->
    <g transform="scale(0.85) translate(-400, -310)">
      {mesh_markup}
    </g>

    <!-- Inner Gold Double Rings -->
    <circle cx="0" cy="0" r="114" fill="none" stroke="url(#goldMaster3D)" stroke-width="5" />
    <circle cx="0" cy="0" r="114" fill="none" stroke="url(#goldSpecGrad)" stroke-width="1.6" />
    <circle cx="0" cy="0" r="107" fill="none" stroke="url(#goldMaster3D)" stroke-width="2.2" />

    <!-- Center Dividing Bar -->
    <rect x="-3" y="-84" width="6" height="168" rx="3" fill="url(#goldRodGrad)" stroke="url(#goldSpecGrad)" stroke-width="0.8" />
    <line x1="-0.8" y1="-82" x2="-0.8" y2="82" stroke="#FFFFFF" stroke-width="1.2" opacity="0.95" />

    <!-- Left Botanical Leaf Crest -->
    <g transform="translate(-62, 0)" filter="url(#softBevel)">
      <path d="M 0 -46 C -17 -26, -17 -6, 0 8 C 17 -6, 17 -26, 0 -46 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="7" stroke-linejoin="round" />
      <line x1="0" y1="-38" x2="0" y2="5" stroke="url(#goldMaster3D)" stroke-width="3" />
      <path d="M -6 -13 C -33 -32, -44 -9, -8 4 C -3 3, -1 -2, -6 -13 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6.5" stroke-linejoin="round" />
      <path d="M 6 -13 C 33 -32, 44 -9, 8 4 C 3 3, 1 -2, 6 -13 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6.5" stroke-linejoin="round" />
      <path d="M -6 6 C -28 5, -34 20, -7 16 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="5.5" />
      <path d="M 6 6 C 28 5, 34 20, 7 16 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="5.5" />
      <path d="M 0 8 L 0 36" stroke="url(#goldMaster3D)" stroke-width="6.5" stroke-linecap="round" />
      <circle cx="0" cy="36" r="3.5" fill="url(#goldMaster3D)" />
    </g>

    <!-- Right Roman Serif 'C' -->
    <g transform="translate(62, 0)" filter="url(#softBevel)">
      <path d="M 35 -36 C 29 -45, 20 -50, 7 -50 C -19 -50 -36 -30 -36 0 C -36 30 -19 50 7 50 C 21 50 31 43 36 35 L 28 29 C 23 36 16 41 7 41 C -12 41 -24 25 -24 0 C -24 -25 -12 -41 7 -41 C 16 -41 23 -37 27 -31 Z" 
            fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="2.2" />
      <circle cx="34" cy="-34" r="7.5" fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="1.4" />
      <circle cx="32.5" cy="-35.5" r="2.4" fill="#FFFFFF" opacity="0.95" />
      <path d="M 25 29 L 41 37 L 27 43 Z" fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="1.2" />
    </g>
  </g>
</svg>"""

    # =========================================================================
    # VARIANT 3: HEADER VERSION (NO TAGLINE) (As labeled: "Header Version (No Tagline)")
    # Stacked lockup: Emblem + CARe + underline flourish. Transparent background.
    # =========================================================================
    header_no_tagline_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    {defs}
  </defs>

  <g id="care-header-no-tagline" transform="translate(300, 220)" filter="url(#masterDropShadow)">
    
    <!-- Emblem -->
    <g id="emblem-center" transform="scale(0.85)">
      <!-- Woven Guilloche Mesh -->
      <g transform="translate(-400, -310)">
        {mesh_markup}
      </g>

      <!-- Inner Gold Double Rings -->
      <circle cx="0" cy="0" r="140" fill="none" stroke="url(#goldMaster3D)" stroke-width="6" />
      <circle cx="0" cy="0" r="140" fill="none" stroke="url(#goldSpecGrad)" stroke-width="1.8" />
      <circle cx="0" cy="0" r="132" fill="none" stroke="url(#goldMaster3D)" stroke-width="2.2" />

      <!-- Center Dividing Bar -->
      <g filter="url(#softBevel)">
        <rect x="-3.5" y="-104" width="7" height="208" rx="3.5" fill="url(#goldRodGrad)" stroke="url(#goldSpecGrad)" stroke-width="0.6" />
        <line x1="-1.8" y1="-101" x2="-1.8" y2="101" stroke="#FFFFFF" stroke-width="1.1" opacity="0.95" stroke-linecap="round" />
      </g>

      <!-- Left Leaf Crest -->
      <g transform="translate(-78, 0)" filter="url(#softBevel)">
        <path d="M 0 -46 C -17 -26, -17 -6, 0 8 C 17 -6, 17 -26, 0 -46 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6.5" stroke-linejoin="round" />
        <line x1="0" y1="-38" x2="0" y2="5" stroke="url(#goldMaster3D)" stroke-width="2.6" stroke-linecap="round" />
        <path d="M -6 -13 C -33 -32, -44 -9, -8 4 C -3 3, -1 -2, -6 -13 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6" stroke-linejoin="round" />
        <path d="M 6 -13 C 33 -32, 44 -9, 8 4 C 3 3, 1 -2, 6 -13 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6" stroke-linejoin="round" />
        <path d="M -6 6 C -28 5, -34 20, -7 16 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="5" />
        <path d="M 6 6 C 28 5, 34 20, 7 16 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="5" />
        <path d="M 0 8 L 0 36" stroke="url(#goldMaster3D)" stroke-width="6.2" stroke-linecap="round" />
        <circle cx="0" cy="36" r="3.4" fill="url(#goldMaster3D)" />
      </g>

      <!-- Right Roman 'C' -->
      <g transform="translate(76, 0)" filter="url(#softBevel)">
        <path d="M 35 -36 C 29 -45, 20 -50, 7 -50 C -19 -50 -36 -30 -36 0 C -36 30 -19 50 7 50 C 21 50 31 43 36 35 L 28 29 C 23 36 16 41 7 41 C -12 41 -24 25 -24 0 C -24 -25 -12 -41 7 -41 C 16 -41 23 -37 27 -31 Z" 
              fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="2" />
        <circle cx="34" cy="-34" r="7.2" fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="1.3" />
        <circle cx="32.5" cy="-35.5" r="2.3" fill="#FFFFFF" opacity="0.95" />
        <path d="M 25 29 L 41 37 L 27 43 Z" fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="1" />
      </g>
    </g>

    <!-- CARe Wordmark -->
    <g transform="translate(0, 200)" filter="url(#softBevel)" text-anchor="middle">
      <text font-family="'Cinzel', 'Playfair Display', Georgia, serif" 
            font-size="94" 
            font-weight="900" 
            letter-spacing="18" 
            fill="url(#goldMaster3D)" 
            stroke="url(#goldSpecGrad)" 
            stroke-width="2">
        <tspan x="-155">C</tspan>
        <tspan x="-52">A</tspan>
        <tspan x="52">R</tspan>
        <tspan x="155" font-size="84" dy="3">e</tspan>
      </text>
    </g>

    <!-- Decorative Underline Flourish -->
    <g transform="translate(0, 255)" filter="url(#softBevel)">
      <line x1="-220" y1="0" x2="-38" y2="0" stroke="url(#goldMaster3D)" stroke-width="3" stroke-linecap="round" />
      <line x1="-220" y1="-0.8" x2="-38" y2="-0.8" stroke="url(#goldSpecGrad)" stroke-width="1" stroke-linecap="round" />
      <g id="knot-no-tagline">
        <path d="M 0 -10 C -8 -2, -8 2, 0 10 C 8 2, 8 -2, 0 -10 Z" fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="1.3" />
        <circle cx="0" cy="0" r="2.4" fill="#FFFFFF" opacity="0.95" />
        <path d="M -3 0 C -15 -10, -22 0, -3 7 Z" fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="1.1" />
        <path d="M 3 0 C 15 -10, 22 0, 3 7 Z" fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="1.1" />
        <circle cx="-26" cy="0" r="4.4" fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="0.9" />
        <circle cx="26" cy="0" r="4.4" fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="0.9" />
      </g>
      <line x1="38" y1="0" x2="220" y2="0" stroke="url(#goldMaster3D)" stroke-width="3" stroke-linecap="round" />
      <line x1="38" y1="-0.8" x2="220" y2="-0.8" stroke="url(#goldSpecGrad)" stroke-width="1" stroke-linecap="round" />
    </g>

  </g>
</svg>"""

    # =========================================================================
    # VARIANT 4: WEBSITE HEADER HORIZONTAL (As shown in "Example: Website Header")
    # Horizontal lockup: [ (Emblem)   CARe ] with transparent background.
    # =========================================================================
    website_header_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 84" width="100%" height="100%">
  <defs>
    {defs}
  </defs>

  <g id="care-website-header-lockup" filter="url(#softBevel)">
    
    <!-- EMBLEM MEDALLION (CENTER: 42, 42) -->
    <g id="nav-emblem" transform="translate(42, 42)">
      <!-- Woven Guilloche Mesh scaled -->
      <g transform="scale(0.245) translate(-400, -310)">
        {mesh_markup}
      </g>

      <!-- Double Gold Rings -->
      <circle cx="0" cy="0" r="26.8" fill="none" stroke="url(#goldMaster3D)" stroke-width="1.8" />
      <circle cx="0" cy="0" r="26.8" fill="none" stroke="url(#goldSpecGrad)" stroke-width="0.7" />
      <circle cx="0" cy="0" r="25" fill="none" stroke="url(#goldMaster3D)" stroke-width="0.9" />

      <!-- Center Dividing Bar -->
      <rect x="-0.8" y="-19.5" width="1.6" height="39" rx="0.8" fill="url(#goldRodGrad)" stroke="url(#goldSpecGrad)" stroke-width="0.3" />
      <line x1="-0.2" y1="-19" x2="-0.2" y2="19" stroke="#FFFFFF" stroke-width="0.4" opacity="0.95" />

      <!-- Left Botanical Leaf Crest -->
      <g transform="translate(-14.5, 0) scale(0.48)">
        <path d="M 0 -46 C -17 -26, -17 -6, 0 8 C 17 -6, 17 -26, 0 -46 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6.5" />
        <line x1="0" y1="-38" x2="0" y2="5" stroke="url(#goldMaster3D)" stroke-width="2.6" />
        <path d="M -6 -13 C -33 -32, -44 -9, -8 4 C -3 3, -1 -2, -6 -13 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6" />
        <path d="M 6 -13 C 33 -32, 44 -9, 8 4 C 3 3, 1 -2, 6 -13 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6" />
        <path d="M -6 6 C -28 5, -34 20, -7 16 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="5" />
        <path d="M 6 6 C 28 5, 34 20, 7 16 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="5" />
        <path d="M 0 8 L 0 36" stroke="url(#goldMaster3D)" stroke-width="6.2" stroke-linecap="round" />
      </g>

      <!-- Right Roman 'C' -->
      <g transform="translate(14.5, 0) scale(0.48)">
        <path d="M 35 -36 C 29 -45, 20 -50, 7 -50 C -19 -50 -36 -30 -36 0 C -36 30 -19 50 7 50 C 21 50 31 43 36 35 L 28 29 C 23 36 16 41 7 41 C -12 41 -24 25 -24 0 C -24 -25 -12 -41 7 -41 C 16 -41 23 -37 27 -31 Z" 
              fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="2" />
        <circle cx="34" cy="-34" r="7.2" fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="1.2" />
        <path d="M 25 29 L 41 37 L 27 43 Z" fill="url(#goldMaster3D)" />
      </g>
    </g>

    <!-- RIGHT: 'CARe' (ROMAN SERIF) -->
    <g transform="translate(94, 53)">
      <text font-family="'Cinzel', 'Playfair Display', Georgia, serif" 
            font-size="44" 
            font-weight="900" 
            letter-spacing="6" 
            fill="url(#goldMaster3D)" 
            stroke="url(#goldSpecGrad)" 
            stroke-width="1">
        <tspan x="0">C</tspan>
        <tspan x="38">A</tspan>
        <tspan x="78">R</tspan>
        <tspan x="118" font-size="39" dy="1">e</tspan>
      </text>
    </g>

  </g>
</svg>"""

    # =========================================================================
    # VARIANT 5: DARK BACKGROUND HORIZONTAL VERSION (As shown: Deep Emerald Green Card)
    # Background: #0D261B (or dark container), with full horizontal lockup & tagline
    # =========================================================================
    dark_bg_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 160" width="100%" height="100%">
  <defs>
    {defs}
  </defs>

  <rect width="100%" height="100%" rx="16" fill="#0D261B" />

  <g id="care-dark-horizontal-brand" transform="translate(18, 16)">
    
    <!-- Emblem -->
    <g id="dark-emblem" transform="translate(56, 64)">
      <g transform="scale(0.32) translate(-400, -310)">
        {mesh_markup}
      </g>
      <circle cx="0" cy="0" r="35" fill="none" stroke="url(#goldMaster3D)" stroke-width="2.4" />
      <circle cx="0" cy="0" r="35" fill="none" stroke="url(#goldSpecGrad)" stroke-width="0.9" />
      <rect x="-1" y="-25" width="2" height="50" rx="1" fill="url(#goldRodGrad)" stroke="url(#goldSpecGrad)" stroke-width="0.4" />
      
      <!-- Leaf -->
      <g transform="translate(-19, 0) scale(0.6)">
        <path d="M 0 -46 C -17 -26, -17 -6, 0 8 C 17 -6, 17 -26, 0 -46 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6.5" />
        <path d="M -6 -13 C -33 -32, -44 -9, -8 4 C -3 3, -1 -2, -6 -13 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6" />
        <path d="M 6 -13 C 33 -32, 44 -9, 8 4 C 3 3, 1 -2, 6 -13 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6" />
        <path d="M 0 8 L 0 36" stroke="url(#goldMaster3D)" stroke-width="6.2" stroke-linecap="round" />
      </g>
      <!-- C -->
      <g transform="translate(19, 0) scale(0.6)">
        <path d="M 35 -36 C 29 -45, 20 -50, 7 -50 C -19 -50 -36 -30 -36 0 C -36 30 -19 50 7 50 C 21 50 31 43 36 35 L 28 29 C 23 36 16 41 7 41 C -12 41 -24 25 -24 0 C -24 -25 -12 -41 7 -41 C 16 -41 23 -37 27 -31 Z" fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="2" />
        <circle cx="34" cy="-34" r="7.2" fill="url(#goldMaster3D)" stroke="url(#goldSpecGrad)" stroke-width="1.2" />
        <path d="M 25 29 L 41 37 L 27 43 Z" fill="url(#goldMaster3D)" />
      </g>
    </g>

    <!-- CARe Wordmark -->
    <g transform="translate(122, 62)">
      <text font-family="'Cinzel', 'Playfair Display', Georgia, serif" 
            font-size="52" 
            font-weight="900" 
            letter-spacing="8" 
            fill="url(#goldMaster3D)" 
            stroke="url(#goldSpecGrad)" 
            stroke-width="1.2">
        <tspan x="0">C</tspan>
        <tspan x="45">A</tspan>
        <tspan x="92">R</tspan>
        <tspan x="140" font-size="46" dy="1">e</tspan>
      </text>
    </g>

    <!-- Flourish divider -->
    <g transform="translate(225, 96)">
      <line x1="-102" y1="0" x2="-18" y2="0" stroke="url(#goldMaster3D)" stroke-width="1.6" />
      <circle cx="0" cy="0" r="2.5" fill="url(#goldMaster3D)" />
      <line x1="18" y1="0" x2="102" y2="0" stroke="url(#goldMaster3D)" stroke-width="1.6" />
    </g>

    <!-- Tagline -->
    <g transform="translate(225, 118)">
      <text font-family="'Cinzel', 'Playfair Display', sans-serif" 
            font-size="12" 
            font-weight="700" 
            letter-spacing="6" 
            fill="url(#goldMaster3D)" 
            text-anchor="middle">
        A BEAUTY SOLUTION
      </text>
    </g>

  </g>
</svg>"""

    # Save all variants to /public/images/
    variants = {
        "care-favicon.svg": favicon_svg,
        "care-mobile-icon.svg": mobile_icon_svg,
        "care-emblem-icon.svg": mobile_icon_svg,
        "care-header-no-tagline.svg": header_no_tagline_svg,
        "care-official-gold-logo-horizontal.svg": website_header_svg,
        "care-dark-horizontal.svg": dark_bg_svg,
    }

    for filename, content in variants.items():
        filepath = os.path.join("public/images", filename)
        with open(filepath, "w") as f:
            f.write(content)
        print(f"Generated variant: {filepath}")

    # Also update favicon at public root
    with open("public/favicon.svg", "w") as f:
        f.write(favicon_svg)
    print("Updated public/favicon.svg to crisp Favicon Version!")

if __name__ == "__main__":
    generate_all_variants()
