import math

def build_master_care_svg():
    # Outer guilloche braided wreath parameters
    # The reference image has 20-24 overlapping golden rings / loop petals forming a woven ribbon wreath
    loops = 24
    wreath_elements = []
    
    # Outer ring radius ~ 150, center (300, 230)
    for i in range(loops):
        angle = i * (360.0 / loops)
        # Each loop is an ellipse rotated around center
        wreath_elements.append(
            f'<ellipse cx="300" cy="230" rx="142" ry="46" transform="rotate({angle:.2f} 300 230)" '
            f'fill="none" stroke="url(#goldWire3D)" stroke-width="3.2" filter="url(#dropShadowFine)" />'
        )
        wreath_elements.append(
            f'<ellipse cx="300" cy="230" rx="142" ry="46" transform="rotate({angle:.2f} 300 230)" '
            f'fill="none" stroke="url(#goldHighlight3D)" stroke-width="1.2" />'
        )

    wreath_svg = "\n    ".join(wreath_elements)

    svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 680" width="100%" height="100%">
  <defs>
    <!-- Ultra-Realistic 24K Luxury Gold Gradients -->
    <linearGradient id="goldMetallic3D" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#704407" />
      <stop offset="12%" stop-color="#A57318" />
      <stop offset="26%" stop-color="#E9BD4C" />
      <stop offset="40%" stop-color="#FFF5C6" />
      <stop offset="55%" stop-color="#E2B13F" />
      <stop offset="72%" stop-color="#A06E16" />
      <stop offset="86%" stop-color="#FBF0B5" />
      <stop offset="100%" stop-color="#5E3603" />
    </linearGradient>

    <linearGradient id="goldHighlight3D" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4E2B01" />
      <stop offset="25%" stop-color="#C7972D" />
      <stop offset="50%" stop-color="#FFFFFF" />
      <stop offset="75%" stop-color="#D9A833" />
      <stop offset="100%" stop-color="#6E3F05" />
    </linearGradient>

    <linearGradient id="goldWire3D" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#7A4D09" />
      <stop offset="25%" stop-color="#E5B946" />
      <stop offset="50%" stop-color="#FFF7D1" />
      <stop offset="75%" stop-color="#B8821C" />
      <stop offset="100%" stop-color="#5A3202" />
    </linearGradient>

    <linearGradient id="goldLeafFill" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9C6B14" />
      <stop offset="30%" stop-color="#F7E298" />
      <stop offset="60%" stop-color="#D4A330" />
      <stop offset="100%" stop-color="#734606" />
    </linearGradient>

    <!-- Deep Metallic 3D Drop Shadows & Bevel -->
    <filter id="dropShadowMaster" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1.5" dy="3.5" stdDeviation="3" flood-color="#2D1801" flood-opacity="0.55" />
      <feDropShadow dx="-0.8" dy="-0.8" stdDeviation="1.2" flood-color="#FFF8D6" flood-opacity="0.6" />
    </filter>

    <filter id="dropShadowFine" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#3B2002" flood-opacity="0.45" />
    </filter>

    <filter id="textBevel" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1.5" dy="3" stdDeviation="2.2" flood-color="#301A01" flood-opacity="0.6" />
      <feDropShadow dx="-0.5" dy="-0.5" stdDeviation="1" flood-color="#FFFBE3" flood-opacity="0.7" />
    </filter>
  </defs>

  <g id="care-master-brand-logo" filter="url(#dropShadowMaster)">
    
    <!-- ============================================================ -->
    <!-- 1. CIRCULAR EMBLEM MEDALLION (Center 300, 230)               -->
    <!-- ============================================================ -->
    
    <!-- Outer Guilloche Woven Lattice Ribbon Ring -->
    <g id="outer-guilloche-wreath">
      {wreath_svg}
    </g>

    <!-- Inner Smooth Circular Boundary (Double Gold Rings with Clean Fill) -->
    <circle cx="300" cy="230" r="115" fill="#FFFDF9" stroke="url(#goldMetallic3D)" stroke-width="5" />
    <circle cx="300" cy="230" r="115" fill="none" stroke="url(#goldHighlight3D)" stroke-width="1.8" />
    <circle cx="300" cy="230" r="108" fill="none" stroke="url(#goldMetallic3D)" stroke-width="2.2" />

    <!-- Center Vertical Gold Dividing Rod (Rounded 3D Bar) -->
    <g id="center-divider-bar">
      <!-- Cast Shadow -->
      <rect x="299" y="148" width="7" height="164" rx="3.5" fill="#2E1700" opacity="0.3" filter="url(#dropShadowFine)" />
      <!-- Gold Cylinder Body -->
      <rect x="297" y="146" width="6.5" height="164" rx="3.25" fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="1" />
      <!-- Specular Highlight Line -->
      <line x1="298.5" y1="149" x2="298.5" y2="307" stroke="#FFFFFF" stroke-width="1.2" opacity="0.85" stroke-linecap="round" />
    </g>

    <!-- ============================================================ -->
    <!-- LEFT SIDE: 5-LEAF BOTANICAL EMBLEM (Natural Wellness & Organic)-->
    <!-- ============================================================ -->
    <g id="left-leaf-crest" transform="translate(236, 230)">
      <!-- 1. Top Vertical Leaf -->
      <path d="M 0 -38 C -14 -22, -14 -6, 0 8 C 14 -6, 14 -22, 0 -38 Z" 
            fill="url(#goldLeafFill)" stroke="url(#goldMetallic3D)" stroke-width="2.8" />
      <path d="M 0 -34 C -10 -20, -10 -8, 0 4 C 10 -8, 10 -20, 0 -34 Z" 
            fill="none" stroke="url(#goldHighlight3D)" stroke-width="1" />
      <!-- Center Vein -->
      <line x1="0" y1="-30" x2="0" y2="5" stroke="#5E3502" stroke-width="1.6" />
      <line x1="-0.4" y1="-30" x2="-0.4" y2="5" stroke="#FFF5C6" stroke-width="0.8" />

      <!-- 2. Upper-Left Angled Leaf -->
      <path d="M -5 -8 C -26 -24, -38 -6, -8 5 C -4 4, -2 0, -5 -8 Z" 
            fill="url(#goldLeafFill)" stroke="url(#goldMetallic3D)" stroke-width="2.6" />
      <line x1="-18" y1="-12" x2="-4" y2="2" stroke="#5E3502" stroke-width="1.4" />
      <line x1="-18" y1="-12.5" x2="-4" y2="1.5" stroke="#FFF5C6" stroke-width="0.6" />

      <!-- 3. Upper-Right Angled Leaf -->
      <path d="M 5 -8 C 26 -24, 38 -6, 8 5 C 4 4, 2 0, 5 -8 Z" 
            fill="url(#goldLeafFill)" stroke="url(#goldMetallic3D)" stroke-width="2.6" />
      <line x1="18" y1="-12" x2="4" y2="2" stroke="#5E3502" stroke-width="1.4" />
      <line x1="18" y1="-12.5" x2="4" y2="1.5" stroke="#FFF5C6" stroke-width="0.6" />

      <!-- 4. Lower-Left Horizontal Leaf -->
      <path d="M -5 6 C -30 2, -36 20, -7 18 C -3 16, -3 10, -5 6 Z" 
            fill="url(#goldLeafFill)" stroke="url(#goldMetallic3D)" stroke-width="2.6" />
      <line x1="-20" y1="11" x2="-4" y2="12" stroke="#5E3502" stroke-width="1.3" />
      <line x1="-20" y1="10.5" x2="-4" y2="11.5" stroke="#FFF5C6" stroke-width="0.6" />

      <!-- 5. Lower-Right Horizontal Leaf -->
      <path d="M 5 6 C 30 2, 36 20, 7 18 C 3 16, 3 10, 5 6 Z" 
            fill="url(#goldLeafFill)" stroke="url(#goldMetallic3D)" stroke-width="2.6" />
      <line x1="20" y1="11" x2="4" y2="12" stroke="#5E3502" stroke-width="1.3" />
      <line x1="20" y1="10.5" x2="4" y2="11.5" stroke="#FFF5C6" stroke-width="0.6" />

      <!-- Center Botanical Stem Base -->
      <path d="M 0 6 L 0 32" stroke="url(#goldMetallic3D)" stroke-width="5" stroke-linecap="round" />
      <path d="M -0.8 7 L -0.8 30" stroke="#FFF5C6" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="0" cy="32" r="3.2" fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="0.8" />
    </g>

    <!-- ============================================================ -->
    <!-- RIGHT SIDE: ROMAN SERIF 'C' (Premium Monogram for CARe)      -->
    <!-- ============================================================ -->
    <g id="right-monogram-c" transform="translate(362, 230)">
      <!-- Main Roman Serif 'C' Path with classical thick-thin modulation -->
      <path d="M 28 -30 C 24 -36, 17 -40, 6 -40 C -16 -40 -30 -24 -30 0 C -30 24 -16 40 6 40 C 18 40 25 34 29 28 L 23 24 C 19 29 14 33 6 33 C -10 33 -21 20 -21 0 C -21 -20 -10 -33 6 -33 C 14 -33 20 -29 23 -25 Z" 
            fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="2" />
      
      <!-- Upper Teardrop Terminal Bulb -->
      <circle cx="27" cy="-28" r="5.5" fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="1.2" />
      <circle cx="26" cy="-29" r="2" fill="#FFFFFF" opacity="0.9" />

      <!-- Lower Flared Serif Foot -->
      <path d="M 20 24 L 32 30 L 22 34 Z" fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="1" />
    </g>

    <!-- ============================================================ -->
    <!-- 2. BRAND NAME 'CARe' (Refined 3D Metallic Serif Typography)   -->
    <!-- ============================================================ -->
    <g id="brand-wordmark-care" transform="translate(300, 485)" filter="url(#textBevel)" text-anchor="middle">
      <text font-family="'Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Times New Roman', serif" 
            font-size="86" 
            font-weight="900" 
            letter-spacing="16" 
            fill="url(#goldMetallic3D)" 
            stroke="url(#goldHighlight3D)" 
            stroke-width="1.8">
        <tspan x="-140">C</tspan>
        <tspan x="-48">A</tspan>
        <tspan x="48">R</tspan>
        <tspan x="140" font-size="78" dy="2">e</tspan>
      </text>
    </g>

    <!-- ============================================================ -->
    <!-- 3. DECORATIVE ORNAMENTAL DIVIDER WITH CENTRAL FLOURISH KNOT   -->
    <!-- ============================================================ -->
    <g id="ornamental-divider" transform="translate(300, 535)">
      <!-- Left Fine Rule Line with Tapering Edge -->
      <line x1="-225" y1="0" x2="-36" y2="0" stroke="url(#goldMetallic3D)" stroke-width="3" stroke-linecap="round" />
      <line x1="-225" y1="-0.8" x2="-36" y2="-0.8" stroke="url(#goldHighlight3D)" stroke-width="1.2" stroke-linecap="round" />

      <!-- Center Fleur-de-lis / Botanical Flourish Knot -->
      <g id="central-flourish">
        <!-- Center Oval Leaflet -->
        <path d="M 0 -10 C -8 -2, -8 2, 0 10 C 8 2, 8 -2, 0 -10 Z" 
              fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="1.4" />
        <circle cx="0" cy="0" r="2.2" fill="#FFFFFF" opacity="0.9" />

        <!-- Left Loop -->
        <path d="M -3 0 C -15 -10, -22 0, -3 6 Z" 
              fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="1.2" />
        
        <!-- Right Loop -->
        <path d="M 3 0 C 15 -10, 22 0, 3 6 Z" 
              fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="1.2" />
        
        <!-- Flanking Accent Gold Beads -->
        <circle cx="-25" cy="0" r="4.2" fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="1" />
        <circle cx="-26" cy="-1.2" r="1.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="25" cy="0" r="4.2" fill="url(#goldMetallic3D)" stroke="url(#goldHighlight3D)" stroke-width="1" />
        <circle cx="24" cy="-1.2" r="1.5" fill="#FFFFFF" opacity="0.9" />
      </g>

      <!-- Right Fine Rule Line with Tapering Edge -->
      <line x1="36" y1="0" x2="225" y2="0" stroke="url(#goldMetallic3D)" stroke-width="3" stroke-linecap="round" />
      <line x1="36" y1="-0.8" x2="225" y2="-0.8" stroke="url(#goldHighlight3D)" stroke-width="1.2" stroke-linecap="round" />
    </g>

    <!-- ============================================================ -->
    <!-- 4. TAGLINE 'A BEAUTY SOLUTION'                                -->
    <!-- ============================================================ -->
    <g id="brand-tagline" transform="translate(300, 582)" filter="url(#textBevel)">
      <text font-family="'Cinzel', 'Playfair Display', 'Plus Jakarta Sans', Georgia, serif" 
            font-size="22" 
            font-weight="900" 
            letter-spacing="12" 
            fill="url(#goldMetallic3D)" 
            stroke="url(#goldHighlight3D)" 
            stroke-width="0.8" 
            text-anchor="middle">
        A BEAUTY SOLUTION
      </text>
    </g>

  </g>
</svg>"""

    with open("public/images/care-official-gold-logo.svg", "w") as f:
        f.write(svg_code)
    print("Master full logo generated at public/images/care-official-gold-logo.svg")

def build_horizontal_care_svg():
    # Horizontal version specifically for Navbar and Footer:
    # High-legibility emblem with bolder 5-leaf crest, thicker C, and prominent CARe
    loops = 24
    wreath_elements = []
    
    # Emblem centered at (60, 55), radius ~46
    for i in range(loops):
        angle = i * (360.0 / loops)
        wreath_elements.append(
            f'<ellipse cx="60" cy="55" rx="46" ry="15" transform="rotate({angle:.2f} 60 55)" '
            f'fill="none" stroke="url(#goldWire3DH)" stroke-width="2.2" />'
        )
        wreath_elements.append(
            f'<ellipse cx="60" cy="55" rx="46" ry="15" transform="rotate({angle:.2f} 60 55)" '
            f'fill="none" stroke="url(#goldHighlight3DH)" stroke-width="0.8" />'
        )

    wreath_svg = "\n    ".join(wreath_elements)

    svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 110" width="100%" height="100%">
  <defs>
    <linearGradient id="goldMetallic3DH" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#704407" />
      <stop offset="15%" stop-color="#B37E1E" />
      <stop offset="30%" stop-color="#FBE698" />
      <stop offset="50%" stop-color="#E2B13F" />
      <stop offset="70%" stop-color="#9C6B14" />
      <stop offset="85%" stop-color="#FDF2BA" />
      <stop offset="100%" stop-color="#5E3603" />
    </linearGradient>

    <linearGradient id="goldHighlight3DH" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4E2B01" />
      <stop offset="30%" stop-color="#DDA934" />
      <stop offset="50%" stop-color="#FFFFFF" />
      <stop offset="75%" stop-color="#D9A833" />
      <stop offset="100%" stop-color="#6E3F05" />
    </linearGradient>

    <linearGradient id="goldWire3DH" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#7A4D09" />
      <stop offset="25%" stop-color="#E5B946" />
      <stop offset="50%" stop-color="#FFF7D1" />
      <stop offset="75%" stop-color="#B8821C" />
      <stop offset="100%" stop-color="#5A3202" />
    </linearGradient>

    <filter id="dropShadowH" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#2D1801" flood-opacity="0.55" />
    </filter>
  </defs>

  <g id="care-horizontal-logo" filter="url(#dropShadowH)">
    
    <!-- ========================================== -->
    <!-- 1. CIRCULAR EMBLEM (CENTER: 60, 55)        -->
    <!-- ========================================== -->
    <g id="horizontal-emblem">
      <!-- Outer Guilloche Woven Lattice Wreath -->
      {wreath_svg}

      <!-- Inner Circular Boundary Double Rings with Clean Cream Background -->
      <circle cx="60" cy="55" r="37" fill="#FFFDF9" stroke="url(#goldMetallic3DH)" stroke-width="2.8" />
      <circle cx="60" cy="55" r="37" fill="none" stroke="url(#goldHighlight3DH)" stroke-width="1" />
      <circle cx="60" cy="55" r="34" fill="none" stroke="url(#goldMetallic3DH)" stroke-width="1.2" />

      <!-- Center Vertical Dividing Rod -->
      <rect x="58.8" y="27" width="2.4" height="56" rx="1.2" fill="url(#goldMetallic3DH)" stroke="url(#goldHighlight3DH)" stroke-width="0.5" />
      <line x1="59.4" y1="28" x2="59.4" y2="82" stroke="#FFFFFF" stroke-width="0.6" opacity="0.9" />

      <!-- Left 5-Leaf Botanical Crest (Bold, Crisp & Highly Visible) -->
      <g transform="translate(39, 55)">
        <!-- Top vertical leaf -->
        <path d="M 0 -13 C -5 -7, -5 -2, 0 3 C 5 -2, 5 -7, 0 -13 Z" 
              fill="url(#goldMetallic3DH)" stroke="url(#goldHighlight3DH)" stroke-width="0.8" />
        <line x1="0" y1="-10" x2="0" y2="2" stroke="#5E3502" stroke-width="0.6" />

        <!-- Upper left & right angled leaves -->
        <path d="M -2 -3 C -9 -8, -13 -2, -3 2 Z" fill="url(#goldMetallic3DH)" stroke="url(#goldHighlight3DH)" stroke-width="0.7" />
        <path d="M 2 -3 C 9 -8, 13 -2, 3 2 Z" fill="url(#goldMetallic3DH)" stroke="url(#goldHighlight3DH)" stroke-width="0.7" />

        <!-- Lower left & right horizontal leaves -->
        <path d="M -2 2 C -10 1, -12 7, -2 6 Z" fill="url(#goldMetallic3DH)" stroke="url(#goldHighlight3DH)" stroke-width="0.7" />
        <path d="M 2 2 C 10 1, 12 7, 2 6 Z" fill="url(#goldMetallic3DH)" stroke="url(#goldHighlight3DH)" stroke-width="0.7" />

        <!-- Stem base -->
        <path d="M 0 3 L 0 11" stroke="url(#goldMetallic3DH)" stroke-width="2" stroke-linecap="round" />
        <circle cx="0" cy="11" r="1.2" fill="url(#goldMetallic3DH)" />
      </g>

      <!-- Right Roman Serif 'C' (Bold, Crisp & Distinct) -->
      <g transform="translate(80, 55)">
        <path d="M 10 -11 C 8 -13, 6 -14, 2 -14 C -6 -14, -11 -8, -11 0 C -11 8, -6 14, 2 14 C 6 14, 9 12, 10 10 L 8 8 C 6 10, 4 11, 2 11 C -3 11, -7 7, -7 0 C -7 -7, -3 -11, 2 -11 C 5 -11, 7 -9, 8 -8 Z" 
              fill="url(#goldMetallic3DH)" stroke="url(#goldHighlight3DH)" stroke-width="0.8" />
        <!-- Top terminal bulb -->
        <circle cx="9.5" cy="-10" r="2" fill="url(#goldMetallic3DH)" stroke="url(#goldHighlight3DH)" stroke-width="0.4" />
        <!-- Bottom serif foot -->
        <path d="M 7 8 L 11 11 L 8 12 Z" fill="url(#goldMetallic3DH)" />
      </g>
    </g>

    <!-- ============================================================ -->
    <!-- 2. RIGHT SIDE TYPOGRAPHY: 'CARe' + DIVIDER + 'A BEAUTY SOLUTION' -->
    <!-- ============================================================ -->
    <g transform="translate(132, 0)">
      
      <!-- 'CARe' Bold Gold Luxury Serif -->
      <text y="53" font-family="'Cinzel', 'Playfair Display', Georgia, serif" 
            font-size="50" 
            font-weight="900" 
            letter-spacing="6" 
            fill="url(#goldMetallic3DH)" 
            stroke="url(#goldHighlight3DH)" 
            stroke-width="1.2">
        <tspan x="0">C</tspan>
        <tspan x="48">A</tspan>
        <tspan x="98">R</tspan>
        <tspan x="148" font-size="45" dy="1">e</tspan>
      </text>

      <!-- Ornamental Divider Rule & Center Knot -->
      <g transform="translate(0, 68)">
        <!-- Left Rule -->
        <line x1="0" y1="0" x2="135" y2="0" stroke="url(#goldMetallic3DH)" stroke-width="2" />
        <line x1="0" y1="-0.5" x2="135" y2="-0.5" stroke="url(#goldHighlight3DH)" stroke-width="0.8" />

        <!-- Center Knot Flourish -->
        <g transform="translate(155, 0)">
          <path d="M 0 -5 C -4 -1, -4 1, 0 5 C 4 1, 4 -1, 0 -5 Z" fill="url(#goldMetallic3DH)" stroke="url(#goldHighlight3DH)" stroke-width="0.8" />
          <circle cx="-12" cy="0" r="2.2" fill="url(#goldMetallic3DH)" />
          <circle cx="12" cy="0" r="2.2" fill="url(#goldMetallic3DH)" />
        </g>

        <!-- Right Rule -->
        <line x1="175" y1="0" x2="310" y2="0" stroke="url(#goldMetallic3DH)" stroke-width="2" />
        <line x1="175" y1="-0.5" x2="310" y2="-0.5" stroke="url(#goldHighlight3DH)" stroke-width="0.8" />
      </g>

      <!-- Subtitle 'A BEAUTY SOLUTION' -->
      <text x="155" y="88" 
            font-family="'Cinzel', 'Playfair Display', 'Plus Jakarta Sans', sans-serif" 
            font-size="13" 
            font-weight="900" 
            letter-spacing="5.5" 
            fill="url(#goldMetallic3DH)" 
            stroke="url(#goldHighlight3DH)" 
            stroke-width="0.4" 
            text-anchor="middle">
        A BEAUTY SOLUTION
      </text>
    </g>

  </g>
</svg>"""

    with open("public/images/care-official-gold-logo-horizontal.svg", "w") as f:
        f.write(svg_code)
    print("Horizontal logo generated at public/images/care-official-gold-logo-horizontal.svg")

if __name__ == "__main__":
    build_master_care_svg()
    build_horizontal_care_svg()
