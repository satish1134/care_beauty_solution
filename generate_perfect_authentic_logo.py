import math

def build_svg():
    # Precision geometric reconstruction matching user's original image:
    # Outer Wreath:
    # An intricate 3D gold wire guilloché wreath composed of interlacing elliptical rings with metallic tubular bevels, specular reflections, and soft ambient occlusion shadows.
    # Inner Circle:
    # Clean inner ring with bevel and specular edge.
    # Center divider:
    # 3D golden vertical bar with bevel and rounded tips.
    # Left Leaf:
    # 5-part botanical leaf crest with hollow/embossed gold outlines:
    # - Top vertical leaf with central spine
    # - 2 Upper diagonal leaves angled up-left and up-right
    # - 2 Lower horizontal leaflets
    # - Vertical stem with base ball terminal
    # Right C:
    # Classical Roman serif 'C' with upper teardrop bulb and lower flared serif.
    # Text 'CARe':
    # High-contrast Roman serif with 3D metallic bevel, capital C, A, R and small e.
    # Ornamental rule:
    # Golden line with central clover knot and beads.
    # Tagline:
    # 'A BEAUTY SOLUTION' with wide tracking.

    cx, cy = 400, 310
    radius = 160
    num_petals = 24
    
    # Generate outer guilloche mesh
    wreath_elements = []
    
    # Shadow layer
    for i in range(num_petals):
        angle = i * (360.0 / num_petals)
        wreath_elements.append(
            f'<ellipse cx="{cx+1.5}" cy="{cy+2.5}" rx="172" ry="58" transform="rotate({angle:.2f} {cx} {cy})" '
            f'fill="none" stroke="#2D1700" stroke-width="4.2" opacity="0.32" />'
        )
    # Darker base gold wire
    for i in range(num_petals):
        angle = i * (360.0 / num_petals)
        wreath_elements.append(
            f'<ellipse cx="{cx}" cy="{cy}" rx="172" ry="58" transform="rotate({angle:.2f} {cx} {cy})" '
            f'fill="none" stroke="url(#goldDarkWire)" stroke-width="4.8" />'
        )
    # Mid-tone gold wire
    for i in range(num_petals):
        angle = i * (360.0 / num_petals)
        wreath_elements.append(
            f'<ellipse cx="{cx}" cy="{cy}" rx="172" ry="58" transform="rotate({angle:.2f} {cx} {cy})" '
            f'fill="none" stroke="url(#goldMidWire)" stroke-width="3.2" />'
        )
    # Specular bright highlight wire
    for i in range(num_petals):
        angle = i * (360.0 / num_petals)
        wreath_elements.append(
            f'<ellipse cx="{cx-0.7}" cy="{cy-0.7}" rx="172" ry="58" transform="rotate({angle:.2f} {cx} {cy})" '
            f'fill="none" stroke="url(#goldShineWire)" stroke-width="1.2" opacity="0.95" />'
        )

    wreath_markup = "\n    ".join(wreath_elements)

    common_defs = """
    <!-- Ultra-realistic 24K Gold 3D metallic gradients -->
    <linearGradient id="goldDarkWire" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5E3D07" />
      <stop offset="25%" stop-color="#9C6B14" />
      <stop offset="50%" stop-color="#C9A227" />
      <stop offset="75%" stop-color="#8C6A12" />
      <stop offset="100%" stop-color="#4F2D02" />
    </linearGradient>

    <linearGradient id="goldMidWire" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#8C6A12" />
      <stop offset="20%" stop-color="#C9A227" />
      <stop offset="45%" stop-color="#FFF3B8" />
      <stop offset="70%" stop-color="#E8C76A" />
      <stop offset="100%" stop-color="#6B4509" />
    </linearGradient>

    <linearGradient id="goldShineWire" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3B2001" stop-opacity="0.1" />
      <stop offset="35%" stop-color="#FFFFFF" stop-opacity="0.98" />
      <stop offset="65%" stop-color="#FFF5C6" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.98" />
    </linearGradient>

    <linearGradient id="goldMaster3D" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5E3D07" />
      <stop offset="12%" stop-color="#8C6A12" />
      <stop offset="26%" stop-color="#C9A227" />
      <stop offset="42%" stop-color="#FFF9DB" />
      <stop offset="58%" stop-color="#E8C76A" />
      <stop offset="74%" stop-color="#8C6A12" />
      <stop offset="88%" stop-color="#FDF3BA" />
      <stop offset="100%" stop-color="#4F2D02" />
    </linearGradient>

    <linearGradient id="goldRodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4E2A01" />
      <stop offset="20%" stop-color="#C9A227" />
      <stop offset="46%" stop-color="#FFFFFF" />
      <stop offset="72%" stop-color="#E8C76A" />
      <stop offset="90%" stop-color="#8C6A12" />
      <stop offset="100%" stop-color="#3D1D00" />
    </linearGradient>

    <filter id="softEmboss" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1.8" dy="3.2" stdDeviation="2.5" flood-color="#241200" flood-opacity="0.45" />
      <feDropShadow dx="-0.8" dy="-0.8" stdDeviation="1" flood-color="#FFFCE6" flood-opacity="0.8" />
    </filter>

    <filter id="masterDropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="4" stdDeviation="3.5" flood-color="#221100" flood-opacity="0.38" />
      <feDropShadow dx="-1" dy="-1" stdDeviation="1.5" flood-color="#FFFFFF" flood-opacity="0.75" />
    </filter>
    """

    # 1. Full Master Vertical Logo SVG
    master_logo_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 820" width="100%" height="100%">
  <defs>
    {common_defs}
  </defs>

  <g id="care-official-logo" filter="url(#masterDropShadow)">
    
    <!-- ============================================================ -->
    <!-- 1. CIRCULAR EMBLEM (CENTER: 400, 310)                        -->
    <!-- ============================================================ -->
    <g id="emblem-container">
      
      <!-- Outer Guilloche Woven Lattice Wreath -->
      <g id="wreath-loops">
        {wreath_markup}
      </g>

      <!-- Inner Concentric Golden Rings -->
      <circle cx="400" cy="310" r="140" fill="none" stroke="url(#goldMaster3D)" stroke-width="6" />
      <circle cx="400" cy="310" r="140" fill="none" stroke="url(#goldShineWire)" stroke-width="1.8" />
      <circle cx="400" cy="310" r="132" fill="none" stroke="url(#goldMaster3D)" stroke-width="2.2" />
      <circle cx="400" cy="310" r="132" fill="none" stroke="url(#goldShineWire)" stroke-width="0.8" />

      <!-- Center Dividing Gold Bar -->
      <g id="center-divider" filter="url(#softEmboss)">
        <rect x="396.5" y="206" width="7" height="208" rx="3.5" fill="url(#goldRodGradient)" stroke="url(#goldShineWire)" stroke-width="0.6" />
        <line x1="398.2" y1="209" x2="398.2" y2="411" stroke="#FFFFFF" stroke-width="1.1" opacity="0.95" stroke-linecap="round" />
      </g>

      <!-- ============================================================ -->
      <!-- LEFT: 5-LEAF BOTANICAL CREST (AUTHENTIC EMBOSSED HOLLOW CORE) -->
      <!-- ============================================================ -->
      <g id="left-leaf-crest" transform="translate(322, 310)" filter="url(#softEmboss)">
        <!-- Center Top Pointed Leaf -->
        <g>
          <path d="M 0 -46 C -17 -26, -17 -6, 0 8 C 17 -6, 17 -26, 0 -46 Z" 
                fill="none" stroke="url(#goldMaster3D)" stroke-width="6.5" stroke-linejoin="round" />
          <path d="M 0 -46 C -17 -26, -17 -6, 0 8 C 17 -6, 17 -26, 0 -46 Z" 
                fill="none" stroke="url(#goldShineWire)" stroke-width="1.8" />
          <line x1="0" y1="-38" x2="0" y2="5" stroke="url(#goldMaster3D)" stroke-width="2.6" stroke-linecap="round" />
          <line x1="-0.4" y1="-38" x2="-0.4" y2="5" stroke="#FFFFFF" stroke-width="0.9" opacity="0.9" stroke-linecap="round" />
        </g>

        <!-- Upper-Left Angled Leaf -->
        <g>
          <path d="M -6 -13 C -33 -32, -44 -9, -8 4 C -3 3, -1 -2, -6 -13 Z" 
                fill="none" stroke="url(#goldMaster3D)" stroke-width="6" stroke-linejoin="round" />
          <path d="M -6 -13 C -33 -32, -44 -9, -8 4 C -3 3, -1 -2, -6 -13 Z" 
                fill="none" stroke="url(#goldShineWire)" stroke-width="1.6" />
          <line x1="-22" y1="-17" x2="-5" y2="0" stroke="url(#goldMaster3D)" stroke-width="2.4" stroke-linecap="round" />
        </g>

        <!-- Upper-Right Angled Leaf -->
        <g>
          <path d="M 6 -13 C 33 -32, 44 -9, 8 4 C 3 3, 1 -2, 6 -13 Z" 
                fill="none" stroke="url(#goldMaster3D)" stroke-width="6" stroke-linejoin="round" />
          <path d="M 6 -13 C 33 -32, 44 -9, 8 4 C 3 3, 1 -2, 6 -13 Z" 
                fill="none" stroke="url(#goldShineWire)" stroke-width="1.6" />
          <line x1="22" y1="-17" x2="5" y2="0" stroke="url(#goldMaster3D)" stroke-width="2.4" stroke-linecap="round" />
        </g>

        <!-- Lower-Left Horizontal Lobe -->
        <path d="M -6 6 C -28 5, -34 20, -7 16 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="5" />
        <path d="M -6 6 C -28 5, -34 20, -7 16 Z" fill="none" stroke="url(#goldShineWire)" stroke-width="1.2" />

        <!-- Lower-Right Horizontal Lobe -->
        <path d="M 6 6 C 28 5, 34 20, 7 16 Z" fill="none" stroke="url(#goldMaster3D)" stroke-width="5" />
        <path d="M 6 6 C 28 5, 34 20, 7 16 Z" fill="none" stroke="url(#goldShineWire)" stroke-width="1.2" />

        <!-- Base Stem & Bottom Terminal Bead -->
        <path d="M 0 8 L 0 36" stroke="url(#goldMaster3D)" stroke-width="6.2" stroke-linecap="round" />
        <path d="M -0.8 8 L -0.8 34" stroke="#FFFFFF" stroke-width="1.5" opacity="0.9" stroke-linecap="round" />
        <circle cx="0" cy="36" r="3.4" fill="url(#goldMaster3D)" stroke="url(#goldShineWire)" stroke-width="1" />
      </g>

      <!-- ============================================================ -->
      <!-- RIGHT: CLASSICAL ROMAN SERIF 'C' MONOGRAM                    -->
      <!-- ============================================================ -->
      <g id="right-monogram-c" transform="translate(476, 310)" filter="url(#softEmboss)">
        <!-- Roman C Arch -->
        <path d="M 35 -36 C 29 -45, 20 -50, 7 -50 C -19 -50 -36 -30 -36 0 C -36 30 -19 50 7 50 C 21 50 31 43 36 35 L 28 29 C 23 36 16 41 7 41 C -12 41 -24 25 -24 0 C -24 -25 -12 -41 7 -41 C 16 -41 23 -37 27 -31 Z" 
              fill="url(#goldMaster3D)" stroke="url(#goldShineWire)" stroke-width="2" />
        
        <!-- Top Teardrop Terminal Bulb -->
        <circle cx="34" cy="-34" r="7.2" fill="url(#goldMaster3D)" stroke="url(#goldShineWire)" stroke-width="1.3" />
        <circle cx="32.5" cy="-35.5" r="2.3" fill="#FFFFFF" opacity="0.95" />

        <!-- Lower Flared Serif Foot -->
        <path d="M 25 29 L 41 37 L 27 43 Z" fill="url(#goldMaster3D)" stroke="url(#goldShineWire)" stroke-width="1" />
      </g>

    </g>

    <!-- ============================================================ -->
    <!-- 2. BRAND WORDMARK 'CARe'                                      -->
    <!-- ============================================================ -->
    <g id="wordmark-care" transform="translate(400, 600)" filter="url(#softEmboss)" text-anchor="middle">
      <text font-family="'Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Times New Roman', serif" 
            font-size="108" 
            font-weight="900" 
            letter-spacing="20" 
            fill="url(#goldMaster3D)" 
            stroke="url(#goldShineWire)" 
            stroke-width="2.2">
        <tspan x="-178">C</tspan>
        <tspan x="-60">A</tspan>
        <tspan x="60">R</tspan>
        <tspan x="178" font-size="98" dy="3">e</tspan>
      </text>
    </g>

    <!-- ============================================================ -->
    <!-- 3. ORNAMENTAL DIVIDER WITH CLOVER KNOT                        -->
    <!-- ============================================================ -->
    <g id="divider-rule" transform="translate(400, 662)" filter="url(#softEmboss)">
      <!-- Left tapered bar -->
      <line x1="-280" y1="0" x2="-45" y2="0" stroke="url(#goldMaster3D)" stroke-width="3.5" stroke-linecap="round" />
      <line x1="-280" y1="-1" x2="-45" y2="-1" stroke="url(#goldShineWire)" stroke-width="1.3" stroke-linecap="round" />

      <!-- Center Flourish Knot -->
      <g id="knot">
        <path d="M 0 -12 C -10 -2, -10 2, 0 12 C 10 2, 10 -2, 0 -12 Z" 
              fill="url(#goldMaster3D)" stroke="url(#goldShineWire)" stroke-width="1.5" />
        <circle cx="0" cy="0" r="2.8" fill="#FFFFFF" opacity="0.95" />

        <path d="M -4 0 C -18 -12, -26 0, -4 8 Z" 
              fill="url(#goldMaster3D)" stroke="url(#goldShineWire)" stroke-width="1.3" />
        <path d="M 4 0 C 18 -12, 26 0, 4 8 Z" 
              fill="url(#goldMaster3D)" stroke="url(#goldShineWire)" stroke-width="1.3" />
        
        <circle cx="-31" cy="0" r="5.2" fill="url(#goldMaster3D)" stroke="url(#goldShineWire)" stroke-width="1.1" />
        <circle cx="-32" cy="-1.5" r="1.7" fill="#FFFFFF" opacity="0.95" />
        <circle cx="31" cy="0" r="5.2" fill="url(#goldMaster3D)" stroke="url(#goldShineWire)" stroke-width="1.1" />
        <circle cx="30" cy="-1.5" r="1.7" fill="#FFFFFF" opacity="0.95" />
      </g>

      <!-- Right tapered bar -->
      <line x1="45" y1="0" x2="280" y2="0" stroke="url(#goldMaster3D)" stroke-width="3.5" stroke-linecap="round" />
      <line x1="45" y1="-1" x2="280" y2="-1" stroke="url(#goldShineWire)" stroke-width="1.3" stroke-linecap="round" />
    </g>

    <!-- ============================================================ -->
    <!-- 4. TAGLINE 'A BEAUTY SOLUTION'                                -->
    <!-- ============================================================ -->
    <g id="tagline" transform="translate(400, 718)" filter="url(#softEmboss)">
      <text font-family="'Cinzel', 'Playfair Display', 'Plus Jakarta Sans', Georgia, serif" 
            font-size="28" 
            font-weight="900" 
            letter-spacing="15" 
            fill="url(#goldMaster3D)" 
            stroke="url(#goldShineWire)" 
            stroke-width="1" 
            text-anchor="middle">
        A BEAUTY SOLUTION
      </text>
    </g>

  </g>
