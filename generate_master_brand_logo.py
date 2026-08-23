import math

def generate_full_logo_svg():
    # 1. Guilloche Braided Wire Lattice (Outer Wreath)
    # The original artwork has a rich woven wire wreath consisting of 24 overlapping oval rings
    num_loops = 24
    cx, cy = 400, 310
    rx, ry = 190, 62  # Major and minor radii for the overlapping loops
    
    wire_layers = []
    
    # Bottom cast shadow for woven wire
    for i in range(num_loops):
        angle = i * (360.0 / num_loops)
        wire_layers.append(f'<ellipse cx="{cx+1.5}" cy="{cy+3}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" fill="none" stroke="#2B1601" stroke-width="3" opacity="0.35" />')

    # Main metallic gold wires
    for i in range(num_loops):
        angle = i * (360.0 / num_loops)
        wire_layers.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" fill="none" stroke="url(#goldWireGradient)" stroke-width="3.6" />')

    # Top specular highlights on wires
    for i in range(num_loops):
        angle = i * (360.0 / num_loops)
        wire_layers.append(f'<ellipse cx="{cx-0.8}" cy="{cy-0.8}" rx="{rx}" ry="{ry}" transform="rotate({angle:.2f} {cx} {cy})" fill="none" stroke="url(#goldSpecularGradient)" stroke-width="1.4" opacity="0.85" />')

    wires_markup = "\n    ".join(wire_layers)

    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 920" width="100%" height="100%">
  <defs>
    <!-- Master Realistic 24K Luxury Gold Gradients -->
    <linearGradient id="goldMaster" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#543003" />
      <stop offset="12%" stop-color="#9C6B14" />
      <stop offset="25%" stop-color="#E2B13F" />
      <stop offset="38%" stop-color="#FFF5C2" />
      <stop offset="52%" stop-color="#DEAA35" />
      <stop offset="68%" stop-color="#915F0D" />
      <stop offset="82%" stop-color="#FCEBA4" />
      <stop offset="100%" stop-color="#4F2B02" />
    </linearGradient>

    <linearGradient id="goldWireGradient" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#6E4006" />
      <stop offset="22%" stop-color="#DFAC38" />
      <stop offset="48%" stop-color="#FFF6CC" />
      <stop offset="72%" stop-color="#B8831F" />
      <stop offset="100%" stop-color="#4E2901" />
    </linearGradient>

    <linearGradient id="goldSpecularGradient" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3A1E00" stop-opacity="0.1" />
      <stop offset="35%" stop-color="#FFFDF0" stop-opacity="0.95" />
      <stop offset="70%" stop-color="#DDA934" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.95" />
    </linearGradient>

    <linearGradient id="goldRodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4A2600" />
      <stop offset="20%" stop-color="#C59328" />
      <stop offset="45%" stop-color="#FFF8D6" />
      <stop offset="70%" stop-color="#D59F2D" />
      <stop offset="88%" stop-color="#7E4E0A" />
      <stop offset="100%" stop-color="#3D1D00" />
    </linearGradient>

    <linearGradient id="leafGoldFill" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5A0C" />
      <stop offset="25%" stop-color="#F5DB87" />
      <stop offset="55%" stop-color="#DFAC38" />
      <stop offset="85%" stop-color="#FDF1B8" />
      <stop offset="100%" stop-color="#6B3F04" />
    </linearGradient>

    <!-- 3D Bevel & Cast Shadow Filters -->
    <filter id="masterEmboss" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="4" stdDeviation="3.5" flood-color="#261300" flood-opacity="0.5" />
      <feDropShadow dx="-1" dy="-1" stdDeviation="1.5" flood-color="#FFFDEB" flood-opacity="0.7" />
    </filter>

    <filter id="fineShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1.5" dy="2.5" stdDeviation="2" flood-color="#2D1701" flood-opacity="0.45" />
    </filter>

    <filter id="wordmark3D" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#281300" flood-opacity="0.55" />
      <feDropShadow dx="-0.8" dy="-0.8" stdDeviation="1.2" flood-color="#FFFBE0" flood-opacity="0.8" />
    </filter>
  </defs>

  <g id="care-official-brand-artwork">
    
    <!-- ============================================================ -->
    <!-- 1. CIRCULAR EMBLEM (CENTER: 400, 310)                        -->
    <!-- ============================================================ -->
    <g id="emblem-group" filter="url(#masterEmboss)">
      
      <!-- OUTSIDE WOVEN GUILLOCHE WREATH -->
      <g id="guilloche-wreath">
        {wires_markup}
      </g>

      <!-- INNER SOLID DOUBLE GOLD RINGS & WHITE MEDALLION DISC -->
      <!-- Inner crisp background disc -->
      <circle cx="400" cy="310" r="154" fill="#FFFFFF" />
      
      <!-- Outer Solid Ring of Double Circle -->
      <circle cx="400" cy="310" r="154" fill="none" stroke="url(#goldMaster)" stroke-width="6.5" />
      <circle cx="400" cy="310" r="154" fill="none" stroke="url(#goldSpecularGradient)" stroke-width="2.2" />
      
      <!-- Inner Thin Ring of Double Circle -->
      <circle cx="400" cy="310" r="145" fill="none" stroke="url(#goldMaster)" stroke-width="2.8" />
      <circle cx="400" cy="310" r="145" fill="none" stroke="url(#goldSpecularGradient)" stroke-width="1.2" />

      <!-- CENTER VERTICAL DIVIDING GOLD ROD -->
      <g id="center-dividing-rod">
        <!-- Shadow -->
        <rect x="398.5" y="200" width="9" height="220" rx="4.5" fill="#291400" opacity="0.35" filter="url(#fineShadow)" />
        <!-- Gold 3D Cylinder -->
        <rect x="396" y="198" width="8" height="220" rx="4" fill="url(#goldRodGradient)" stroke="url(#goldSpecularGradient)" stroke-width="1.2" />
        <!-- Specular Highlight Line -->
        <line x1="398" y1="202" x2="398" y2="414" stroke="#FFFFFF" stroke-width="1.4" opacity="0.9" stroke-linecap="round" />
      </g>

      <!-- ========================================================== -->
      <!-- LEFT SIDE: 5-LEAF BOTANICAL EMBLEM CREST (PROMINENT & CRISP) -->
      <!-- ========================================================== -->
      <g id="left-leaf-crest" transform="translate(316, 310)">
        
        <!-- 1. Center Top Vertical Leaf -->
        <path d="M 0 -50 C -18 -28, -18 -8, 0 10 C 18 -8, 18 -28, 0 -50 Z" 
              fill="url(#leafGoldFill)" stroke="url(#goldMaster)" stroke-width="3.5" />
        <path d="M 0 -45 C -13 -26, -13 -10, 0 5 C 13 -10, 13 -26, 0 -45 Z" 
              fill="none" stroke="url(#goldSpecularGradient)" stroke-width="1.5" />
        <!-- Top Leaf Center Vein -->
        <line x1="0" y1="-40" x2="0" y2="7" stroke="#4F2B02" stroke-width="2" />
        <line x1="-0.5" y1="-40" x2="-0.5" y2="7" stroke="#FFF7D1" stroke-width="1" />

        <!-- 2. Upper-Left Angled Leaf -->
        <path d="M -6 -10 C -34 -32, -50 -8, -10 6 C -5 5, -2 0, -6 -10 Z" 
              fill="url(#leafGoldFill)" stroke="url(#goldMaster)" stroke-width="3.2" />
        <!-- Vein -->
        <line x1="-25" y1="-16" x2="-5" y2="2" stroke="#4F2B02" stroke-width="1.8" />
        <line x1="-25.5" y1="-16.5" x2="-5.5" y2="1.5" stroke="#FFF7D1" stroke-width="0.8" />

        <!-- 3. Upper-Right Angled Leaf -->
        <path d="M 6 -10 C 34 -32, 50 -8, 10 6 C 5 5, 2 0, 6 -10 Z" 
              fill="url(#leafGoldFill)" stroke="url(#goldMaster)" stroke-width="3.2" />
        <!-- Vein -->
        <line x1="25" y1="-16" x2="5" y2="2" stroke="#4F2B02" stroke-width="1.8" />
        <line x1="24.5" y1="-16.5" x2="4.5" y2="1.5" stroke="#FFF7D1" stroke-width="0.8" />

        <!-- 4. Lower-Left Horizontal Leaf -->
        <path d="M -6 8 C -40 2, -48 26, -9 24 C -4 22, -4 14, -6 8 Z" 
              fill="url(#leafGoldFill)" stroke="url(#goldMaster)" stroke-width="3.2" />
        <!-- Vein -->
        <line x1="-26" y1="15" x2="-5" y2="16" stroke="#4F2B02" stroke-width="1.8" />
        <line x1="-26" y1="14.5" x2="-5" y2="15.5" stroke="#FFF7D1" stroke-width="0.8" />

        <!-- 5. Lower-Right Horizontal Leaf -->
        <path d="M 6 8 C 40 2, 48 26, 9 24 C 4 22, 4 14, 6 8 Z" 
              fill="url(#leafGoldFill)" stroke="url(#goldMaster)" stroke-width="3.2" />
        <!-- Vein -->
        <line x1="26" y1="15" x2="5" y2="16" stroke="#4F2B02" stroke-width="1.8" />
        <line x1="26" y1="14.5" x2="5" y2="15.5" stroke="#FFF7D1" stroke-width="0.8" />

        <!-- Center Botanical Stem & Base -->
        <path d="M 0 8 L 0 42" stroke="url(#goldRodGradient)" stroke-width="6.5" stroke-linecap="round" />
        <path d="M -1 9 L -1 39" stroke="#FFF8D6" stroke-width="2" stroke-linecap="round" />
        <circle cx="0" cy="42" r="4.2" fill="url(#goldMaster)" stroke="url(#goldSpecularGradient)" stroke-width="1" />
      </g>

      <!-- ========================================================== -->
      <!-- RIGHT SIDE: ROMAN SERIF 'C' MONOGRAM                       -->
      <!-- ========================================================== -->
      <g id="right-monogram-c" transform="translate(480, 310)">
        <!-- 3D Beveled Serif 'C' Geometry matching reference exactly -->
        <path d="M 36 -38 C 30 -46, 21 -52, 7 -52 C -21 -52 -40 -31 -40 0 C -40 31 -21 52 7 52 C 22 52 32 44 38 36 L 30 30 C 25 37 18 42 7 42 C -14 42 -27 26 -27 0 C -27 -26 -14 -42 7 -42 C 17 -42 24 -38 29 -32 Z" 
              fill="url(#goldMaster)" stroke="url(#goldSpecularGradient)" stroke-width="2.6" />
        
        <!-- Top Teardrop Terminal Bulb -->
        <circle cx="35" cy="-36" r="7.5" fill="url(#goldMaster)" stroke="url(#goldSpecularGradient)" stroke-width="1.5" />
        <circle cx="33.5" cy="-37.5" r="2.5" fill="#FFFFFF" opacity="0.9" />

        <!-- Bottom Flared Serif Terminal -->
        <path d="M 26 30 L 42 38 L 28 44 Z" fill="url(#goldMaster)" stroke="url(#goldSpecularGradient)" stroke-width="1.2" />
      </g>

    </g>

    <!-- ============================================================ -->
    <!-- 2. BRAND NAME 'CARe'                                         -->
    <!-- Capital C, Capital A, Capital R, Lowercase e                 -->
    <!-- ============================================================ -->
    <g id="brand-name-care" transform="translate(400, 655)" filter="url(#wordmark3D)" text-anchor="middle">
      <text font-family="'Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Times New Roman', serif" 
            font-size="116" 
            font-weight="900" 
            letter-spacing="20" 
            fill="url(#goldMaster)" 
            stroke="url(#goldSpecularGradient)" 
            stroke-width="2.4">
        <tspan x="-190">C</tspan>
        <tspan x="-65">A</tspan>
        <tspan x="65">R</tspan>
        <tspan x="190" font-size="106" dy="3">e</tspan>
      </text>
    </g>

    <!-- ============================================================ -->
    <!-- 3. DECORATIVE ORNAMENTAL DIVIDER WITH BOTANICAL KNOT         -->
    <!-- ============================================================ -->
    <g id="decorative-divider" transform="translate(400, 720)">
      <!-- Left Fine Rule with tapered ends -->
      <line x1="-300" y1="0" x2="-48" y2="0" stroke="url(#goldMaster)" stroke-width="3.6" stroke-linecap="round" />
      <line x1="-300" y1="-1" x2="-48" y2="-1" stroke="url(#goldSpecularGradient)" stroke-width="1.5" stroke-linecap="round" />

      <!-- Center Botanical Flourish Knot -->
      <g id="flourish-knot">
        <!-- Center Oval Diamond Leaflet -->
        <path d="M 0 -13 C -10 -3, -10 3, 0 13 C 10 3, 10 -3, 0 -13 Z" 
              fill="url(#goldMaster)" stroke="url(#goldSpecularGradient)" stroke-width="1.8" />
        <circle cx="0" cy="0" r="3" fill="#FFFFFF" opacity="0.95" />

        <!-- Left Loop -->
        <path d="M -4 0 C -20 -13, -28 0, -4 8 Z" 
              fill="url(#goldMaster)" stroke="url(#goldSpecularGradient)" stroke-width="1.5" />
        
        <!-- Right Loop -->
        <path d="M 4 0 C 20 -13, 28 0, 4 8 Z" 
              fill="url(#goldMaster)" stroke="url(#goldSpecularGradient)" stroke-width="1.5" />
        
        <!-- Flanking Gold Accent Beads -->
        <circle cx="-33" cy="0" r="5.5" fill="url(#goldMaster)" stroke="url(#goldSpecularGradient)" stroke-width="1.2" />
        <circle cx="-34" cy="-1.5" r="2" fill="#FFFFFF" opacity="0.95" />
        <circle cx="33" cy="0" r="5.5" fill="url(#goldMaster)" stroke="url(#goldSpecularGradient)" stroke-width="1.2" />
        <circle cx="32" cy="-1.5" r="2" fill="#FFFFFF" opacity="0.95" />
      </g>

      <!-- Right Fine Rule with tapered ends -->
      <line x1="48" y1="0" x2="300" y2="0" stroke="url(#goldMaster)" stroke-width="3.6" stroke-linecap="round" />
      <line x1="48" y1="-1" x2="300" y2="-1" stroke="url(#goldSpecularGradient)" stroke-width="1.5" stroke-linecap="round" />
    </g>

    <!-- ============================================================ -->
    <!-- 4. TAGLINE 'A BEAUTY SOLUTION'                                -->
    <!-- ============================================================ -->
    <g id="brand-tagline" transform="translate(400, 785)" filter="url(#wordmark3D)">
      <text font-family="'Cinzel', 'Playfair Display', 'Plus Jakarta Sans', Georgia, serif" 
            font-size="28" 
            font-weight="900" 
            letter-spacing="16" 
            fill="url(#goldMaster)" 
            stroke="url(#goldSpecularGradient)" 
            stroke-width="1" 
            text-anchor="middle">
        A BEAUTY SOLUTION
      </text>
    </g>

  </g>
</svg>"""

    with open("public/images/care-official-gold-logo.svg", "w") as f:
        f.write(svg_content)
    print("Master brand logo saved at public/images/care-official-gold-logo.svg")

if __name__ == "__main__":
    generate_full_logo_svg()
