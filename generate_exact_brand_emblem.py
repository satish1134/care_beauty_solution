import math

def generate_accurate_brand_assets():
    # Let's inspect the precise geometric structure of the emblem from the style guide:
    # 1. Outer Woven Scalloped Lattice Wreath:
    #    It's an interlaced Celtic/torus guilloche ring made of 16-20 overlapping oval loops that create a beautiful scalloped outer perimeter and diamond mesh interior.
    # 2. Inner Golden Ring:
    #    Thick beveled 3D gold ring defining the inner white disc.
    # 3. Inside Left: 3-Petal Botanical Gold Leaf Crest (Lotus / Care Leaf):
    #    - 1 Top vertical pointed petal (outline + 3D bevel)
    #    - 1 Left petal angled ~45 degrees
    #    - 1 Right petal angled ~45 degrees
    #    - 1 Center vertical stem with base bead
    #    - Inside each petal is an embossed gold rim with recessed center.
    # 4. Inside Center:
    #    - Vertical 3D gold dividing bar (rounded caps, specular highlight, subtle cast shadow to the left/bottom).
    # 5. Inside Right:
    #    - Classic Roman Serif "C" with thick vertical spine, thin top/bottom arches, top teardrop terminal, and bottom flared foot.
    
    # Let's write the high-precision SVG generator
    
    num_loops = 20
    cx, cy = 400, 330
    rx, ry = 182, 60
    
    # Generate outer guilloche mesh
    wreath_shadows = []
    wreath_wires = []
    wreath_specs = []
    
    for i in range(num_loops):
        angle = i * (360.0 / num_loops)
        wreath_shadows.append(
            f'<ellipse cx="{cx+1.5}" cy="{cy+3}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" '
            f'fill="none" stroke="#2A1601" stroke-width="4.5" opacity="0.35" />'
        )
        wreath_wires.append(
            f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" '
            f'fill="none" stroke="url(#goldWireGradient)" stroke-width="4.8" />'
        )
        wreath_specs.append(
            f'<ellipse cx="{cx-0.8}" cy="{cy-0.8}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" '
            f'fill="none" stroke="url(#goldSpecularGradient)" stroke-width="1.4" opacity="0.9" />'
        )
        
    mesh_svg = "\n    ".join(wreath_shadows + wreath_wires + wreath_specs)
    
    defs = """
    <!-- 3D Luxury Gold Metallic Gradients (#8C6A12, #C9A227, #E8C76A) -->
    <linearGradient id="goldMaster3D" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6E4408" />
      <stop offset="12%" stop-color="#8C6A12" />
      <stop offset="28%" stop-color="#C9A227" />
      <stop offset="44%" stop-color="#FFF5C6" />
      <stop offset="58%" stop-color="#E8C76A" />
      <stop offset="74%" stop-color="#8C6A12" />
      <stop offset="88%" stop-color="#FDF2B5" />
      <stop offset="100%" stop-color="#542E02" />
    </linearGradient>

    <linearGradient id="goldWireGradient" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#734606" />
      <stop offset="20%" stop-color="#C9A227" />
      <stop offset="48%" stop-color="#FFF8D6" />
      <stop offset="75%" stop-color="#8C6A12" />
      <stop offset="100%" stop-color="#4E2901" />
    </linearGradient>

    <linearGradient id="goldSpecularGradient" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3B2001" stop-opacity="0.05" />
      <stop offset="35%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="70%" stop-color="#E8C76A" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.95" />
    </linearGradient>

    <linearGradient id="goldRodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#542E02" />
      <stop offset="20%" stop-color="#C9A227" />
      <stop offset="45%" stop-color="#FFFDF0" />
      <stop offset="70%" stop-color="#E8C76A" />
      <stop offset="90%" stop-color="#8C6A12" />
      <stop offset="100%" stop-color="#462201" />
    </linearGradient>

    <filter id="richShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="4" stdDeviation="3.5" flood-color="#221100" flood-opacity="0.4" />
      <feDropShadow dx="-1" dy="-1" stdDeviation="1.5" flood-color="#FFFFFF" flood-opacity="0.7" />
    </filter>

    <filter id="elementBevel" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="2.5" dy="3.5" stdDeviation="2.5" flood-color="#241200" flood-opacity="0.48" />
      <feDropShadow dx="-0.8" dy="-0.8" stdDeviation="1.2" flood-color="#FFFDE8" flood-opacity="0.85" />
    </filter>
    """

    # 1. MASTER FULL LOGO
    full_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 860" width="100%" height="100%">
  <defs>
    {defs}
  </defs>

  <g id="care-master-logo-artwork">
    
    <!-- ============================================================ -->
    <!-- CIRCULAR EMBLEM (CENTER: 400, 330)                           -->
    <!-- ============================================================ -->
    <g id="emblem-group" filter="url(#richShadow)">
      
      <!-- Outer Guilloche Woven Ribbon Wreath -->
      <g id="wreath-mesh">
        {mesh_svg}
      </g>

      <!-- Inner Gold Ring -->
      <circle cx="400" cy="330" r="146" fill="none" stroke="url(#goldMaster3D)" stroke-width="6.5" />
      <circle cx="400" cy="330" r="146" fill="none" stroke="url(#goldSpecularGradient)" stroke-width="2" />
      
      <!-- Inner Thin Gold Accent Ring -->
      <circle cx="400" cy="330" r="138" fill="none" stroke="url(#goldMaster3D)" stroke-width="2.5" />
      <circle cx="400" cy="330" r="138" fill="none" stroke="url(#goldSpecularGradient)" stroke-width="1" />

      <!-- Center Vertical Dividing Bar -->
      <g id="center-dividing-bar" filter="url(#elementBevel)">
        <rect x="396.5" y="222" width="7" height="216" rx="3.5" fill="url(#goldRodGradient)" stroke="url(#goldSpecularGradient)" stroke-width="0.8" />
        <line x1="398.2" y1="225" x2="398.2" y2="435" stroke="#FFFFFF" stroke-width="1.2" opacity="0.95" stroke-linecap="round" />
      </g>

      <!-- ============================================================ -->
      <!-- LEFT: BOTANICAL 3-LEAF CREST WITH HOLLOW GOLD BEVEL          -->
      <!-- ============================================================ -->
      <g id="left-leaf-crest" transform="translate(320, 330)" filter="url(#elementBevel)">
        
        <!-- 1. Center Top Pointed Leaf (Outer Stroke & Inner Core) -->
        <g id="top-leaf">
          <path d="M 0 -48 C -18 -26, -18 -6, 0 10 C 18 -6, 18 -26, 0 -48 Z" 
                fill="none" stroke="url(#goldMaster3D)" stroke-width="7" stroke-linejoin="round" />
          <path d="M 0 -48 C -18 -26, -18 -6, 0 10 C 18 -6, 18 -26, 0 -48 Z" 
                fill="none" stroke="url(#goldSpecularGradient)" stroke-width="2" />
          <line x1="0" y1="-40" x2="0" y2="6" stroke="url(#goldMaster3D)" stroke-width="3" stroke-linecap="round" />
          <line x1="-0.4" y1="-40" x2="-0.4" y2="6" stroke="#FFFFFF" stroke-width="1" opacity="0.9" stroke-linecap="round" />
        </g>

        <!-- 2. Left Angled Leaf -->
        <g id="left-angled-leaf">
          <path d="M -6 -14 C -34 -34, -46 -10, -8 4 C -3 3, -1 -2, -6 -14 Z" 
                fill="none" stroke="url(#goldMaster3D)" stroke-width="6.5" stroke-linejoin="round" />
          <path d="M -6 -14 C -34 -34, -46 -10, -8 4 C -3 3, -1 -2, -6 -14 Z" 
                fill="none" stroke="url(#goldSpecularGradient)" stroke-width="1.8" />
          <line x1="-24" y1="-18" x2="-5" y2="0" stroke="url(#goldMaster3D)" stroke-width="2.6" stroke-linecap="round" />
        </g>

        <!-- 3. Right Angled Leaf -->
        <g id="right-angled-leaf">
          <path d="M 6 -14 C 34 -34, 46 -10, 8 4 C 3 3, 1 -2, 6 -14 Z" 
                fill="none" stroke="url(#goldMaster3D)" stroke-width="6.5" stroke-linejoin="round" />
          <path d="M 6 -14 C 34 -34, 46 -10, 8 4 C 3 3, 1 -2, 6 -14 Z" 
                fill="none" stroke="url(#goldSpecularGradient)" stroke-width="1.8" />
          <line x1="24" y1="-18" x2="5" y2="0" stroke="url(#goldMaster3D)" stroke-width="2.6" stroke-linecap="round" />
        </g>

        <!-- Lower horizontal accent lobes -->
        <path d="M -6 6 C -28 6, -34 22, -8 18 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="5.5" />
        <path d="M 6 6 C 28 6, 34 22, 8 18 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="5.5" />

        <!-- Botanical Base Stem & Anchor Bead -->
        <path d="M 0 10 L 0 38" stroke="url(#goldMaster3D)" stroke-width="6.5" stroke-linecap="round" />
        <path d="M -0.8 10 L -0.8 36" stroke="#FFFFFF" stroke-width="1.6" opacity="0.9" stroke-linecap="round" />
        <circle cx="0" cy="38" r="3.5" fill="url(#goldMaster3D)" />
      </g>

      <!-- ============================================================ -->
      <!-- RIGHT: CLASSICAL ROMAN SERIF 'C' MONOGRAM                    -->
      <!-- ============================================================ -->
      <g id="right-c-monogram" transform="translate(478, 330)" filter="url(#elementBevel)">
        <path d="M 36 -38 C 30 -47, 21 -52, 7 -52 C -20 -52 -38 -31 -38 0 C -38 31 -20 52 7 52 C 22 52 32 45 37 36 L 29 30 C 24 37 17 43 7 43 C -13 43 -26 26 -26 0 C -26 -26 -13 -43 7 -43 C 17 -43 24 -39 28 -33 Z" 
              fill="url(#goldMaster3D)" stroke="url(#goldSpecularGradient)" stroke-width="2.2" />
        
        <!-- Upper Teardrop Terminal Bulb -->
        <circle cx="35" cy="-36" r="7.5" fill="url(#goldMaster3D)" stroke="url(#goldSpecularGradient)" stroke-width="1.4" />
        <circle cx="33.5" cy="-37.5" r="2.4" fill="#FFFFFF" opacity="0.95" />

        <!-- Lower Flared Serif Foot -->
        <path d="M 26 30 L 42 38 L 28 44 Z" fill="url(#goldMaster3D)" stroke="url(#goldSpecularGradient)" stroke-width="1.2" />
      </g>

    </g>

    <!-- ============================================================ -->
    <!-- 2. BRAND NAME 'CARe' (High Contrast 3D Roman Serif)          -->
    <!-- ============================================================ -->
    <g id="brand-care-text" transform="translate(400, 630)" filter="url(#elementBevel)" text-anchor="middle">
      <text font-family="'Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Times New Roman', serif" 
            font-size="112" 
            font-weight="900" 
            letter-spacing="20" 
            fill="url(#goldMaster3D)" 
            stroke="url(#goldSpecularGradient)" 
            stroke-width="2.4">
        <tspan x="-185">C</tspan>
        <tspan x="-62">A</tspan>
        <tspan x="62">R</tspan>
        <tspan x="185" font-size="102" dy="4">e</tspan>
      </text>
    </g>

    <!-- ============================================================ -->
    <!-- 3. ORNAMENTAL DIVIDER WITH BOTANICAL CLOVER / FLOURISH KNOT   -->
    <!-- ============================================================ -->
    <g id="divider-knot" transform="translate(400, 695)" filter="url(#elementBevel)">
      <!-- Left tapered rule -->
      <line x1="-300" y1="0" x2="-48" y2="0" stroke="url(#goldMaster3D)" stroke-width="3.5" stroke-linecap="round" />
      <line x1="-300" y1="-1" x2="-48" y2="-1" stroke="url(#goldSpecularGradient)" stroke-width="1.4" stroke-linecap="round" />

      <!-- Center Flourish Knot -->
      <g id="flourish-knot-core">
        <path d="M 0 -13 C -11 -3, -11 3, 0 13 C 11 3, 11 -3, 0 -13 Z" 
              fill="url(#goldMaster3D)" stroke="url(#goldSpecularGradient)" stroke-width="1.6" />
        <circle cx="0" cy="0" r="3" fill="#FFFFFF" opacity="0.95" />

        <path d="M -4 0 C -20 -13, -28 0, -4 8.5 Z" 
              fill="url(#goldMaster3D)" stroke="url(#goldSpecularGradient)" stroke-width="1.4" />
        <path d="M 4 0 C 20 -13, 28 0, 4 8.5 Z" 
              fill="url(#goldMaster3D)" stroke="url(#goldSpecularGradient)" stroke-width="1.4" />
        
        <circle cx="-33" cy="0" r="5.5" fill="url(#goldMaster3D)" stroke="url(#goldSpecularGradient)" stroke-width="1.2" />
        <circle cx="-34" cy="-1.5" r="1.8" fill="#FFFFFF" opacity="0.95" />
        <circle cx="33" cy="0" r="5.5" fill="url(#goldMaster3D)" stroke="url(#goldSpecularGradient)" stroke-width="1.2" />
        <circle cx="32" cy="-1.5" r="1.8" fill="#FFFFFF" opacity="0.95" />
      </g>

      <!-- Right tapered rule -->
      <line x1="48" y1="0" x2="300" y2="0" stroke="url(#goldMaster3D)" stroke-width="3.5" stroke-linecap="round" />
      <line x1="48" y1="-1" x2="300" y2="-1" stroke="url(#goldSpecularGradient)" stroke-width="1.4" stroke-linecap="round" />
    </g>

    <!-- ============================================================ -->
    <!-- 4. TAGLINE 'A BEAUTY SOLUTION'                                -->
    <!-- ============================================================ -->
    <g id="tagline-text" transform="translate(400, 755)" filter="url(#elementBevel)">
      <text font-family="'Cinzel', 'Playfair Display', 'Plus Jakarta Sans', Georgia, serif" 
            font-size="30" 
            font-weight="900" 
            letter-spacing="16" 
            fill="url(#goldMaster3D)" 
            stroke="url(#goldSpecularGradient)" 
            stroke-width="1" 
            text-anchor="middle">
        A BEAUTY SOLUTION
      </text>
    </g>

  </g>