</svg>"""

    # 2. Horizontal Navbar Logo SVG (Emblem + CARe)
    navbar_logo_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 84" width="100%" height="100%">
  <defs>
    {common_defs}
  </defs>

  <g id="care-navbar-lockup" filter="url(#softEmboss)">
    
    <!-- EMBLEM MEDALLION (CENTER: 42, 42) -->
    <g id="nav-emblem" transform="translate(42, 42)">
      
      <!-- Woven Guilloche Mesh scaled -->
      <g transform="scale(0.245) translate(-400, -310)">
        {wreath_markup}
      </g>

      <!-- Double Gold Rings -->
      <circle cx="0" cy="0" r="26.8" fill="none" stroke="url(#goldMaster3D)" stroke-width="1.8" />
      <circle cx="0" cy="0" r="26.8" fill="none" stroke="url(#goldShineWire)" stroke-width="0.7" />
      <circle cx="0" cy="0" r="25" fill="none" stroke="url(#goldMaster3D)" stroke-width="0.9" />

      <!-- Center Dividing Bar -->
      <rect x="-0.8" y="-19.5" width="1.6" height="39" rx="0.8" fill="url(#goldRodGradient)" stroke="url(#goldShineWire)" stroke-width="0.3" />
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
              fill="url(#goldMaster3D)" stroke="url(#goldShineWire)" stroke-width="2" />
        <circle cx="34" cy="-34" r="7.2" fill="url(#goldMaster3D)" stroke="url(#goldShineWire)" stroke-width="1.2" />
        <path d="M 25 29 L 41 37 L 27 43 Z" fill="url(#goldMaster3D)" />
      </g>

    </g>

    <!-- RIGHT: 'CARe' (CLASSICAL ROMAN SERIF) -->
    <g transform="translate(94, 53)">
      <text font-family="'Cinzel', 'Playfair Display', Georgia, serif" 
            font-size="44" 
            font-weight="900" 
            letter-spacing="6" 
            fill="url(#goldMaster3D)" 
            stroke="url(#goldShineWire)" 
            stroke-width="1">
        <tspan x="0">C</tspan>
        <tspan x="38">A</tspan>
        <tspan x="78">R</tspan>
        <tspan x="118" font-size="39" dy="1">e</tspan>
      </text>
    </g>

  </g>
</svg>"""

    # 3. Circular Emblem Only (Favicon & Mobile Icon)
    emblem_only_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    {common_defs}
  </defs>

  <g id="care-emblem-icon" transform="translate(200, 200)" filter="url(#masterDropShadow)">
    
    <!-- Woven Guilloche Mesh -->
    <g transform="scale(0.85) translate(-400, -310)">
      {wreath_markup}
    </g>

    <!-- Inner Gold Double Rings -->
    <circle cx="0" cy="0" r="114" fill="none" stroke="url(#goldMaster3D)" stroke-width="5" />
    <circle cx="0" cy="0" r="114" fill="none" stroke="url(#goldShineWire)" stroke-width="1.6" />
    <circle cx="0" cy="0" r="107" fill="none" stroke="url(#goldMaster3D)" stroke-width="2.2" />

    <!-- Center Dividing Bar -->
    <rect x="-3" y="-84" width="6" height="168" rx="3" fill="url(#goldRodGradient)" stroke="url(#goldShineWire)" stroke-width="0.8" />
    <line x1="-0.8" y1="-82" x2="-0.8" y2="82" stroke="#FFFFFF" stroke-width="1.2" opacity="0.95" />

    <!-- Left Botanical Leaf Crest -->
    <g transform="translate(-62, 0)" filter="url(#softEmboss)">
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
    <g transform="translate(62, 0)" filter="url(#softEmboss)">
      <path d="M 35 -36 C 29 -45, 20 -50, 7 -50 C -19 -50 -36 -30 -36 0 C -36 30 -19 50 7 50 C 21 50 31 43 36 35 L 28 29 C 23 36 16 41 7 41 C -12 41 -24 25 -24 0 C -24 -25 -12 -41 7 -41 C 16 -41 23 -37 27 -31 Z" 
            fill="url(#goldMaster3D)" stroke="url(#goldShineWire)" stroke-width="2.2" />
      <circle cx="34" cy="-34" r="7.5" fill="url(#goldMaster3D)" stroke="url(#goldShineWire)" stroke-width="1.4" />
      <circle cx="32.5" cy="-35.5" r="2.4" fill="#FFFFFF" opacity="0.95" />
      <path d="M 25 29 L 41 37 L 27 43 Z" fill="url(#goldMaster3D)" stroke="url(#goldShineWire)" stroke-width="1.2" />
    </g>

  </g>
</svg>"""

    with open("public/images/care-official-gold-logo.svg", "w") as f:
        f.write(master_logo_svg)

    with open("public/images/care-official-gold-logo-horizontal.svg", "w") as f:
        f.write(navbar_logo_svg)

    with open("public/images/care-emblem-icon.svg", "w") as f:
        f.write(emblem_only_svg)
    with open("public/favicon.svg", "w") as f:
        f.write(emblem_only_svg)

    print("All vector assets generated matching the authentic brand sheet.")

if __name__ == "__main__":
    build_svg()
