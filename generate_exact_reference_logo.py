import math

def build_exact_reference_svg():
    # Exactly matches user's provided original image:
    # 1. Background: Pure clean white with subtle soft luxury vignette shadow around emblem
    # 2. Outer Wreath: Interlaced woven guilloche ribbon mesh with exactly 24 overlapping golden rings and detailed 3D gold wire shading
    # 3. Inner Circle: Double thin concentric rings with soft warm ivory center
    # 4. Dividing Bar: Tall 3D rounded golden vertical cylinder down the center with cast shadow and specular highlight
    # 5. Left: 5-Leaf Botanical Crest - 1 top vertical leaf, 2 diagonal upper leaves, 2 horizontal lower leaves with center vein lines and vertical stem with anchor bead
    # 6. Right: Classical Roman serif 'C' with top teardrop terminal bulb and flared serif bottom foot
    # 7. Wordmark: 'CARe' - Large bold serif C, A, R, and lowercase e with rich 3D gold bevel, realistic metallic reflections and cast drop shadow
    # 8. Divider: Ornate horizontal gold rule with central botanical clover/fleur-de-lis knot and flanking golden beads
    # 9. Tagline: 'A BEAUTY SOLUTION' in spaced uppercase serif lettering
    
    num_loops = 24
    cx, cy = 400, 318
    rx, ry = 175, 58
    
    # Generate multi-layer guilloche wire loops
    wreath_layers = []
    
    # Layer 1: Ambient deep shadow under wreath
    for i in range(num_loops):
        angle = i * (360.0 / num_loops)
        wreath_layers.append(
            f'<ellipse cx="{cx+1.5}" cy="{cy+3.5}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" '
            f'fill="none" stroke="#281400" stroke-width="3" opacity="0.32" />'
        )
    
    # Layer 2: Main 3D metallic gold wire loops
    for i in range(num_loops):
        angle = i * (360.0 / num_loops)
        wreath_layers.append(
            f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" '
            f'fill="none" stroke="url(#goldWire3D)" stroke-width="3.6" />'
        )
        
    # Layer 3: Specular bright reflection on wire edge
    for i in range(num_loops):
        angle = i * (360.0 / num_loops)
        wreath_layers.append(
            f'<ellipse cx="{cx-0.8}" cy="{cy-0.8}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" '
            f'fill="none" stroke="url(#goldHighlight3D)" stroke-width="1.2" opacity="0.9" />'
        )

    wreath_svg = "\n    ".join(wreath_layers)

    svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 820" width="100%" height="100%">
  <defs>
    <!-- Ultra-Realistic 24K Luxury Gold Metallic Gradients matching image.png -->
    <linearGradient id="goldMetallic3D" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6B3F04" />
      <stop offset="10%" stop-color="#9C6B14" />
      <stop offset="24%" stop-color="#E2B13F" />
      <stop offset="38%" stop-color="#FFF8D6" />
      <stop offset="52%" stop-color="#E5B946" />
      <stop offset="68%" stop-color="#9C6B14" />
      <stop offset="84%" stop-color="#FDF1B8" />
      <stop offset="100%" stop-color="#542E02" />
    </linearGradient>

    <linearGradient id="goldHighlight3D" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4E2901" stop-opacity="0.1" />
      <stop offset="30%" stop-color="#DDA934" stop-opacity="0.6" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.98" />
      <stop offset="75%" stop-color="#FDF1B8" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.98" />
    </linearGradient>

    <linearGradient id="goldWire3D" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#734606" />
      <stop offset="22%" stop-color="#DFAC38" />
      <stop offset="48%" stop-color="#FFF6CC" />
      <stop offset="72%" stop-color="#B8831F" />
      <stop offset="100%" stop-color="#4E2901" />
    </linearGradient>

    <linearGradient id="goldLeafFill" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8C6A12" />
      <stop offset="25%" stop-color="#FFF0A8" />
      <stop offset="55%" stop-color="#C9A227" />
      <stop offset="85%" stop-color="#FDF1B8" />
      <stop offset="100%" stop-color="#5E3D07" />
    </linearGradient>

    <linearGradient id="goldRod3D" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4A2600" />
      <stop offset="20%" stop-color="#C59328" />
      <stop offset="45%" stop-color="#FFF8D6" />
      <stop offset="70%" stop-color="#D59F2D" />
      <stop offset="88%" stop-color="#7E4E0A" />
      <stop offset="100%" stop-color="#3D1D00" />
    </linearGradient>

    <!-- Deep Metallic 3D Drop Shadows & Bevels matching reference image -->
    <filter id="dropShadowMaster" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#241200" flood-opacity="0.45" />
      <feDropShadow dx="-1" dy="-1" stdDeviation="1.5" flood-color="#FFFFFF" flood-opacity="0.8" />
    </filter>

    <filter id="dropShadowFine" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1.2" dy="2.2" stdDeviation="1.5" flood-color="#2D1701" flood-opacity="0.4" />
    </filter>

    <filter id="textBevel" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="3.5" stdDeviation="2.5" flood-color="#281300" flood-opacity="0.5" />
      <feDropShadow dx="-0.8" dy="-0.8" stdDeviation="1.2" flood-color="#FFFBE0" flood-opacity="0.8" />
    </filter>
  </defs>

  <!-- Clean Canvas Background matching image.png exactly -->
  <rect width="100%" height="100%" fill="#FFFFFF" />

  <g id="care-master-brand-logo">
    
    <!-- ============================================================ -->
    <!-- 1. CIRCULAR EMBLEM MEDALLION (Center 400, 318)               -->
    <!-- ============================================================ -->
    <g id="medallion-emblem" filter="url(#dropShadowMaster)">
      
      <!-- Outer Guilloche Woven Lattice Ribbon Ring -->
      <g id="outer-guilloche-wreath">
        {wreath_svg}
      </g>

      <!-- Inner Smooth Circular Boundary (Double Gold Rings with Clean Fill) -->
      <circle cx="400" cy="318" r="142" fill="#FFFFFF" stroke="url(#goldMetallic3D)" stroke-width="5.5" />
      <circle cx="400" cy="318" r="142" fill="none" stroke="url(#goldHighlight3D)" stroke-width="1.8" />
      <circle cx="400" cy="318" r="134" fill="none" stroke="url(#goldMetallic3D)" stroke-width="2.4" />

      <!-- Center Vertical Gold Dividing Rod (Rounded 3D Bar) -->
      <g id="center-divider-bar">
        <!-- Cast Shadow -->
        <rect x="398.5" y="214" width="8" height="208" rx="4" fill="#2E1700" opacity="0.3" filter="url(#dropShadowFine)" />
        <!-- Gold Cylinder Body -->
        <rect x="396" y="212" width="7.5" height="208" rx="3.75" fill="url(#goldRod3D)" stroke="url(#goldHighlight3D)" stroke-width="1" />
        <!-- Specular Highlight Line -->
        <line x1="398" y1="216" x2="398" y2="416" stroke="#FFFFFF" stroke-width="1.2" opacity="0.9" stroke-linecap="round" />
      </g>

      <!-- ============================================================ -->
      <!-- LEFT SIDE: 5-LEAF BOTANICAL EMBLEM (Natural Wellness & Organic)-->
      <!-- ============================================================ -->
      <g id="left-leaf-crest" transform="translate(322, 318)">
        <!-- 1. Top Vertical Leaf -->
        <path d="M 0 -48 C -17 -28, -17 -8, 0 10 C 17 -8, 17 -28, 0 -48 Z" 
              fill="url(#goldLeafFill)" stroke="url(#goldMetallic3D)" stroke-width="3.2" />
        <path d="M 0 -43 C -13 -25, -13 -10, 0 5 C 13 -10, 13 -25, 0 -43 Z" 
              fill="none" stroke="url(#goldHighlight3D)" stroke-width="1.2" />
        <!-- Center Vein -->
        <line x1="0" y1="-38" x2="0" y2="7" stroke="#5E3502" stroke-width="1.8" />
        <line x1="-0.4" y1="-38" x2="-0.4" y2="7" stroke="#FFF5C6" stroke-width="0.8" />

        <!-- 2. Upper-Left Angled Leaf -->
        <path d="M -6 -10 C -33 -30, -48 -8, -10 6 C -5 5, -2 0, -6 -10 Z" 
              fill="url(#goldLeafFill)" stroke="url(#goldMetallic3D)" stroke-width="3" />
        <line x1="-23" y1="-15" x2="-5" y2="2" stroke="#5E3502" stroke-width="1.6" />
        <line x1="-23" y1="-15.5" x2="-5" y2="1.5" stroke="#FFF5C6" stroke-width="0.7" />

        <!-- 3. Upper-Right Angled Leaf -->
        <path d="M 6 -10 C 33 -30, 48 -8, 10 6 C 5 5, 2 0, 6 -10 Z" 
              fill="url(#goldLeafFill)" stroke="url(#goldMetallic3D)" stroke-width="3" />
        <line x1="23" y1="-15" x2="5" y2="2" stroke="#5E3502" stroke-width="1.6" />
        <line x1="23" y1="-15.5" x2="5" y2="1.5" stroke="#FFF5C6" stroke-width="0.7" />

        <!-- 4. Lower-Left Horizontal Leaf -->
        <path d="M -6 8 C -38 2, -45 25, -9 23 C -4 21, -4 13, -6 8 Z" 
              fill="url(#goldLeafFill)" stroke="url(#goldMetallic3D)" stroke-width="3" />
        <line x1="-25" y1="14" x2="-5" y2="15" stroke="#5E3502" stroke-width="1.6" />
        <line x1="-25" y1="13.5" x2="-5" y2="14.5" stroke="#FFF5C6" stroke-width="0.7" />

        <!-- 5. Lower-Right Horizontal Leaf -->
        <path d="M 6 8 C 38 2, 45 25, 9 23 C 4 21, 4 13, 6 8 Z" 
              fill="url(#goldLeafFill)" stroke="url(#goldMetallic3D)" stroke-width="3" />
        <line x1="25" y1="14" x2="5" y2="15" stroke="#5E3502" stroke-width="1.6" />
        <line x1="25" y1="13.5" x2="5" y2="14.5" stroke="#FFF5C6" stroke-width="0.7" />

        <!-- Center Botanical Stem Base -->
        <path d="M 0 8 L 0 40" stroke="url(#goldMetallic3D)" stroke-width="6" stroke-linecap="round" />
        <path d="M -0.8 9 L -0.8 38" stroke="#FFF5C6" stroke-width="1.8" stroke-linecap="round" />
        <circle cx="0" cy="40" r="3.8" fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="1" />
      </g>

      <!-- ============================================================ -->
      <!-- RIGHT SIDE: ROMAN SERIF 'C' (Premium Monogram for CARe)      -->
      <!-- ============================================================ -->
      <g id="right-monogram-c" transform="translate(476, 318)">
        <!-- Main Roman Serif 'C' Path with classical thick-thin modulation -->
        <path d="M 35 -36 C 30 -44, 21 -49, 7 -49 C -20 -49 -37 -29 -37 0 C -37 29 -20 49 7 49 C 22 49 31 42 36 34 L 29 29 C 24 35 17 41 7 41 C -12 41 -25 25 -25 0 C -25 -25 -12 -41 7 -41 C 16 -41 23 -37 27 -31 Z" 
              fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="2.4" />
        
        <!-- Upper Teardrop Terminal Bulb -->
        <circle cx="34" cy="-34" r="7" fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="1.4" />
        <circle cx="32.5" cy="-35.5" r="2.2" fill="#FFFFFF" opacity="0.95" />

        <!-- Lower Flared Serif Foot -->
        <path d="M 25 29 L 40 37 L 27 42 Z" fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="1.2" />
      </g>

    </g>

    <!-- ============================================================ -->
    <!-- 2. BRAND NAME 'CARe' (Refined 3D Metallic Serif Typography)   -->
    <!-- ============================================================ -->
    <g id="brand-wordmark-care" transform="translate(400, 615)" filter="url(#textBevel)" text-anchor="middle">
      <text font-family="'Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Times New Roman', serif" 
            font-size="108" 
            font-weight="900" 
            letter-spacing="20" 
            fill="url(#goldMetallic3D)" 
            stroke="url(#goldHighlight3D)" 
            stroke-width="2.2">
        <tspan x="-175">C</tspan>
        <tspan x="-60">A</tspan>
        <tspan x="60">R</tspan>
        <tspan x="175" font-size="98" dy="3">e</tspan>
      </text>
    </g>

    <!-- ============================================================ -->
    <!-- 3. DECORATIVE ORNAMENTAL DIVIDER WITH CENTRAL FLOURISH KNOT   -->
    <!-- ============================================================ -->
    <g id="ornamental-divider" transform="translate(400, 678)">
      <!-- Left Fine Rule Line with Tapering Edge -->
      <line x1="-280" y1="0" x2="-45" y2="0" stroke="url(#goldMetallic3D)" stroke-width="3.5" stroke-linecap="round" />
      <line x1="-280" y1="-1" x2="-45" y2="-1" stroke="url(#goldHighlight3D)" stroke-width="1.4" stroke-linecap="round" />

      <!-- Center Fleur-de-lis / Botanical Flourish Knot -->
      <g id="central-flourish">
        <!-- Center Oval Leaflet -->
        <path d="M 0 -12 C -10 -2, -10 2, 0 12 C 10 2, 10 -2, 0 -12 Z" 
              fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="1.6" />
        <circle cx="0" cy="0" r="2.8" fill="#FFFFFF" opacity="0.95" />

        <!-- Left Loop -->
        <path d="M -4 0 C -19 -12, -27 0, -4 8 Z" 
              fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="1.4" />
        
        <!-- Right Loop -->
        <path d="M 4 0 C 19 -12, 27 0, 4 8 Z" 
              fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="1.4" />
        
        <!-- Flanking Accent Gold Beads -->
        <circle cx="-31" cy="0" r="5.2" fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="1.2" />
        <circle cx="-32" cy="-1.5" r="1.8" fill="#FFFFFF" opacity="0.95" />
        <circle cx="31" cy="0" r="5.2" fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="1.2" />
        <circle cx="30" cy="-1.5" r="1.8" fill="#FFFFFF" opacity="0.95" />
      </g>

      <!-- Right Fine Rule Line with Tapering Edge -->
      <line x1="45" y1="0" x2="280" y2="0" stroke="url(#goldMetallic3D)" stroke-width="3.5" stroke-linecap="round" />
      <line x1="45" y1="-1" x2="280" y2="-1" stroke="url(#goldHighlight3D)" stroke-width="1.4" stroke-linecap="round" />
    </g>

    <!-- ============================================================ -->
    <!-- 4. TAGLINE 'A BEAUTY SOLUTION'                                -->
    <!-- ============================================================ -->
    <g id="brand-tagline" transform="translate(400, 735)" filter="url(#textBevel)">
      <text font-family="'Cinzel', 'Playfair Display', 'Plus Jakarta Sans', Georgia, serif" 
            font-size="28" 
            font-weight="900" 
            letter-spacing="15" 
            fill="url(#goldMetallic3D)" 
            stroke="url(#goldHighlight3D)" 
            stroke-width="1" 
            text-anchor="middle">
        A BEAUTY SOLUTION
      </text>
    </g>

  </g>
</svg>"""

    with open("public/images/care-official-gold-logo.svg", "w") as f:
        f.write(svg_code)
    print("Exact original logo vector saved to public/images/care-official-gold-logo.svg")

if __name__ == "__main__":
    build_exact_reference_svg()