</svg>"""

    with open("public/images/care-official-gold-logo.svg", "w") as f:
        f.write(full_svg)

    # 2. HORIZONTAL HEADER LOGO (Example: Website Header in the reference sheet)
    # Shown on the brand sheet as [ (Emblem)  CARe ] with transparent background!
    header_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 84" width="100%" height="100%">
  <defs>
    {defs}
  </defs>

  <g id="care-header-horizontal-lockup" filter="url(#elementBevel)">
    
    <!-- EMBLEM MEDALLION (CENTER: 42, 42) -->
    <g id="header-emblem" transform="translate(42, 42)">
      
      <!-- Woven Guilloche Mesh (Scaled) -->
      <g transform="scale(0.24) translate(-400, -330)">
        {mesh_svg}
      </g>

      <!-- Inner Gold Ring -->
      <circle cx="0" cy="0" r="26.5" fill="none" stroke="url(#goldMaster3D)" stroke-width="1.8" />
      <circle cx="0" cy="0" r="26.5" fill="none" stroke="url(#goldSpecularGradient)" stroke-width="0.7" />
      <circle cx="0" cy="0" r="24.8" fill="none" stroke="url(#goldMaster3D)" stroke-width="0.9" />

      <!-- Center Dividing Bar -->
      <rect x="-0.8" y="-19.5" width="1.6" height="39" rx="0.8" fill="url(#goldRodGradient)" stroke="url(#goldSpecularGradient)" stroke-width="0.3" />
      <line x1="-0.2" y1="-19" x2="-0.2" y2="19" stroke="#FFFFFF" stroke-width="0.4" opacity="0.95" />

      <!-- Left Botanical Leaf Crest -->
      <g transform="translate(-14.5, 0) scale(0.46)">
        <path d="M 0 -48 C -18 -26, -18 -6, 0 10 C 18 -6, 18 -26, 0 -48 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6.5" />
        <line x1="0" y1="-40" x2="0" y2="6" stroke="url(#goldMaster3D)" stroke-width="3" />
        <path d="M -6 -14 C -34 -34, -46 -10, -8 4 C -3 3, -1 -2, -6 -14 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6" />
        <path d="M 6 -14 C 34 -34, 46 -10, 8 4 C 3 3, 1 -2, 6 -14 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6" />
        <path d="M -6 6 C -28 6, -34 22, -8 18 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="5" />
        <path d="M 6 6 C 28 6, 34 22, 8 18 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="5" />
        <path d="M 0 10 L 0 38" stroke="url(#goldMaster3D)" stroke-width="6.5" stroke-linecap="round" />
      </g>

      <!-- Right Roman 'C' -->
      <g transform="translate(14.5, 0) scale(0.46)">
        <path d="M 36 -38 C 30 -47, 21 -52, 7 -52 C -20 -52 -38 -31 -38 0 C -38 31 -20 52 7 52 C 22 52 32 45 37 36 L 29 30 C 24 37 17 43 7 43 C -13 43 -26 26 -26 0 C -26 -26 -13 -43 7 -43 C 17 -43 24 -39 28 -33 Z" 
              fill="url(#goldMaster3D)" stroke="url(#goldSpecularGradient)" stroke-width="2" />
        <circle cx="35" cy="-36" r="7.5" fill="url(#goldMaster3D)" stroke="url(#goldSpecularGradient)" stroke-width="1.2" />
        <path d="M 26 30 L 42 38 L 28 44 Z" fill="url(#goldMaster3D)" />
      </g>

    </g>

    <!-- RIGHT: 'CARe' WORDMARK (EXACTLY AS IN WEBSITE HEADER PREVIEW) -->
    <g transform="translate(94, 53)">
      <text font-family="'Cinzel', 'Playfair Display', Georgia, serif" 
            font-size="44" 
            font-weight="900" 
            letter-spacing="6" 
            fill="url(#goldMaster3D)" 
            stroke="url(#goldSpecularGradient)" 
            stroke-width="1">
        <tspan x="0">C</tspan>
        <tspan x="38">A</tspan>
        <tspan x="78">R</tspan>
        <tspan x="118" font-size="39" dy="1">e</tspan>
      </text>
    </g>

  </g>
</svg>"""

    with open("public/images/care-official-gold-logo-horizontal.svg", "w") as f:
        f.write(header_svg)

    # 3. ICON / FAVICON / MOBILE VERSION (Circular emblem only on transparent background)
    icon_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    {defs}
  </defs>

  <g id="care-icon-emblem" transform="translate(200, 200)" filter="url(#richShadow)">
    
    <!-- Woven Guilloche Mesh -->
    <g transform="scale(0.85) translate(-400, -330)">
      {mesh_svg}
    </g>

    <!-- Inner Gold Double Rings -->
    <circle cx="0" cy="0" r="114" fill="none" stroke="url(#goldMaster3D)" stroke-width="5" />
    <circle cx="0" cy="0" r="114" fill="none" stroke="url(#goldSpecularGradient)" stroke-width="1.6" />
    <circle cx="0" cy="0" r="107" fill="none" stroke="url(#goldMaster3D)" stroke-width="2.2" />

    <!-- Center Dividing Bar -->
    <rect x="-3" y="-84" width="6" height="168" rx="3" fill="url(#goldRodGradient)" stroke="url(#goldSpecularGradient)" stroke-width="0.8" />
    <line x1="-0.8" y1="-82" x2="-0.8" y2="82" stroke="#FFFFFF" stroke-width="1.2" opacity="0.95" />

    <!-- Left Botanical Leaf Crest -->
    <g transform="translate(-62, 0)" filter="url(#elementBevel)">
      <path d="M 0 -48 C -18 -26, -18 -6, 0 10 C 18 -6, 18 -26, 0 -48 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="7" stroke-linejoin="round" />
      <line x1="0" y1="-40" x2="0" y2="6" stroke="url(#goldMaster3D)" stroke-width="3" />
      <path d="M -6 -14 C -34 -34, -46 -10, -8 4 C -3 3, -1 -2, -6 -14 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6.5" stroke-linejoin="round" />
      <path d="M 6 -14 C 34 -34, 46 -10, 8 4 C 3 3, 1 -2, 6 -14 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="6.5" stroke-linejoin="round" />
      <path d="M -6 6 C -28 6, -34 22, -8 18 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="5.5" />
      <path d="M 6 6 C 28 6, 34 22, 8 18 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="5.5" />
      <path d="M 0 10 L 0 38" stroke="url(#goldMaster3D)" stroke-width="6.5" stroke-linecap="round" />
      <circle cx="0" cy="38" r="3.5" fill="url(#goldMaster3D)" />
    </g>

    <!-- Right Roman Serif 'C' -->
    <g transform="translate(62, 0)" filter="url(#elementBevel)">
      <path d="M 36 -38 C 30 -47, 21 -52, 7 -52 C -20 -52 -38 -31 -38 0 C -38 31 -20 52 7 52 C 22 52 32 45 37 36 L 29 30 C 24 37 17 43 7 43 C -13 43 -26 26 -26 0 C -26 -26 -13 -43 7 -43 C 17 -43 24 -39 28 -33 Z" 
            fill="url(#goldMaster3D)" stroke="url(#goldSpecularGradient)" stroke-width="2.2" />
      <circle cx="35" cy="-36" r="7.5" fill="url(#goldMaster3D)" stroke="url(#goldSpecularGradient)" stroke-width="1.4" />
      <circle cx="33.5" cy="-37.5" r="2.4" fill="#FFFFFF" opacity="0.95" />
      <path d="M 26 30 L 42 38 L 28 44 Z" fill="url(#goldMaster3D)" stroke="url(#goldSpecularGradient)" stroke-width="1.2" />
    </g>

  </g>
</svg>"""

    with open("public/images/care-emblem-icon.svg", "w") as f:
        f.write(icon_svg)
    with open("public/favicon.svg", "w") as f:
        f.write(icon_svg)

    print("All authentic brand assets successfully regenerated!")

if __name__ == "__main__":
    generate_accurate_brand_assets()
